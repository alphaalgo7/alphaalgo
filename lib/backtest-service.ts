import ZerodhaClient from "./zerodha-client"

export interface BacktestParams {
  symbol: string
  fromDate: string
  toDate: string
  timeFrame: string
  strategy: "reverseDecay" | "ivSpike" | "combined"
  entryThreshold: number
  exitThreshold: number
  stopLoss: number
  targetProfit: number
}

export interface BacktestResult {
  trades: BacktestTrade[]
  summary: BacktestSummary
  equityCurve: EquityPoint[]
}

export interface BacktestTrade {
  entryDate: string
  entryPrice: number
  exitDate: string
  exitPrice: number
  pnl: number
  pnlPercent: number
  duration: number
  exitReason: "target" | "stopLoss" | "threshold" | "endOfPeriod"
  metrics: {
    rds: number
    ivScore: number
    riskFactor: number
  }
}

export interface BacktestSummary {
  totalTrades: number
  winningTrades: number
  losingTrades: number
  winRate: number
  averageWin: number
  averageLoss: number
  profitFactor: number
  maxDrawdown: number
  netPnl: number
  netPnlPercent: number
  sharpeRatio: number
}

export interface EquityPoint {
  date: string
  equity: number
}

export interface HistoricalDataPoint {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  callPrice: number
  putPrice: number
  straddlePrice: number
  expectedPrice: number
  rds: number
  ivScore: number
}

class BacktestService {
  private zerodhaClient: ZerodhaClient | null = null

  constructor() {
    // Initialize Zerodha client if credentials are available
    try {
      this.zerodhaClient = new ZerodhaClient()
      // Only use the client if it's properly initialized
      if (!this.zerodhaClient.isInitialized()) {
        this.zerodhaClient = null
        console.warn("Zerodha client not initialized. Using mock data for backtesting.")
      }
    } catch (error) {
      console.warn("Zerodha client not initialized. Using mock data for backtesting.")
      this.zerodhaClient = null
    }
  }

  // Run backtest with given parameters
  async runBacktest(params: BacktestParams): Promise<BacktestResult> {
    // Fetch historical data
    const historicalData = await this.fetchHistoricalData(params)

    // Run strategy on historical data
    const trades = this.executeStrategy(historicalData, params)

    // Calculate performance metrics
    const summary = this.calculateSummary(trades)

    // Generate equity curve
    const equityCurve = this.generateEquityCurve(trades)

    return {
      trades,
      summary,
      equityCurve,
    }
  }

  // Fetch historical data from Zerodha or use mock data
  private async fetchHistoricalData(params: BacktestParams): Promise<HistoricalDataPoint[]> {
    if (this.zerodhaClient && this.zerodhaClient.isInitialized() && this.zerodhaClient.isAuthenticated()) {
      try {
        // Try to fetch real historical data
        return await this.fetchZerodhaHistoricalData(params)
      } catch (error) {
        console.error("Error fetching Zerodha historical data:", error)
        // Fall back to mock data
        return this.generateMockHistoricalData(params)
      }
    } else {
      // Use mock data if Zerodha client is not available
      return this.generateMockHistoricalData(params)
    }
  }

  // Fetch historical data from Zerodha
  private async fetchZerodhaHistoricalData(params: BacktestParams): Promise<HistoricalDataPoint[]> {
    if (!this.zerodhaClient) throw new Error("Zerodha client not initialized")

    // Get instrument token for the symbol
    const instruments = await this.zerodhaClient.getInstruments()
    const instrument = instruments.find((i: any) => i.tradingsymbol === params.symbol)

    if (!instrument) {
      throw new Error(`Instrument not found for symbol: ${params.symbol}`)
    }

    // Fetch historical OHLC data
    const ohlcData = await this.zerodhaClient.getHistoricalData(
      instrument.instrument_token,
      params.timeFrame,
      params.fromDate,
      params.toDate,
    )

    // For options data, we need to find ATM options for each day
    // This is a simplified approach - in a real implementation, you'd need to
    // fetch option chain data for each day and find ATM options

    // Transform the data to our format
    return ohlcData.map((candle: any) => {
      // Calculate synthetic option prices based on underlying
      // In a real implementation, you'd use actual option prices
      const underlyingPrice = candle.close
      const volatility = 0.2 + Math.random() * 0.1 // Simulated IV between 20-30%

      // Very simplified option pricing (not Black-Scholes)
      const daysToExpiry = 30 // Assuming 30 days to expiry
      const callPrice = volatility * underlyingPrice * Math.sqrt(daysToExpiry / 365) * 0.4
      const putPrice = callPrice * 0.9 // Slightly OTM put

      const straddlePrice = callPrice + putPrice

      // Calculate expected price based on time decay
      // Simplified theta decay model
      const timeDecay = Math.exp(-0.01 * (30 - daysToExpiry))
      const expectedPrice = straddlePrice * timeDecay

      // Calculate RDS
      const rds = (straddlePrice - expectedPrice) / expectedPrice

      // Simulate IV score
      const ivScore = volatility - 0.25 // Deviation from baseline IV

      return {
        date: new Date(candle.date).toISOString(),
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
        volume: candle.volume,
        callPrice,
        putPrice,
        straddlePrice,
        expectedPrice,
        rds,
        ivScore,
      }
    })
  }

  // Generate mock historical data for backtesting
  private generateMockHistoricalData(params: BacktestParams): HistoricalDataPoint[] {
    const data: HistoricalDataPoint[] = []

    // Parse date range
    const fromDate = new Date(params.fromDate)
    const toDate = new Date(params.toDate)

    // Generate daily data points
    const currentDate = new Date(fromDate)
    let basePrice = 100 + Math.random() * 50 // Random starting price between 100-150
    let trend = 0
    let volatility = 0.2

    while (currentDate <= toDate) {
      // Skip weekends
      const dayOfWeek = currentDate.getDay()
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Simulate price movement
        trend = trend * 0.9 + (Math.random() - 0.5) * 0.2
        volatility = Math.max(0.1, Math.min(0.4, volatility * 0.95 + Math.random() * 0.05))

        const dailyChange = trend + (Math.random() - 0.5) * volatility
        basePrice = basePrice * (1 + dailyChange)

        // Calculate option prices
        const callPrice = volatility * basePrice * 0.1
        const putPrice = callPrice * (0.8 + Math.random() * 0.4)
        const straddlePrice = callPrice + putPrice

        // Calculate expected price (theoretical decay)
        // Simulate time decay effect
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
        const dayOfMonth = currentDate.getDate()
        const timeDecay = Math.exp(-0.01 * (daysInMonth - dayOfMonth))
        const expectedPrice = straddlePrice * timeDecay

        // Calculate RDS with some randomness to simulate reverse decay events
        let rds = (straddlePrice - expectedPrice) / expectedPrice

        // Occasionally simulate reverse decay events (10% chance)
        if (Math.random() < 0.1) {
          rds = rds + 0.05 + Math.random() * 0.1
        }

        // Simulate IV score
        const ivScore = volatility - 0.25 + (Math.random() - 0.5) * 0.1

        data.push({
          date: currentDate.toISOString(),
          open: basePrice * (1 - volatility * 0.1),
          high: basePrice * (1 + volatility * 0.15),
          low: basePrice * (1 - volatility * 0.15),
          close: basePrice,
          volume: Math.round(1000000 * (1 + Math.random())),
          callPrice,
          putPrice,
          straddlePrice,
          expectedPrice,
          rds,
          ivScore,
        })
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return data
  }

  // Execute trading strategy on historical data
  private executeStrategy(data: HistoricalDataPoint[], params: BacktestParams): BacktestTrade[] {
    const trades: BacktestTrade[] = []
    let inPosition = false
    let entryData: HistoricalDataPoint | null = null
    let entryIndex = -1

    // Loop through historical data
    for (let i = 1; i < data.length; i++) {
      const yesterday = data[i - 1]
      const today = data[i]

      // Calculate risk factor
      const riskFactor = this.calculateRiskFactor(today)

      if (!inPosition) {
        // Check for entry signal
        let entrySignal = false

        switch (params.strategy) {
          case "reverseDecay":
            entrySignal = today.rds > params.entryThreshold
            break
          case "ivSpike":
            entrySignal = today.ivScore > params.entryThreshold
            break
          case "combined":
            entrySignal = today.rds > params.entryThreshold * 0.7 && today.ivScore > params.entryThreshold * 0.3
            break
        }

        if (entrySignal) {
          inPosition = true
          entryData = today
          entryIndex = i
        }
      } else if (entryData) {
        // Check for exit conditions
        const daysInTrade = i - entryIndex
        const pnlPercent = ((today.close - entryData.close) / entryData.close) * 100

        let exitReason: "target" | "stopLoss" | "threshold" | "endOfPeriod" = "threshold"
        let shouldExit = false

        // Check stop loss
        if (pnlPercent <= -params.stopLoss) {
          shouldExit = true
          exitReason = "stopLoss"
        }
        // Check target profit
        else if (pnlPercent >= params.targetProfit) {
          shouldExit = true
          exitReason = "target"
        }
        // Check exit threshold
        else {
          let exitSignal = false

          switch (params.strategy) {
            case "reverseDecay":
              exitSignal = today.rds < params.exitThreshold
              break
            case "ivSpike":
              exitSignal = today.ivScore < params.exitThreshold
              break
            case "combined":
              exitSignal = today.rds < params.exitThreshold || today.ivScore < params.exitThreshold
              break
          }

          if (exitSignal) {
            shouldExit = true
          }
        }

        // End of backtest period
        if (i === data.length - 1 && inPosition) {
          shouldExit = true
          exitReason = "endOfPeriod"
        }

        if (shouldExit) {
          const pnl = today.close - entryData.close

          trades.push({
            entryDate: new Date(entryData.date).toLocaleDateString(),
            entryPrice: entryData.close,
            exitDate: new Date(today.date).toLocaleDateString(),
            exitPrice: today.close,
            pnl,
            pnlPercent,
            duration: daysInTrade,
            exitReason,
            metrics: {
              rds: entryData.rds,
              ivScore: entryData.ivScore,
              riskFactor: this.calculateRiskFactor(entryData),
            },
          })

          inPosition = false
          entryData = null
          entryIndex = -1
        }
      }
    }

    return trades
  }

  // Calculate risk factor from data point
  private calculateRiskFactor(dataPoint: HistoricalDataPoint): number {
    // Combined RDS and IV score with weights
    const combined = 0.7 * dataPoint.rds + 0.3 * dataPoint.ivScore

    // Convert to 0-100 scale
    return Math.min(100, Math.max(0, combined * 100))
  }

  // Calculate performance summary
  private calculateSummary(trades: BacktestTrade[]): BacktestSummary {
    if (trades.length === 0) {
      return {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        winRate: 0,
        averageWin: 0,
        averageLoss: 0,
        profitFactor: 0,
        maxDrawdown: 0,
        netPnl: 0,
        netPnlPercent: 0,
        sharpeRatio: 0,
      }
    }

    const winningTrades = trades.filter((t) => t.pnl > 0)
    const losingTrades = trades.filter((t) => t.pnl <= 0)

    const totalPnl = trades.reduce((sum, trade) => sum + trade.pnl, 0)
    const totalPnlPercent = trades.reduce((sum, trade) => sum + trade.pnlPercent, 0)

    const grossProfit = winningTrades.reduce((sum, trade) => sum + trade.pnl, 0)
    const grossLoss = Math.abs(losingTrades.reduce((sum, trade) => sum + trade.pnl, 0))

    // Calculate max drawdown
    let maxDrawdown = 0
    let peak = 0
    let equity = 0

    for (const trade of trades) {
      equity += trade.pnl
      if (equity > peak) {
        peak = equity
      }
      const drawdown = peak - equity
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown
      }
    }

    // Calculate Sharpe ratio (simplified)
    const returns = trades.map((t) => t.pnlPercent)
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / trades.length
    const stdDev = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / trades.length)
    const sharpeRatio = stdDev === 0 ? 0 : avgReturn / stdDev

    return {
      totalTrades: trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate: winningTrades.length / trades.length,
      averageWin: winningTrades.length > 0 ? grossProfit / winningTrades.length : 0,
      averageLoss: losingTrades.length > 0 ? grossLoss / losingTrades.length : 0,
      profitFactor: grossLoss === 0 ? 0 : grossProfit / grossLoss,
      maxDrawdown,
      netPnl: totalPnl,
      netPnlPercent: totalPnlPercent,
      sharpeRatio,
    }
  }

  // Generate equity curve
  private generateEquityCurve(trades: BacktestTrade[]): EquityPoint[] {
    const equityCurve: EquityPoint[] = [{ date: "Start", equity: 0 }]
    let runningEquity = 0

    for (const trade of trades) {
      runningEquity += trade.pnl
      equityCurve.push({
        date: trade.exitDate,
        equity: runningEquity,
      })
    }

    return equityCurve
  }
}

export default BacktestService
