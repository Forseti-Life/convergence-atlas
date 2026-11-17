import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  BASE_YEAR,
  DEFAULTS,
  apexDominanceYear,
  calendarYear,
  calendarYearOrNull,
  effectiveApexInfluence,
  institutionalStandardAdoption,
  replicateOutcomes,
  simulateConsolidation,
} from "../web/model.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT = path.join(ROOT, "analysis", "output");
const ANALYSIS_HORIZON = 5000;

const OAT_LEVELS = Object.freeze({
  startAgents: [75, 225],
  conflictInterval: [10, 25, 50],
  qualifyingShare: [0.05, 0.15, 0.3],
  institutionEventProbability: [0.25, 0.5, 0.75],
  fragmentationPerEvent: [0, 2, 5],
  internalConflict: [0.01, 0.05, 0.15],
  institutionalAdoptionRate: [0.03, 0.07, 0.15],
  leadingInstitutionStrength: [0.25, 0.5, 0.75],
  systemicCycleStress: [0.25, 0.5, 0.75],
  economicCoupling: [0, 0.5, 1],
  spreadRate: [0.05, 0.15, 0.3],
  consolidationAcceleration: [0, 0.25, 0.5, 1],
});

const SCREEN_RANGES = Object.freeze({
  conflictInterval: [10, 75],
  qualifyingShare: [0.05, 0.5],
  institutionEventProbability: [0.15, 0.8],
  fragmentationPerEvent: [0, 6],
  internalConflict: [0, 0.25],
  institutionalAdoptionRate: [0.02, 0.2],
  leadingInstitutionStrength: [0, 1],
  systemicCycleStress: [0, 1],
  economicCoupling: [0, 1],
  spreadRate: [0.03, 0.45],
  consolidationAcceleration: [0, 1],
});

function evaluate(overrides = {}) {
  const parameters = { ...DEFAULTS, horizon: ANALYSIS_HORIZON, selectedYear: 0, ...overrides };
  const simulation = simulateConsolidation(parameters);
  const stats = replicateOutcomes(parameters, 25);
  const dominanceYear = stats.apex.unconditionalMedian;
  return {
    dominanceYear,
    dominanceCalendarYear: calendarYearOrNull(dominanceYear),
    structuralYear: stats.structural.unconditionalMedian,
    structuralCalendarYear: calendarYearOrNull(stats.structural.unconditionalMedian),
    reached: dominanceYear !== null,
    apexProbability: stats.apex.reachProbability,
    outcome: simulation.outcome,
    events: simulation.events,
    eventInterval: simulation.eventInterval,
    maximumAccelerationMultiplier: simulation.maximumAccelerationMultiplier,
  };
}

function oneAtATime() {
  const baseline = evaluate();
  const rows = [];
  for (const [parameter, values] of Object.entries(OAT_LEVELS)) {
    for (const value of values) {
      const result = evaluate({ [parameter]: value });
      rows.push({
        parameter,
        value,
        ...result,
        differenceFromBaseline: result.dominanceYear === null || baseline.dominanceYear === null
          ? null
          : result.dominanceYear - baseline.dominanceYear,
      });
    }
  }
  const ranges = Object.keys(OAT_LEVELS).map((parameter) => {
    const group = rows.filter((row) => row.parameter === parameter);
    const reached = group.filter((row) => row.reached).map((row) => row.dominanceYear);
    return {
      parameter,
      minimumReachedYear: reached.length ? Math.min(...reached) : null,
      minimumReachedCalendarYear: reached.length ? calendarYear(Math.min(...reached)) : null,
      maximumReachedYear: reached.length ? Math.max(...reached) : null,
      maximumReachedCalendarYear: reached.length ? calendarYear(Math.max(...reached)) : null,
      noReachCases: group.length - reached.length,
      finiteSpread: reached.length > 1 ? Math.max(...reached) - Math.min(...reached) : 0,
    };
  }).sort((left, right) => (
    right.noReachCases - left.noReachCases || right.finiteSpread - left.finiteSpread
  ));
  return { baseline, rows, ranges };
}

function xorshift(seed = 20261007) {
  let state = seed >>> 0;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x1_0000_0000;
  };
}

function scale(unit, [minimum, maximum], discrete = false) {
  const value = minimum + (unit * (maximum - minimum));
  return discrete ? Math.round(value) : value;
}

function screening(iterations = 192, delta = 0.1) {
  const random = xorshift();
  const effects = Object.fromEntries(Object.keys(SCREEN_RANGES).map((key) => [key, []]));
  const reachChanges = Object.fromEntries(Object.keys(SCREEN_RANGES).map((key) => [key, 0]));
  for (let iteration = 0; iteration < iterations; iteration += 1) {
    const baseUnits = Object.fromEntries(Object.keys(SCREEN_RANGES).map((key) => [key, random()]));
    const baseParameters = Object.fromEntries(Object.entries(baseUnits).map(([key, unit]) => [
      key,
      scale(unit, SCREEN_RANGES[key], key === "fragmentationPerEvent"),
    ]));
    const base = evaluate(baseParameters);
    const baseOutput = Math.log1p(base.dominanceYear ?? ANALYSIS_HORIZON * 2);
    for (const key of Object.keys(SCREEN_RANGES)) {
      const direction = baseUnits[key] <= 1 - delta ? 1 : -1;
      const changedUnits = { ...baseUnits, [key]: baseUnits[key] + (direction * delta) };
      const changedParameters = { ...baseParameters, [key]: scale(
        changedUnits[key],
        SCREEN_RANGES[key],
        key === "fragmentationPerEvent",
      ) };
      const changed = evaluate(changedParameters);
      const changedOutput = Math.log1p(changed.dominanceYear ?? ANALYSIS_HORIZON * 2);
      effects[key].push((changedOutput - baseOutput) / (direction * delta));
      if (changed.reached !== base.reached) reachChanges[key] += 1;
    }
  }
  return Object.keys(effects).map((parameter) => {
    const values = effects[parameter];
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    const meanAbsolute = values.reduce((sum, value) => sum + Math.abs(value), 0) / values.length;
    const variance = values.reduce((sum, value) => sum + ((value - mean) ** 2), 0) / (values.length - 1);
    return {
      parameter,
      meanEffect: mean,
      meanAbsoluteEffect: meanAbsolute,
      effectStandardDeviation: Math.sqrt(variance),
      reachChangeRate: reachChanges[parameter] / iterations,
      iterations,
    };
  }).sort((left, right) => right.meanAbsoluteEffect - left.meanAbsoluteEffect);
}

function consolidationFragmentationMap() {
  const rows = [];
  for (let consolidation = 0.1; consolidation <= 0.9001; consolidation += 0.1) {
    for (let conflict = 0; conflict <= 0.4001; conflict += 0.05) {
      const result = evaluate({
        institutionEventProbability: Number(consolidation.toFixed(2)),
        internalConflict: Number(conflict.toFixed(2)),
      });
      rows.push({
        institutionEventProbability: Number(consolidation.toFixed(2)),
        internalConflict: Number(conflict.toFixed(2)),
        reached: result.reached,
        dominanceYear: result.dominanceYear,
        dominanceCalendarYear: result.dominanceCalendarYear,
        outcome: result.outcome,
      });
    }
  }
  return rows;
}

function economicSurface() {
  const rows = [];
  for (const strength of [0, 0.25, 0.5, 0.75, 1]) {
    for (const stress of [0, 0.25, 0.5, 0.75, 1]) {
      rows.push({ strength, stress, ...evaluate({
        leadingInstitutionStrength: strength,
        systemicCycleStress: stress,
        economicCoupling: 1,
      }) });
    }
  }
  return rows;
}

function dominanceWithObservability(observability, institutionEventProbability = 18 / 66) {
  const simulation = simulateConsolidation({
    ...DEFAULTS,
    institutionEventProbability,
    horizon: ANALYSIS_HORIZON,
  });
  if (simulation.unifiedYear === null || observability <= 0.5) return null;
  const target = 0.5;
  if (effectiveApexInfluence(simulation, ANALYSIS_HORIZON) * observability <= target) return null;
  let low = simulation.unifiedYear;
  let high = ANALYSIS_HORIZON;
  for (let index = 0; index < 64; index += 1) {
    const midpoint = (low + high) / 2;
    if (effectiveApexInfluence(simulation, midpoint) * observability > target) high = midpoint;
    else low = midpoint;
  }
  return high;
}

function observabilityCounterfactual() {
  const conditioningProbability = 18 / 66;
  return {
    conditioningProbability,
    condition: "Upper observed COW major-wave case (1936–1945 gross exits)",
    rows: [1, 0.95, 0.8, 0.6, 0.5, 0.4].map((observability) => {
      const dominanceYear = dominanceWithObservability(observability, conditioningProbability);
      return {
        observability,
        dominanceYear,
        dominanceCalendarYear: calendarYearOrNull(dominanceYear),
        possible: observability > 0.5,
      };
    }),
  };
}

function waveCalibration() {
  const aircraftLower = 1 / 3;
  const aircraftUpper = 5 / 7;
  const aircraftMidpoint = (aircraftLower + aircraftUpper) / 2;
  return {
    interpretation: "Per-Institution probability of losing top-level independence during a shared consolidation wave",
    primary: "COW State System Membership v2024",
    postColdWar: { probability: 5 / 162, ...evaluate({ institutionEventProbability: 5 / 162 }) },
    italianConsolidation: { probability: 5 / 45, ...evaluate({ institutionEventProbability: 5 / 45 }) },
    roundedDefault: { probability: 0.11, ...evaluate({ institutionEventProbability: 0.11 }) },
    germanConsolidation: { probability: 9 / 41, ...evaluate({ institutionEventProbability: 9 / 41 }) },
    wartimeInterruption: { probability: 18 / 66, ...evaluate({ institutionEventProbability: 18 / 66 }) },
    aircraftSecondary: {
      lower: { probability: aircraftLower, ...evaluate({ institutionEventProbability: aircraftLower }) },
      midpoint: { probability: aircraftMidpoint, ...evaluate({ institutionEventProbability: aircraftMidpoint }) },
      upper: { probability: aircraftUpper, ...evaluate({ institutionEventProbability: aircraftUpper }) },
    },
    futurePermanenceRule: 1,
    warning: "Durable COW exit waves calibrate the sovereign default; gross waves are sensitivity cases. Aircraft/aerospace remains a secondary corporate comparison.",
  };
}

function formatEventYear(value) {
  return value === null ? `No reach by ${calendarYear(ANALYSIS_HORIZON)}` : String(calendarYear(value));
}

function report(results) {
  const lines = [
    "# Model Insight Analysis",
    "",
    "**Generated:** October 8, 2026  ",
    "**Status:** Production-model diagnostics and counterfactuals; not forecasts",
    "",
    "## Baseline",
    "",
    `- Structural consolidation: ${formatEventYear(results.oneAtATime.baseline.structuralYear)}`,
    `- Adoption-adjusted dominance: ${formatEventYear(results.oneAtATime.baseline.dominanceYear)}`,
    "",
    "## One-at-a-time sensitivity ranking",
    "",
    "| Parameter | Earliest calendar year | Latest calendar year | No-reach cases | Finite spread (years) |",
    "|---|---:|---:|---:|---:|",
  ];
  for (const item of results.oneAtATime.ranges) {
    lines.push(`| ${item.parameter} | ${formatEventYear(item.minimumReachedYear)} | ${formatEventYear(item.maximumReachedYear)} | ${item.noReachCases} | ${item.finiteSpread.toFixed(1)} |`);
  }
  lines.push("", "## Morris-style global screening", "", "| Parameter | Mean absolute effect | Effect SD | Reach-change rate |", "|---|---:|---:|---:|");
  for (const item of results.screening) {
    lines.push(`| ${item.parameter} | ${item.meanAbsoluteEffect.toFixed(3)} | ${item.effectStandardDeviation.toFixed(3)} | ${(item.reachChangeRate * 100).toFixed(1)}% |`);
  }
  const phaseReached = results.consolidationFragmentationMap.filter((row) => row.reached).length;
  lines.push(
    "",
    "## Consolidation/fragmentation phase map",
    "",
    `- Reached cells: ${phaseReached} / ${results.consolidationFragmentationMap.length}`,
    "- The boundary is discontinuous because agent counts and fragments are integers.",
    "",
    "## Observability counterfactual",
    "",
    `Conditioned on: ${results.observabilityCounterfactual.condition}.`,
    "",
    "| Verified observability | Dominance calendar year |",
    "|---:|---:|",
  );
  for (const item of results.observabilityCounterfactual.rows) lines.push(`| ${(item.observability * 100).toFixed(0)}% | ${formatEventYear(item.dominanceYear)} |`);
  const calibration = results.waveCalibration;
  lines.push(
    "",
    "## COW sovereign-wave calibration",
    "",
    `- 3.1% post-Cold-War wave: ${formatEventYear(calibration.postColdWar.dominanceYear)}`,
    `- 11.1% Italian-consolidation wave: ${formatEventYear(calibration.italianConsolidation.dominanceYear)}`,
    `- 11% durable production default: ${formatEventYear(calibration.roundedDefault.dominanceYear)}`,
    `- 22.0% German-consolidation wave: ${formatEventYear(calibration.germanConsolidation.dominanceYear)}`,
    `- 27.3% wartime gross-exit wave: ${formatEventYear(calibration.wartimeInterruption.dominanceYear)}`,
    `- 52.4% secondary aircraft midpoint: ${formatEventYear(calibration.aircraftSecondary.midpoint.dominanceYear)}`,
    "",
    `> ${calibration.warning}`,
    "",
    "## Interpretation limits",
    "",
    "- Screening uses authored parameter ranges and a censored log-time outcome.",
    "- One-at-a-time results omit interactions.",
    "- Observability is a counterfactual because production currently assumes full required observability.",
    "- Wave-loss probabilities are expected field effects; future stochastic outcomes should be correlated by shared event severity.",
    "- Aircraft manufacturing is a corporate reference regime, not direct evidence about states.",
    "",
  );
  return lines.join("\n");
}

function main() {
  const results = {
    metadata: {
      generated: "2026-10-09",
      baseYear: BASE_YEAR,
      analysisType: "production-model insight diagnostics",
      horizon: ANALYSIS_HORIZON,
      horizonCalendarYear: calendarYear(ANALYSIS_HORIZON),
      forecast: false,
    },
    oneAtATime: oneAtATime(),
    screening: screening(),
    consolidationFragmentationMap: consolidationFragmentationMap(),
    economicSurface: economicSurface(),
    observabilityCounterfactual: observabilityCounterfactual(),
    waveCalibration: waveCalibration(),
  };
  fs.mkdirSync(OUTPUT, { recursive: true });
  fs.writeFileSync(path.join(OUTPUT, "model-insights.json"), JSON.stringify(results, null, 2) + "\n");
  fs.writeFileSync(path.join(OUTPUT, "MODEL_INSIGHTS.md"), report(results));
  fs.writeFileSync(
    path.join(ROOT, "web", "model-insights.mjs"),
    `// Generated by analysis/model_insight_sweep.mjs; do not edit manually.\nexport const MODEL_INSIGHTS = Object.freeze(${JSON.stringify(results)});\n`,
  );
  console.log(JSON.stringify({
    baseline: results.oneAtATime.baseline,
    topScreening: results.screening.slice(0, 5),
    observability: results.observabilityCounterfactual,
    waveCalibration: results.waveCalibration,
  }, null, 2));
}

main();
