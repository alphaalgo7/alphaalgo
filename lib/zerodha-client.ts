import { KiteConnect } from "kiteconnect"

// Zerodha KiteConnect client setup
class ZerodhaClient {
  private kc: any
  private accessToken: string | null = null

  constructor() {
    // Only initialize if API key is available
    if (typeof process !== "undefined" && process.env && process.env.ZERODHA_API_KEY) {
      this.kc = new KiteConnect({
        api_key: process.env.ZERODHA_API_KEY,
      })
    } else {
      // Don't throw an error, just log a message
      console.log("Zerodha API key not available. Some features will be limited.")
      this.kc = null
    }
  }

  // Add a method to check if client is properly initialized
  isInitialized() {
    return this.kc !== null
  }

  // Add a method to check if authenticated
  isAuthenticated() {
    return this.kc !== null && this.accessToken !== null
  }

  // Initialize with access token
  setAccessToken(token: string) {
    this.accessToken = token
    this.kc.setAccessToken(token)
  }

  // Get login URL for authentication
  getLoginURL() {
    if (!this.kc) return "#"
    return this.kc.getLoginURL()
  }

  // Generate session after login
  async generateSession(requestToken: string) {
    if (!this.kc || !process.env.ZERODHA_API_SECRET) {
      throw new Error("Zerodha client not initialized or API secret not available")
    }

    try {
      const response = await this.kc.generateSession(requestToken, process.env.ZERODHA_API_SECRET)
      this.setAccessToken(response.access_token)
      return response
    } catch (error) {
      console.error("Error generating session:", error)
      throw error
    }
  }

  // Get instruments list
  async getInstruments(exchange = "NSE") {
    try {
      return await this.kc.getInstruments([exchange])
    } catch (error) {
      console.error("Error fetching instruments:", error)
      throw error
    }
  }

  // Get LTP (Last Traded Price)
  async getLTP(instruments: string[]) {
    try {
      return await this.kc.getLTP(instruments)
    } catch (error) {
      console.error("Error fetching LTP:", error)
      throw error
    }
  }

  // Get OHLC data
  async getOHLC(instruments: string[]) {
    try {
      return await this.kc.getOHLC(instruments)
    } catch (error) {
      console.error("Error fetching OHLC:", error)
      throw error
    }
  }

  // Get historical data
  async getHistoricalData(instrument_token: string, interval: string, from_date: string, to_date: string) {
    try {
      return await this.kc.getHistoricalData(instrument_token, interval, from_date, to_date)
    } catch (error) {
      console.error("Error fetching historical data:", error)
      throw error
    }
  }

  // Setup WebSocket for live data
  setupWebSocket() {
    const KiteTicker = require("kiteconnect").KiteTicker
    const ticker = new KiteTicker({
      api_key: process.env.ZERODHA_API_KEY,
      access_token: this.accessToken,
    })

    return ticker
  }
}

export default ZerodhaClient
