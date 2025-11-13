import { TrustLevel } from "@/types"

export const getTrustLevel = (score: number): TrustLevel => {
  if (score >= 850) return "Excellent"
  if (score >= 700) return "Good"
  if (score >= 550) return "Fair"
  if (score >= 400) return "Poor"
  return "Very Poor"
}

export const getTrustProgress = (score: number) => (score / 1000) * 100

export const trustLevelCopy: Record<TrustLevel, string> = {
  Excellent: "Consistently reliable with exemplary Lightning payment history.",
  Good: "Strong performance with a few areas to tighten up.",
  Fair: "Adequate reliability – improve payment cadence to move up.",
  Poor: "Needs immediate focus on timely contributions.",
  "Very Poor": "High risk profile. Build consistency to regain trust.",
}

