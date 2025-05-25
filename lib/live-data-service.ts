import ZerodhaClient from "./zerodha-client"

export interface LiveTickData {
  instrument_token: number
  last_price: number
  volume: number
  buy_quantity: number
  sell_quantity: number
  ohlc: {
    open: number
    high: number
    low: number
    close: number
  }
  timestamp: Date
}

export interface OptionChainData {
  strike: number
  call_ltp: number
  put_ltp: number
  call_iv: number
  put_iv: number
  call_volume: number
  put_volume: number
}

class LiveDataService {
  private zerodhaClient: ZerodhaClient
  private ticker: any
  private subscribers: Map<string, (data: LiveTickData) => void> = new Map()
  private isConnected = false

  constructor() {
    try {
      this.zerodhaClient = new ZerodhaClient()
    } catch (error) {
      console.warn("Failed to initialize Zerodha client:", error)
      this.zerodhaClient = null
    }
  }

  // Initialize the service with access token
  async initialize(accessToken: string) {
    if (!this.zerodhaClient) {
      throw new Error("Zerodha client not available")
    }

    this.zerodhaClient.setAccessToken(accessToken)
    this.setupWebSocket()
  }

  // Setup WebSocket connection
  private setupWebSocket() {
    if (!this.zerodhaClient || !this.zerodhaClient.isInitialized()) {
      console.warn("Cannot setup WebSocket: Zerodha client not initialized")
      return
    }

    this.ticker = this.zerodhaClient.setupWebSocket()

    this.ticker.on("ticks", (ticks: any[]) => {
      ticks.forEach((tick) => {
        const tickData: LiveTickData = {
          instrument_token: tick.instrument_token,
          last_price: tick.last_price,
          volume: tick.volume,
          buy_quantity: tick.buy_quantity,
          sell_quantity: tick.sell_quantity,
          ohlc: tick.ohlc,
          timestamp: new Date(),
        }

        // Notify all subscribers
        this.subscribers.forEach((callback) => {
          callback(tickData)
        })
      })
    })

    this.ticker.on("connect", () => {
      console.log("WebSocket connected")
      this.isConnected = true
    })

    this.ticker.on("disconnect", () => {
      console.log("WebSocket disconnected")
      this.isConnected = false
    })

    this.ticker.on("error", (err: any) => {
      console.error("WebSocket error:", err)
    })

    this.ticker.connect()
  }

  // Subscribe to live data updates
  subscribe(callback: (data: LiveTickData) => void): string {
    const id = Math.random().toString(36).substr(2, 9)
    this.subscribers.set(id, callback)
    return id
  }

  // Unsubscribe from live data updates
  unsubscribe(id: string) {
    this.subscribers.delete(id)
  }

  // Subscribe to specific instruments
  subscribeToInstruments(tokens: number[]) {
    if (this.ticker && this.isConnected) {
      this.ticker.subscribe(tokens)
      this.ticker.setMode(this.ticker.modeFull, tokens)
    }
  }

  // Get Nifty ATM options data
  async getNiftyATMOptions(): Promise<OptionChainData[]> {
    try {
      // Get current Nifty price
      const niftyLTP = await this.zerodhaClient.getLTP(["NSE:NIFTY 50"])
      const niftyPrice = niftyLTP["NSE:NIFTY 50"].last_price

      // Calculate ATM strike
      const atmStrike = Math.round(niftyPrice / 50) * 50

      // Get instruments for options
      const instruments = await this.zerodhaClient.getInstruments("NFO")

      // Filter for current month Nifty options around ATM
      const strikes = [atmStrike - 100, atmStrike - 50, atmStrike, atmStrike + 50, atmStrike + 100]

      const optionData: OptionChainData[] = []

      for (const strike of strikes) {
        // Find call and put options for this strike
        const callOption = instruments.find(
          (inst: any) => inst.name === "NIFTY" && inst.strike === strike && inst.instrument_type === "CE",
        )

        const putOption = instruments.find(
          (inst: any) => inst.name === "NIFTY" && inst.strike === strike && inst.instrument_type === "PE",
        )

        if (callOption && putOption) {
          // Get LTP for both options
          const optionPrices = await this.zerodhaClient.getLTP([
            `NFO:${callOption.tradingsymbol}`,
            `NFO:${putOption.tradingsymbol}`,
          ])

          optionData.push({
            strike,
            call_ltp: optionPrices[`NFO:${callOption.tradingsymbol}`]?.last_price || 0,
            put_ltp: optionPrices[`NFO:${putOption.tradingsymbol}`]?.last_price || 0,
            call_iv: 0, // IV calculation would require additional data
            put_iv: 0,
            call_volume: 0, // Volume data from tick data
            put_volume: 0,
          })
        }
      }

      return optionData
    } catch (error) {
      console.error("Error fetching Nifty ATM options:", error)
      return []
    }
  }

  // Calculate straddle premium
  calculateStraddlePremium(optionData: OptionChainData[], atmStrike: number): number {
    const atmOption = optionData.find((option) => option.strike === atmStrike)
    if (atmOption) {
      return atmOption.call_ltp + atmOption.put_ltp
    }
    return 0
  }

  // Disconnect WebSocket
  disconnect() {
    if (this.ticker) {
      this.ticker.disconnect()
    }
  }
}

export default LiveDataService
