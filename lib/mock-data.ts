// Generate mock data for the dashboard
export function generateMockData() {
  // Time intervals from 9:15 to 9:25 AM
  const timeIntervals = ["9:15", "9:16", "9:17", "9:18", "9:19", "9:20", "9:21", "9:22", "9:23", "9:24", "9:25"]

  // Decay curve based on empirical theta decay over 10 mins
  const decayCurve = [1.0, 0.98, 0.965, 0.95, 0.94, 0.925, 0.91, 0.9, 0.89, 0.88, 0.87]

  // Initial premium (random between 150 and 250)
  const initialPremium = Math.random() * 100 + 150

  // Decide if this is a reverse decay scenario (20% chance)
  const isReverseDecay = Math.random() < 0.2

  // Generate data points
  return timeIntervals.map((time, index) => {
    // Expected premium based on decay curve
    const expectedPremium = initialPremium * decayCurve[index]

    // Actual premium with some randomness
    let actualPremium
    if (isReverseDecay) {
      // For reverse decay, premium increases over time
      const reverseFactor = 1 + index * 0.015 // Gradually increasing
      actualPremium = initialPremium * reverseFactor
    } else {
      // Normal decay with some random noise
      const noiseFactor = 0.98 + Math.random() * 0.04 // +/- 2% noise
      actualPremium = expectedPremium * noiseFactor
    }

    // Calculate Reverse Decay Score (RDS)
    const rds = (actualPremium - expectedPremium) / expectedPremium

    // IV Spike score (correlated with reverse decay)
    let ivScore
    if (isReverseDecay) {
      ivScore = 0.05 + index * 0.01 + Math.random() * 0.02 // Gradually increasing IV
    } else {
      ivScore = -0.02 + Math.random() * 0.04 // Random IV fluctuation around 0
    }

    return {
      time,
      actualPremium,
      expectedPremium,
      rds,
      ivScore,
    }
  })
}
