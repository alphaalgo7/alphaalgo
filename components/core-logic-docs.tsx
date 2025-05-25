"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TrendingUp, Calculator, Target, AlertTriangle, BarChart3, Activity } from "lucide-react"

export default function CoreLogicDocs() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
          Core Logic & Algorithms
        </h1>
        <p className="text-slate-400 text-lg">
          Comprehensive documentation of all methodologies, calculations, and trading logic
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-slate-800/70 border border-slate-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
            Overview
          </TabsTrigger>
          <TabsTrigger value="reverse-decay" className="data-[state=active]:bg-blue-600">
            Reverse Decay
          </TabsTrigger>
          <TabsTrigger value="risk-calculation" className="data-[state=active]:bg-blue-600">
            Risk Calculation
          </TabsTrigger>
          <TabsTrigger value="iv-analysis" className="data-[state=active]:bg-blue-600">
            IV Analysis
          </TabsTrigger>
          <TabsTrigger value="signals" className="data-[state=active]:bg-blue-600">
            Trading Signals
          </TabsTrigger>
          <TabsTrigger value="algorithms" className="data-[state=active]:bg-blue-600">
            Algorithms
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  System Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300">
                  The Reverse Decay Detection System is a quantitative trading platform designed to identify anomalous
                  premium behavior in options markets, specifically focusing on ATM straddles during the critical
                  9:15-9:25 AM window.
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-white">Key Components:</h4>
                  <ul className="space-y-1 text-sm text-slate-300">
                    <li>• Real-time premium tracking and analysis</li>
                    <li>• Reverse Decay Score (RDS) calculation</li>
                    <li>• Implied Volatility spike detection</li>
                    <li>• Risk factor assessment</li>
                    <li>• Automated trading signal generation</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Calculator className="h-5 w-5 text-green-400" />
                  Mathematical Foundation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300">
                  Our algorithms are built on proven mathematical models from quantitative finance, adapted specifically
                  for Indian options markets.
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-white">Core Models:</h4>
                  <ul className="space-y-1 text-sm text-slate-300">
                    <li>• Black-Scholes-Merton for theoretical pricing</li>
                    <li>• GARCH models for volatility forecasting</li>
                    <li>• Statistical arbitrage detection</li>
                    <li>• Time-weighted momentum indicators</li>
                    <li>• Multi-factor risk assessment</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert className="mt-6 bg-blue-900/20 border-blue-700">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-blue-200">
              <strong>Important:</strong> All algorithms are calibrated specifically for NSE options and the unique
              characteristics of the Indian derivatives market, including settlement patterns and liquidity dynamics.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="reverse-decay" className="mt-6">
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">What is Reverse Decay?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300">
                  Reverse decay occurs when options premiums increase instead of following the expected time decay
                  pattern. This typically happens due to sudden volatility spikes, market events, or liquidity
                  imbalances.
                </p>

                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Mathematical Definition:</h4>
                  <div className="font-mono text-sm text-blue-300 space-y-1">
                    <div>RDS = (Actual_Premium - Expected_Premium) / Expected_Premium</div>
                    <div>Where Expected_Premium = BSM_Price × Time_Decay_Factor</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-green-900/20 p-3 rounded border border-green-700">
                    <Badge variant="outline" className="text-green-400 border-green-400 mb-2">
                      Normal Decay
                    </Badge>
                    <p className="text-sm text-slate-300">RDS &lt; 0.05</p>
                    <p className="text-xs text-slate-400">Premium follows expected decay</p>
                  </div>
                  <div className="bg-yellow-900/20 p-3 rounded border border-yellow-700">
                    <Badge variant="outline" className="text-yellow-400 border-yellow-400 mb-2">
                      Mild Reverse
                    </Badge>
                    <p className="text-sm text-slate-300">0.05 ≤ RDS &lt; 0.15</p>
                    <p className="text-xs text-slate-400">Slight premium increase</p>
                  </div>
                  <div className="bg-red-900/20 p-3 rounded border border-red-700">
                    <Badge variant="outline" className="text-red-400 border-red-400 mb-2">
                      Strong Reverse
                    </Badge>
                    <p className="text-sm text-slate-300">RDS ≥ 0.15</p>
                    <p className="text-xs text-slate-400">Significant premium spike</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Detection Algorithm</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h4 className="font-semibold text-white">Step-by-Step Process:</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div>
                        <h5 className="font-medium text-white">Data Collection</h5>
                        <p className="text-sm text-slate-300">
                          Collect real-time ATM straddle prices every second during 9:15-9:25 AM
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div>
                        <h5 className="font-medium text-white">Theoretical Calculation</h5>
                        <p className="text-sm text-slate-300">
                          Calculate expected premium using Black-Scholes with current IV and time decay
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div>
                        <h5 className="font-medium text-white">Deviation Analysis</h5>
                        <p className="text-sm text-slate-300">
                          Compare actual vs expected and calculate RDS with statistical significance
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        4
                      </div>
                      <div>
                        <h5 className="font-medium text-white">Signal Generation</h5>
                        <p className="text-sm text-slate-300">
                          Generate trading signals based on RDS thresholds and confirmation indicators
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk-calculation" className="mt-6">
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="h-5 w-5 text-red-400" />
                  Risk Factor Calculation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300">
                  The Risk Factor Score is a composite metric that combines multiple indicators to assess the
                  probability and magnitude of reverse decay events.
                </p>

                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-3">Formula Breakdown:</h4>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="text-blue-300">Risk_Factor = (0.7 × RDS_Score) + (0.3 × IV_Score)</div>
                    <Separator className="bg-slate-600 my-2" />
                    <div className="text-green-300">RDS_Score = normalize(RDS, 0, 1) × 100</div>
                    <div className="text-yellow-300">IV_Score = normalize(IV_Change, 0, 1) × 100</div>
                    <div className="text-purple-300">Final_Score = min(100, max(0, Risk_Factor))</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Weight Rationale:</h4>
                    <ul className="space-y-1 text-sm text-slate-300">
                      <li>
                        <strong>RDS (70%):</strong> Primary indicator of premium anomaly
                      </li>
                      <li>
                        <strong>IV (30%):</strong> Confirms volatility-driven movements
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Risk Levels:</h4>
                    <ul className="space-y-1 text-sm text-slate-300">
                      <li>
                        <Badge variant="outline" className="text-green-400 border-green-400 mr-2">
                          Low
                        </Badge>
                        0-30
                      </li>
                      <li>
                        <Badge variant="outline" className="text-yellow-400 border-yellow-400 mr-2">
                          Medium
                        </Badge>
                        31-60
                      </li>
                      <li>
                        <Badge variant="outline" className="text-red-400 border-red-400 mr-2">
                          High
                        </Badge>
                        61-100
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Risk Assessment Components</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-900/20 p-3 rounded border border-blue-700">
                    <h5 className="font-semibold text-blue-300 mb-2">Premium Deviation</h5>
                    <p className="text-xs text-slate-400">
                      Measures how far actual premium deviates from theoretical value
                    </p>
                  </div>
                  <div className="bg-green-900/20 p-3 rounded border border-green-700">
                    <h5 className="font-semibold text-green-300 mb-2">Volatility Spike</h5>
                    <p className="text-xs text-slate-400">Detects sudden increases in implied volatility</p>
                  </div>
                  <div className="bg-yellow-900/20 p-3 rounded border border-yellow-700">
                    <h5 className="font-semibold text-yellow-300 mb-2">Time Sensitivity</h5>
                    <p className="text-xs text-slate-400">Accounts for time remaining until expiry</p>
                  </div>
                  <div className="bg-purple-900/20 p-3 rounded border border-purple-700">
                    <h5 className="font-semibold text-purple-300 mb-2">Market Context</h5>
                    <p className="text-xs text-slate-400">Considers broader market volatility and trends</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="iv-analysis" className="mt-6">
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Activity className="h-5 w-5 text-purple-400" />
                  Implied Volatility Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300">
                  IV analysis is crucial for confirming reverse decay patterns. We use multiple methodologies to detect
                  and validate volatility spikes that drive premium increases.
                </p>

                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-3">IV Spike Detection Formula:</h4>
                  <div className="font-mono text-sm space-y-1">
                    <div className="text-purple-300">IV_Change = (Current_IV - Historical_IV) / Historical_IV</div>
                    <div className="text-blue-300">IV_Score = sigmoid(IV_Change × sensitivity_factor)</div>
                    <div className="text-green-300">Spike_Confirmed = IV_Score &gt; threshold AND volume_increase</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-900/30 p-4 rounded">
                    <h5 className="font-semibold text-white mb-2">Historical IV</h5>
                    <p className="text-sm text-slate-300">20-day rolling average of implied volatility</p>
                    <div className="text-xs text-slate-400 mt-2">Used as baseline for comparison</div>
                  </div>
                  <div className="bg-slate-900/30 p-4 rounded">
                    <h5 className="font-semibold text-white mb-2">Real-time IV</h5>
                    <p className="text-sm text-slate-300">Current implied volatility from option prices</p>
                    <div className="text-xs text-slate-400 mt-2">Calculated every second during trading</div>
                  </div>
                  <div className="bg-slate-900/30 p-4 rounded">
                    <h5 className="font-semibold text-white mb-2">IV Percentile</h5>
                    <p className="text-sm text-slate-300">Current IV rank vs 252-day history</p>
                    <div className="text-xs text-slate-400 mt-2">Provides market context</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">IV Confirmation Criteria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-white mb-3">Primary Indicators:</h4>
                      <ul className="space-y-2 text-sm text-slate-300">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          IV increase &gt; 15% from baseline
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          Volume increase &gt; 50% from average
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          Bid-ask spread tightening
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          Cross-strike IV correlation
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-3">Confirmation Filters:</h4>
                      <ul className="space-y-2 text-sm text-slate-300">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          Minimum 3-second persistence
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                          No major news events
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                          Market hours validation
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                          Liquidity threshold met
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="signals" className="mt-6">
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BarChart3 className="h-5 w-5 text-green-400" />
                  Trading Signal Generation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300">
                  Our signal generation system uses a multi-factor approach to identify high-probability trading
                  opportunities based on reverse decay detection.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-900/20 p-4 rounded border border-green-700">
                    <h4 className="font-semibold text-green-300 mb-3">BUY Signals</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li>• RDS &gt; 0.15 (Strong reverse decay)</li>
                      <li>• IV spike confirmed (&gt;15% increase)</li>
                      <li>• Risk factor &gt; 60</li>
                      <li>• Volume &gt; 150% of average</li>
                      <li>• Time remaining &gt; 2 days</li>
                    </ul>
                    <div className="mt-3 p-2 bg-green-800/30 rounded text-xs text-green-200">
                      <strong>Strategy:</strong> Buy straddles when premiums spike due to volatility
                    </div>
                  </div>

                  <div className="bg-red-900/20 p-4 rounded border border-red-700">
                    <h4 className="font-semibold text-red-300 mb-3">SELL Signals</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li>• RDS returns to normal (&lt;0.05)</li>
                      <li>• IV starts declining</li>
                      <li>• Risk factor drops below 30</li>
                      <li>• Premium overvaluation detected</li>
                      <li>• Profit target reached (20%+)</li>
                    </ul>
                    <div className="mt-3 p-2 bg-red-800/30 rounded text-xs text-red-200">
                      <strong>Strategy:</strong> Exit positions when premiums normalize
                    </div>
                  </div>
                </div>

                <Alert className="bg-yellow-900/20 border-yellow-700">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-yellow-200">
                    <strong>Risk Management:</strong> All signals include automatic stop-loss at 15% and position sizing
                    based on portfolio risk tolerance.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Signal Confidence Scoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-slate-300">
                    Each signal is assigned a confidence score based on the strength of multiple indicators:
                  </p>

                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-3">Confidence Formula:</h4>
                    <div className="font-mono text-sm space-y-1">
                      <div className="text-blue-300">
                        Confidence = (RDS_Weight × RDS_Score) + (IV_Weight × IV_Score) + (Volume_Weight × Volume_Score)
                      </div>
                      <div className="text-green-300">
                        Where: RDS_Weight = 0.5, IV_Weight = 0.3, Volume_Weight = 0.2
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-900/20 p-3 rounded border border-green-700">
                      <Badge variant="outline" className="text-green-400 border-green-400 mb-2">
                        High Confidence
                      </Badge>
                      <p className="text-sm text-slate-300">Score: 80-100</p>
                      <p className="text-xs text-slate-400">Strong signals across all indicators</p>
                    </div>
                    <div className="bg-yellow-900/20 p-3 rounded border border-yellow-700">
                      <Badge variant="outline" className="text-yellow-400 border-yellow-400 mb-2">
                        Medium Confidence
                      </Badge>
                      <p className="text-sm text-slate-300">Score: 60-79</p>
                      <p className="text-xs text-slate-400">Good signals with some uncertainty</p>
                    </div>
                    <div className="bg-red-900/20 p-3 rounded border border-red-700">
                      <Badge variant="outline" className="text-red-400 border-red-400 mb-2">
                        Low Confidence
                      </Badge>
                      <p className="text-sm text-slate-300">Score: 0-59</p>
                      <p className="text-xs text-slate-400">Weak or conflicting signals</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="algorithms" className="mt-6">
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Core Algorithms & Implementation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-3">1. Black-Scholes Implementation</h4>
                    <div className="font-mono text-xs text-slate-300 space-y-1">
                      <div>function blackScholes(S, K, T, r, σ) {"{"}</div>
                      <div className="ml-2">d1 = (ln(S/K) + (r + σ²/2)T) / (σ√T)</div>
                      <div className="ml-2">d2 = d1 - σ√T</div>
                      <div className="ml-2">call = S×N(d1) - K×e^(-rT)×N(d2)</div>
                      <div className="ml-2">put = K×e^(-rT)×N(-d2) - S×N(-d1)</div>
                      <div className="ml-2">return call + put // Straddle</div>
                      <div>{"}"}</div>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-3">2. RDS Calculation</h4>
                    <div className="font-mono text-xs text-slate-300 space-y-1">
                      <div>function calculateRDS(actual, expected) {"{"}</div>
                      <div className="ml-2">deviation = actual - expected</div>
                      <div className="ml-2">rds = deviation / expected</div>
                      <div className="ml-2">return Math.max(-1, Math.min(1, rds))</div>
                      <div>{"}"}</div>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-3">3. IV Calculation (Newton-Raphson)</h4>
                    <div className="font-mono text-xs text-slate-300 space-y-1">
                      <div>function impliedVolatility(price, S, K, T, r) {"{"}</div>
                      <div className="ml-2">let σ = 0.2 // Initial guess</div>
                      <div className="ml-2">for (let i = 0; i &lt; 100; i++) {"{"}</div>
                      <div className="ml-4">theoretical = blackScholes(S,K,T,r,σ)</div>
                      <div className="ml-4">vega = calculateVega(S,K,T,r,σ)</div>
                      <div className="ml-4">σ = σ - (theoretical - price) / vega</div>
                      <div className="ml-2">{"}"}</div>
                      <div className="ml-2">return σ</div>
                      <div>{"}"}</div>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-3">4. Risk Factor Calculation</h4>
                    <div className="font-mono text-xs text-slate-300 space-y-1">
                      <div>function calculateRiskFactor(data) {"{"}</div>
                      <div className="ml-2">latest = data[data.length - 1]</div>
                      <div className="ml-2">rdsScore = normalize(latest.rds, 0, 1)</div>
                      <div className="ml-2">ivScore = normalize(latest.ivScore, 0, 1)</div>
                      <div className="ml-2">combined = 0.7 * rdsScore + 0.3 * ivScore</div>
                      <div className="ml-2">return Math.min(100, Math.max(0, combined * 100))</div>
                      <div>{"}"}</div>
                    </div>
                  </div>
                </div>

                <Separator className="bg-slate-600" />

                <div>
                  <h4 className="font-semibold text-white mb-3">Performance Optimizations</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-blue-300 mb-2">Real-time Processing:</h5>
                      <ul className="space-y-1 text-sm text-slate-300">
                        <li>• WebSocket connections for live data</li>
                        <li>• Circular buffers for time-series data</li>
                        <li>• Vectorized calculations using SIMD</li>
                        <li>• Memoization for repeated calculations</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-green-300 mb-2">Memory Management:</h5>
                      <ul className="space-y-1 text-sm text-slate-300">
                        <li>• Fixed-size data windows (600 points)</li>
                        <li>• Garbage collection optimization</li>
                        <li>• Efficient data structures (TypedArrays)</li>
                        <li>• Lazy evaluation for complex metrics</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Alert className="bg-blue-900/20 border-blue-700">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-blue-200">
                    <strong>Note:</strong> All algorithms are optimized for sub-millisecond execution to ensure
                    real-time performance during high-frequency trading scenarios.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
