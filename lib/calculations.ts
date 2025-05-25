interface DataPoint {
  time: string
  actualPremium: number
  expectedPremium: number
  rds: number
  ivScore: number
}

// Calculate the Risk Factor Score based on RDS and IV Score
export function calculateRiskFactor(data: DataPoint[]): number {
  if (data.length === 0) return 0

  // Get the latest data point
  const latestPoint = data[data.length - 1]

  // Calculate combined RDS score with weights
  const rdsCombined = 0.7 * latestPoint.rds + 0.3 * latestPoint.ivScore

  // Convert to 0-100 scale
  const riskFactor = Math.min(100, Math.max(0, rdsCombined * 100))

  return riskFactor
}
