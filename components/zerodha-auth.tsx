"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useLiveData } from "./live-data-provider"
import { ExternalLink, Key, Shield } from "lucide-react"

export default function ZerodhaAuth() {
  const [accessToken, setAccessToken] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { connect, isConnected } = useLiveData()

  const handleConnect = async () => {
    if (!accessToken.trim()) {
      setError("Please enter your access token")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await connect(accessToken)
    } catch (err: any) {
      setError(err.message || "Failed to connect. Please check your access token.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isConnected) {
    return (
      <Card className="bg-green-900/20 border-green-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-green-400">
            <Shield className="h-5 w-5" />
            <span className="font-medium">Connected to Zerodha Live Data</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Connect to Zerodha Live Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            To get live data, you need to authenticate with Zerodha KiteConnect API.
            <a
              href="https://kite.trade/docs/connect/v3/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 ml-1"
            >
              Learn more <ExternalLink className="h-3 w-3" />
            </a>
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <label htmlFor="accessToken" className="text-sm font-medium text-slate-300">
            Access Token
          </label>
          <Input
            id="accessToken"
            type="password"
            placeholder="Enter your Zerodha access token"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            className="bg-slate-900 border-slate-700"
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button onClick={handleConnect} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700">
          {isLoading ? "Connecting..." : "Connect to Live Data"}
        </Button>

        <div className="text-xs text-slate-400 space-y-1">
          <p>• Your API credentials are stored securely as environment variables</p>
          <p>• Live data includes tick-by-tick prices, volumes, and option chain data</p>
          <p>• Connection is established via WebSocket for real-time updates</p>
        </div>
      </CardContent>
    </Card>
  )
}
