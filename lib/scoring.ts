/**
 * Calculate dynamic points for a challenge based on solve count
 * Formula: points = basePoints * (1 - decayFactor * solves)
 * Points decrease as more teams solve, with a minimum threshold
 */
export function calculateDynamicScore(
  basePoints: number,
  minPoints: number,
  solveCount: number
): number {
  const decayFactor = 0.05 // 5% decay per solve
  const calculatedPoints = Math.floor(
    basePoints * (1 - decayFactor * solveCount)
  )

  // Ensure points don't go below minimum
  return Math.max(calculatedPoints, minPoints)
}

/**
 * Recalculate scores for all teams based on their solves
 */
export async function recalculateTeamScores() {
  // This will be implemented when we have the database queries
  // It will:
  // 1. Get all solves for each team
  // 2. Recalculate points for each solve based on when it was solved
  // 3. Update team total scores
}