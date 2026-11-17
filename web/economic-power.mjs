export const ECONOMIC_POWER_ASSUMPTIONS = Object.freeze({
  conflictShockFraction: 0.10,
  conflictRecoveryYears: 10,
  postConflictPremium: 0.03,
  minimumAnnualGrowth: -0.05,
  maximumAnnualGrowth: 0.15,
  longRunGrowth: 0.04,
  growthConvergenceYears: 25,
});

export function clampEconomicGrowth(rate, assumptions = ECONOMIC_POWER_ASSUMPTIONS) {
  const value = Number(rate);
  if (!Number.isFinite(value)) return 0;
  return Math.min(assumptions.maximumAnnualGrowth, Math.max(assumptions.minimumAnnualGrowth, value));
}

export function conflictEventMultiplier(eventAge, assumptions = ECONOMIC_POWER_ASSUMPTIONS) {
  const age = Math.max(0, Number(eventAge) || 0);
  const initial = 1 - assumptions.conflictShockFraction;
  const recovered = 1 + assumptions.postConflictPremium;
  if (age >= assumptions.conflictRecoveryYears) return recovered;
  return initial + ((recovered - initial) * age / assumptions.conflictRecoveryYears);
}

export function conflictPowerState(elapsedYear, conflictInterval, assumptions = ECONOMIC_POWER_ASSUMPTIONS, exposure = 1) {
  const elapsed = Math.max(0, Number(elapsedYear) || 0);
  const interval = Math.max(0, Number(conflictInterval) || 0);
  const weight = Math.min(1, Math.max(0, Number(exposure) || 0));
  if (interval === 0 || elapsed < interval) {
    return { eventCount: 0, latestEventAge: null, latestMultiplier: 1, phase: "pre-conflict", logMultiplier: 0 };
  }
  const eventCount = Math.floor(elapsed / interval);
  const latestEventAge = elapsed - (eventCount * interval);
  const exposed = (age) => 1 + (weight * (conflictEventMultiplier(age, assumptions) - 1));
  let logMultiplier = 0;
  for (let event = 1; event <= eventCount; event += 1) {
    logMultiplier += Math.log(exposed(elapsed - (event * interval)));
  }
  const latestMultiplier = exposed(latestEventAge);
  const phase = latestEventAge < assumptions.conflictRecoveryYears ? "shock/recovery" : "post-conflict premium";
  return { eventCount, latestEventAge, latestMultiplier, phase, logMultiplier };
}

export function cumulativeLogGrowth(rate, elapsedYear, assumptions = ECONOMIC_POWER_ASSUMPTIONS) {
  const elapsed = Math.max(0, Number(elapsedYear) || 0);
  const initial = Math.log1p(clampEconomicGrowth(rate, assumptions));
  const longRun = Math.log1p(assumptions.longRunGrowth);
  const tau = assumptions.growthConvergenceYears;
  return (longRun * elapsed) + ((initial - longRun) * tau * (1 - Math.exp(-elapsed / tau)));
}

export function economicPowerLog(record, elapsedYear, conflictInterval, assumptions = ECONOMIC_POWER_ASSUMPTIONS) {
  if (!Number.isFinite(record?.basePowerUsd) || record.basePowerUsd <= 0) return Number.NEGATIVE_INFINITY;
  const conflict = conflictPowerState(elapsedYear, conflictInterval, assumptions, record.conflictExposure ?? 1);
  return Math.log(record.basePowerUsd) + cumulativeLogGrowth(record.averageGrowthRate, elapsedYear, assumptions) + conflict.logMultiplier;
}

export function rankEconomicPower(records, elapsedYear, conflictInterval, assumptions = ECONOMIC_POWER_ASSUMPTIONS) {
  const calculated = records.map((record) => ({
    ...record,
    modeledGrowthRate: clampEconomicGrowth(record.averageGrowthRate, assumptions),
    logPower: economicPowerLog(record, elapsedYear, conflictInterval, assumptions),
  }));
  const finite = calculated.filter((record) => Number.isFinite(record.logPower));
  const maximum = finite.length ? Math.max(...finite.map((record) => record.logPower)) : 0;
  const denominator = finite.reduce((total, record) => total + Math.exp(record.logPower - maximum), 0);
  return calculated
    .map((record) => ({
      ...record,
      relativePower: Number.isFinite(record.logPower) ? Math.exp(record.logPower - maximum) : 0,
      powerShare: Number.isFinite(record.logPower) && denominator > 0
        ? Math.exp(record.logPower - maximum) / denominator
        : 0,
    }))
    .sort((left, right) => right.logPower - left.logPower || left.name.localeCompare(right.name))
    .map((record, index) => ({ ...record, rank: index + 1 }));
}

export function hierarchyEconomicShare(blocs, ranking, blocIndex = 0) {
  const target = blocs[blocIndex];
  if (!target) return 0;
  const shares = new Map(ranking.map((record) => [record.name, record.powerShare]));
  return target.members.reduce((total, name) => total + (shares.get(name) ?? 0), 0);
}
