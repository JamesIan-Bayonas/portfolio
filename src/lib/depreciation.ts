export type DepreciationMethod = "straight-line" | "double-declining"

export interface AssetScenario {
  cost: number
  salvage: number
  lifespanMonths: number
  elapsedDays: number
  repairStartDay: number
  repairDays: number
}

export const DAYS_PER_MONTH = 30.4375
export const defaultScenario: AssetScenario = {
  cost: 60000,
  salvage: 5000,
  lifespanMonths: 60,
  elapsedDays: 730,
  repairStartDay: 365,
  repairDays: 90,
}

export function validateScenario(scenario: AssetScenario): string[] {
  const errors: string[] = []
  if (!Object.values(scenario).every(Number.isFinite))
    return ["Enter a number in every field."]
  if (scenario.cost < 1 || scenario.cost > 10000000)
    errors.push("Asset cost must be between ₱1 and ₱10,000,000.")
  if (scenario.salvage < 0 || scenario.salvage > scenario.cost)
    errors.push("Salvage value must be between zero and asset cost.")
  if (
    !Number.isInteger(scenario.lifespanMonths) ||
    scenario.lifespanMonths < 3 ||
    scenario.lifespanMonths > 120
  )
    errors.push("Useful life must be a whole number from 3 to 120 months.")
  if (
    !Number.isInteger(scenario.elapsedDays) ||
    scenario.elapsedDays < 0 ||
    scenario.elapsedDays > 3650
  )
    errors.push("Elapsed time must be a whole number from 0 to 3,650 days.")
  if (
    !Number.isInteger(scenario.repairStartDay) ||
    scenario.repairStartDay < 0 ||
    scenario.repairStartDay > 3650
  )
    errors.push("Repair start must be a whole number from 0 to 3,650 days.")
  if (
    !Number.isInteger(scenario.repairDays) ||
    scenario.repairDays < 0 ||
    scenario.repairDays > 730
  )
    errors.push("Repair duration must be a whole number from 0 to 730 days.")
  return errors
}

// The C# strategies use Math.Round(value, 2), whose default midpoint rule is to even.
function roundToCents(value: number): number {
  const cents = value * 100
  const floor = Math.floor(cents)
  const fraction = cents - floor
  const midpoint =
    Math.abs(fraction - 0.5) <=
    Number.EPSILON * Math.max(1, Math.abs(cents)) * 4
  return (midpoint ? floor + (floor % 2) : Math.round(cents)) / 100
}

export function repairDaysAt(scenario: AssetScenario, day: number): number {
  return Math.min(
    scenario.repairDays,
    Math.max(0, day - scenario.repairStartDay),
  )
}

// Browser illustration of the project strategies, using one non-overlapping repair window.
// Source: CentraLog.Infrastructure/Services/Depreciation/{StraightLine,DoubleDeclining}Strategy.cs
export function bookValueAt(
  scenario: AssetScenario,
  method: DepreciationMethod,
  day: number,
  adjustForRepairs = true,
): number {
  if (scenario.cost <= scenario.salvage || day <= 0) return scenario.cost
  const activeDays = Math.max(
    0,
    day - (adjustForRepairs ? repairDaysAt(scenario, day) : 0),
  )
  const activeMonths = activeDays / DAYS_PER_MONTH
  const value =
    method === "straight-line"
      ? scenario.cost -
        ((scenario.cost - scenario.salvage) / scenario.lifespanMonths) *
          activeMonths
      : scenario.cost * Math.pow(1 - 2 / scenario.lifespanMonths, activeMonths)
  return Math.max(scenario.salvage, roundToCents(value))
}
