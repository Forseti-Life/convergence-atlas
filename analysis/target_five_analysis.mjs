import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  BASE_YEAR,
  DEFAULTS,
  bigCycleAdjustments,
  calendarYear,
  calendarYearOrNull,
  institutionCountThresholdYear,
  replicateOutcomes,
  simulateConsolidation,
} from "../web/model.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT = path.join(ROOT, "analysis", "output");
const TARGET = 5;
const HORIZON = 5000;
const START = 225;

export const TARGET_FIVE_PRESETS = Object.freeze({
  fastest: {
    ...DEFAULTS,
    startAgents: START,
    conflictInterval: 1,
    qualifyingShare: 1,
    institutionEventProbability: 0.9,
    fragmentationPerEvent: 0,
    internalConflict: 0,
    leadingInstitutionStrength: 1,
    systemicCycleStress: 1,
    economicCoupling: 1,
    consolidationAcceleration: 1,
    horizon: HORIZON,
  },
  longestBounded: {
    ...DEFAULTS,
    startAgents: START,
    conflictInterval: 100,
    qualifyingShare: 0.12,
    institutionEventProbability: 0.48,
    fragmentationPerEvent: 0,
    internalConflict: 0,
    leadingInstitutionStrength: 0.5,
    systemicCycleStress: 0.5,
    economicCoupling: 0.5,
    consolidationAcceleration: 0,
    horizon: HORIZON,
  },
});

const OAT_LEVELS = Object.freeze({
  conflictInterval: [1, 10, 25, 50, 100],
  qualifyingShare: [0.01, 0.05, 0.15, 0.3, 0.5, 1],
  institutionEventProbability: [0.01, 5 / 162, 5 / 45, 0.15, 9 / 41, 18 / 66, 0.5, 0.7, 0.9],
  fragmentationPerEvent: [0, 1, 2, 5, 10],
  internalConflict: [0, 0.01, 0.05, 0.1, 0.2, 0.5],
  leadingInstitutionStrength: [0, 0.25, 0.5, 0.75, 1],
  systemicCycleStress: [0, 0.25, 0.5, 0.75, 1],
  economicCoupling: [0, 0.25, 0.5, 0.75, 1],
  consolidationAcceleration: [0, 0.1, 0.25, 0.5, 0.75, 1],
});

function evaluate(name, parameters, replicates = 200) {
  const normalized = { ...DEFAULTS, ...parameters, startAgents: START, horizon: HORIZON };
  const simulation = simulateConsolidation(normalized);
  const adjusted = bigCycleAdjustments(normalized);
  const stats = replicateOutcomes(normalized, replicates);
  const targetYear = stats.targetFive.unconditionalMedian;
  return {
    name,
    targetCount: TARGET,
    targetYear,
    targetCalendarYear: calendarYearOrNull(targetYear),
    reached: targetYear !== null,
    replicates,
    targetFiveProbability: stats.targetFive.reachProbability,
    targetFiveNearProbability: stats.targetFive.nearProbability,
    targetFiveP05CalendarYear: stats.targetFive.p05CalendarYear,
    targetFiveP95CalendarYear: stats.targetFive.p95CalendarYear,
    apexProbability: stats.apex.reachProbability,
    apexNearProbability: stats.apex.nearProbability,
    apexMedianCalendarYear: stats.apex.unconditionalMedianCalendarYear,
    targetFiveProbabilityCalendarYears: stats.targetFive.probabilityCalendarYears,
    apexProbabilityCalendarYears: stats.apex.probabilityCalendarYears,
    events: simulation.events,
    maximumAccelerationMultiplier: simulation.maximumAccelerationMultiplier,
    institutionsAtHorizon: stats.medianFinalCenters,
    outcome: simulation.outcome,
    waveIntervalYears: Number.isFinite(simulation.eventInterval) ? simulation.eventInterval : null,
    effectiveInstitutionEventProbability: adjusted.effectiveInstitutionEventProbability,
    effectiveQualifyingShare: adjusted.effectiveQualifyingShare,
    effectiveInternalConflict: adjusted.effectiveInternalConflict,
    parameters: normalized,
  };
}

function anchors() {
  return [
    evaluate("COW central", {}, 1000),
    evaluate("COW central without acceleration", { consolidationAcceleration: 0 }, 1000),
    evaluate("Durable COW mean loss", { institutionEventProbability: 0.11 }, 1000),
    evaluate("Historical-only frequency; no current wave", { currentWaveInProgress: 0, qualifyingShare: 0.36 }, 1000),
    evaluate("COW central without internal conflict", { internalConflict: 0 }, 1000),
    evaluate("Post-Cold-War", { institutionEventProbability: 5 / 162 }, 1000),
    evaluate("Italian consolidation", { institutionEventProbability: 5 / 45 }, 1000),
    evaluate("German consolidation", { institutionEventProbability: 9 / 41 }, 1000),
    evaluate("Wartime gross exit", { institutionEventProbability: 18 / 66 }, 1000),
    evaluate("Aircraft midpoint · secondary", { institutionEventProbability: ((1 / 3) + (5 / 7)) / 2 }, 1000),
  ];
}

function oneAtATime() {
  return Object.entries(OAT_LEVELS).flatMap(([parameter, values]) => values.map((value) => ({
    parameter,
    value,
    ...evaluate(`${parameter}=${value}`, { [parameter]: value }, 100),
  })));
}

function summarizeOat(rows) {
  return Object.keys(OAT_LEVELS).map((parameter) => {
    const group = rows.filter((row) => row.parameter === parameter);
    const reached = group.filter((row) => row.reached);
    return {
      parameter,
      testedValues: group.length,
      reachedValues: reached.length,
      fastestYear: reached.length ? Math.min(...reached.map((row) => row.targetYear)) : null,
      fastestCalendarYear: reached.length ? calendarYear(Math.min(...reached.map((row) => row.targetYear))) : null,
      slowestReachedYear: reached.length ? Math.max(...reached.map((row) => row.targetYear)) : null,
      slowestReachedCalendarYear: reached.length ? calendarYear(Math.max(...reached.map((row) => row.targetYear))) : null,
    };
  });
}

function interactionGrids() {
  const frequency = [];
  for (const conflictInterval of [1, 10, 25, 50, 100]) {
    for (const qualifyingShare of [0.05, 0.15, 0.3, 0.5, 1]) {
      frequency.push({ conflictInterval, qualifyingShare, ...evaluate("frequency", { conflictInterval, qualifyingShare }, 100) });
    }
  }
  const severityConflict = [];
  for (const institutionEventProbability of [0.05, 5 / 45, 0.15, 9 / 41, 18 / 66, 0.5, 0.7, 0.9]) {
    for (const internalConflict of [0, 0.01, 0.05, 0.1, 0.2, 0.5]) {
      severityConflict.push({ institutionEventProbability, internalConflict, ...evaluate("severity-conflict", { institutionEventProbability, internalConflict }, 100) });
    }
  }
  return { frequency, severityConflict };
}

function csvValue(value) {
  if (value === null) return "";
  return String(value);
}

function report(result) {
  const frequencyReached = result.interactions.frequency.filter((item) => item.reached).length;
  const severityReached = result.interactions.severityConflict.filter((item) => item.reached);
  const severityYears = severityReached.map((item) => item.targetYear);
  const lines = [
    "# Target-Five Exploration",
    "",
    "**Objective:** First calendar year with at most five independent top-level Institutions",
    "**Status:** Seeded stochastic scenario behavior; within-model frequencies, not a forecast",
    "",
    "## Boundaries with 225 starting Institutions",
    "",
    `- Fast high-intensity preset median: calendar year ${result.boundaries.fastest.targetCalendarYear}.`,
    `- Longest attainment bounded by the ${calendarYear(HORIZON)} censoring horizon: calendar year ${result.boundaries.longestBounded.targetCalendarYear}.`,
    "- There is no finite unconstrained longest case: qualifying waves can be arbitrarily rare or the target can remain unreachable.",
    "",
    "## Historical anchors",
    "",
    `| Scenario | Median target year | Run share at five by ${calendarYear(HORIZON)} | Run share at Apex by ${calendarYear(HORIZON)} | 25% of runs at Apex by | 50% of runs at Apex by | 75% of runs at Apex by | 95% of runs at Apex by |`,
    "|---|---:|---:|---:|---:|---:|---:|---:|",
  ];
  for (const item of result.anchors) lines.push(`| ${item.name} | ${item.targetCalendarYear ?? `No median reach by ${calendarYear(HORIZON)}`} | ${(item.targetFiveProbability * 100).toFixed(1)}% | ${(item.apexProbability * 100).toFixed(1)}% | ${["p25", "p50", "p75", "p95"].map((key) => item.apexProbabilityCalendarYears[key] ?? `After ${calendarYear(HORIZON)}`).join(" | ")} |`);
  lines.push(
    "",
    "## Preset scope",
    "",
    `The high-intensity preset uses the maximum effective mean loss probability (95%). Under beta-binomial wave severity and stochastic arrivals, it is a stress-test preset—not a mathematical lower bound. Its median target year is ${result.boundaries.fastest.targetCalendarYear}.`,
    "",
    `The slow preset draws qualifying-wave arrivals around an 833.33-year mean. Its median target year is ${result.boundaries.longestBounded.targetCalendarYear ?? "beyond the horizon"} and it reaches five by ${calendarYear(HORIZON)} in ${(result.boundaries.longestBounded.targetFiveProbability * 100).toFixed(1)}% of replicates.`,
    "",
    "## Interaction grids",
    "",
    `- Frequency-only changes reach five in ${frequencyReached}/${result.interactions.frequency.length} cases at the default 15% event probability and 5% internal conflict.`,
    `- Severity × internal-conflict changes reach five in ${severityReached.length}/${result.interactions.severityConflict.length} cases, spanning calendar years ${calendarYear(Math.min(...severityYears))}–${calendarYear(Math.max(...severityYears))}.`,
    "- Frequency changes timing only when the per-wave transition produces continued structural decline; it cannot guarantee decline when fragmentation offsets losses.",
    "",
    "Institutional-standard adoption remains outside this structural target. AI architecture diffusion affects T₅ only through the explicit consolidation-acceleration feedback when κ_A is above zero.",
    "",
  );
  return lines.join("\n");
}

function main() {
  const oat = oneAtATime();
  const result = {
    metadata: { generated: "2026-10-09", baseYear: BASE_YEAR, stochastic: true, anchorReplicates: 1000, sweepReplicates: 100, targetCount: TARGET, startAgentsLocked: START, horizon: HORIZON, horizonCalendarYear: calendarYear(HORIZON), forecast: false },
    boundaries: {
      fastest: evaluate("Fast high-intensity preset", TARGET_FIVE_PRESETS.fastest, 1000),
      longestBounded: evaluate("Slow bounded preset", TARGET_FIVE_PRESETS.longestBounded, 1000),
      scope: { maximumEffectiveMeanLossProbability: 0.95, currentWaveResolutionYears: 3, stochasticLaterArrivals: true, unconstrainedLongestExists: false },
    },
    anchors: anchors(),
    oneAtATime: oat,
    oneAtATimeSummary: summarizeOat(oat),
    interactions: interactionGrids(),
    excludedFromStructuralTarget: ["institutionalAdoptionRate", "selectedYear"],
    limitations: ["The sweep diagnoses an authored stochastic process.", "The fast and slow cases are presets, not mathematical bounds.", "Frequencies are conditional on declared assumptions and are not empirical probabilities."],
  };
  fs.mkdirSync(OUTPUT, { recursive: true });
  fs.writeFileSync(path.join(OUTPUT, "target-five-analysis.json"), `${JSON.stringify(result, null, 2)}\n`);
  const columns = ["parameter", "value", "targetYear", "targetCalendarYear", "targetFiveProbability", "apexProbability", "reached", "institutionsAtHorizon", "waveIntervalYears", "effectiveInstitutionEventProbability", "effectiveQualifyingShare", "effectiveInternalConflict"];
  const csv = [columns.join(","), ...oat.map((row) => columns.map((column) => csvValue(row[column])).join(","))].join("\n");
  fs.writeFileSync(path.join(OUTPUT, "target-five-analysis.csv"), `${csv}\n`);
  fs.writeFileSync(path.join(OUTPUT, "TARGET_FIVE_ANALYSIS.md"), report(result));
  fs.writeFileSync(path.join(ROOT, "web/target-five-analysis.mjs"), `// Generated by analysis/target_five_analysis.mjs; do not edit manually.\nexport const TARGET_FIVE_ANALYSIS = Object.freeze(${JSON.stringify(result)});\nexport const TARGET_FIVE_PRESETS = Object.freeze(${JSON.stringify(TARGET_FIVE_PRESETS)});\n`);
  console.log(JSON.stringify({ boundaries: result.boundaries, anchors: result.anchors.map(({ name, targetYear, institutionsAtHorizon }) => ({ name, targetYear, institutionsAtHorizon })), oneAtATimeSummary: result.oneAtATimeSummary }, null, 2));
}

main();
