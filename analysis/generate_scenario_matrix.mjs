import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  BASE_YEAR,
  DEFAULTS,
  apexDominanceYear,
  calendarYear,
  calendarYearOrNull,
  bigCycleAdjustments,
  replicateOutcomes,
  simulateConsolidation,
} from "../web/model.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT = path.join(ROOT, "analysis", "output");
const HORIZON = 5000;

const SCENARIOS = Object.freeze([
  { id: "cow-central", name: "Core authored scenario", category: "authored core", overrides: {}, question: "What follows from the declared core assumptions?" },
  { id: "cow-no-acceleration", name: "Core scenario without acceleration", category: "authored ablation", overrides: { consolidationAcceleration: 0 }, question: "What does the baseline do without AI feedback?" },
  { id: "post-cold-war", name: "Post-Cold-War low-loss regime", category: "sovereign anchor", overrides: { institutionEventProbability: 5 / 162 }, question: "Can weak waves overcome ongoing fragmentation?" },
  { id: "italian-consolidation", name: "Italian-consolidation regime", category: "sovereign anchor", overrides: { institutionEventProbability: 5 / 45 }, question: "What happens near the lower historical unification case?" },
  { id: "german-consolidation", name: "German-consolidation regime", category: "sovereign anchor", overrides: { institutionEventProbability: 9 / 41 }, question: "Where does eventual consolidation begin?" },
  { id: "wartime-gross-exit", name: "Wartime gross-exit regime", category: "sovereign anchor", overrides: { institutionEventProbability: 18 / 66 }, question: "What if every wave resembles the upper COW case?" },
  { id: "aircraft-secondary", name: "Aircraft corporate benchmark", category: "secondary corporate", overrides: { institutionEventProbability: ((1 / 3) + (5 / 7)) / 2 }, question: "How much faster is the high-intensity corporate regime?" },
  { id: "frequent-moderate", name: "Frequent moderate waves", category: "mechanism challenge", overrides: { conflictInterval: 10, qualifyingShare: 0.30, institutionEventProbability: 0.15 }, question: "Can frequency compensate for moderate severity?" },
  { id: "rare-decisive", name: "Rare decisive waves", category: "mechanism challenge", overrides: { conflictInterval: 50, qualifyingShare: 0.05, institutionEventProbability: 0.50 }, question: "Can very severe but rare events consolidate the field?" },
  { id: "fragmentation-counter-wave", name: "Fragmentation counter-wave", category: "mechanism challenge", overrides: { institutionEventProbability: 18 / 66, fragmentationPerEvent: 2, internalConflict: 0.15 }, question: "Can fragmentation offset strong consolidation?" },
  { id: "strong-stressed-contender", name: "Strong, stressed contender", category: "economic interaction", overrides: { institutionEventProbability: 9 / 41, qualifyingShare: 0.6, leadingInstitutionStrength: 1, systemicCycleStress: 1, economicCoupling: 1 }, question: "How strongly do power and systemic stress interact?" },
]);

function evaluate(scenario) {
  const parameters = { ...DEFAULTS, ...scenario.overrides, horizon: HORIZON };
  const adjusted = bigCycleAdjustments(parameters);
  const simulation = simulateConsolidation(parameters);
  const stats = replicateOutcomes(parameters, 1000);
  const structuralYear = stats.structural.unconditionalMedian;
  const dominanceYear = stats.apex.unconditionalMedian;
  return {
    id: scenario.id,
    name: scenario.name,
    category: scenario.category,
    question: scenario.question,
    parameters,
    effectiveInstitutionEventProbability: adjusted.effectiveInstitutionEventProbability,
    effectiveQualifyingShare: adjusted.effectiveQualifyingShare,
    effectiveInternalConflict: adjusted.effectiveInternalConflict,
    waveIntervalYears: Number.isFinite(simulation.eventInterval) ? simulation.eventInterval : null,
    outcome: simulation.outcome,
    events: simulation.events,
    maximumAccelerationMultiplier: simulation.maximumAccelerationMultiplier,
    topLevelInstitutionsAtHorizon: stats.medianFinalCenters,
    replicates: stats.replicates,
    targetFiveProbability: stats.targetFive.reachProbability,
    targetFiveMedianCalendarYear: stats.targetFive.unconditionalMedianCalendarYear,
    apexProbability: stats.apex.reachProbability,
    apexProbabilityCalendarYears: stats.apex.probabilityCalendarYears,
    apexNearProbability: stats.apex.nearProbability,
    apexP05CalendarYear: stats.apex.p05CalendarYear,
    apexP95CalendarYear: stats.apex.p95CalendarYear,
    structuralYear,
    structuralCalendarYear: calendarYearOrNull(structuralYear),
    dominanceYear,
    dominanceCalendarYear: calendarYearOrNull(dominanceYear),
  };
}

function csvValue(value) {
  if (value === null) return "";
  const text = typeof value === "object" ? JSON.stringify(value) : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function writeCsv(results) {
  const columns = ["id", "name", "category", "effectiveInstitutionEventProbability", "waveIntervalYears", "outcome", "events", "topLevelInstitutionsAtHorizon", "structuralYear", "structuralCalendarYear", "dominanceYear", "dominanceCalendarYear", "targetFiveProbability", "apexProbability", "question"];
  const lines = [columns.join(",")];
  for (const result of results) lines.push(columns.map((column) => csvValue(result[column])).join(","));
  fs.writeFileSync(path.join(OUTPUT, "scenario-matrix.csv"), `${lines.join("\n")}\n`);
}

function eventYear(value) {
  return value === null ? `No reach by ${calendarYear(HORIZON)}` : String(calendarYear(value));
}

function writeReport(results) {
  const lines = [
    `# ${results.length}-Scenario Challenge Matrix`,
    "",
    "**Status:** 1,000 seeded replicates per scenario; not forecasts or empirical probabilities. Run-share threshold columns give the calendar year by which that share of replicates reaches Apex coordination.",
    "",
    `| Scenario | Category | Mean loss assumption | Wave interval | Median Institutions in ${calendarYear(HORIZON)} | Median dominance year | Apex run share by ${calendarYear(HORIZON)} | 25% of runs by | 50% of runs by | 75% of runs by | 95% of runs by |`,
    "|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|",
  ];
  for (const result of results) lines.push(`| ${result.name} | ${result.category} | ${(result.effectiveInstitutionEventProbability * 100).toFixed(2)}% | ${result.waveIntervalYears.toFixed(1)} | ${result.topLevelInstitutionsAtHorizon} | ${eventYear(result.dominanceYear)} | ${(result.apexProbability * 100).toFixed(1)}% | ${["p25", "p50", "p75", "p95"].map((key) => result.apexProbabilityCalendarYears[key] ?? `After ${calendarYear(HORIZON)}`).join(" | ")} |`);
  lines.push(
    "",
    "## Guardrails",
    "",
    "- All losses are permanent top-level endings under the decisive unconditional-defeat rule.",
    "- The aircraft case is a secondary corporate comparison, not the sovereign default.",
    `- Dates are unconditional medians across 1,000 seeded replicates; a null year means fewer than half the replicates reach the event by ${calendarYear(HORIZON)}.`,
    "- Dates arise from seeded stochastic arrivals and beta-binomial wave losses under provisional authored assumptions.",
    "",
  );
  fs.writeFileSync(path.join(OUTPUT, "SCENARIO_MATRIX.md"), lines.join("\n"));
}

function main() {
  const result = {
    metadata: { generated: "2026-10-09", baseYear: BASE_YEAR, horizon: HORIZON, horizonCalendarYear: calendarYear(HORIZON), scenarioCount: SCENARIOS.length, forecast: false },
    scenarios: SCENARIOS.map(evaluate),
  };
  fs.mkdirSync(OUTPUT, { recursive: true });
  fs.writeFileSync(path.join(OUTPUT, "scenario-matrix.json"), `${JSON.stringify(result, null, 2)}\n`);
  writeCsv(result.scenarios);
  writeReport(result.scenarios);
  fs.writeFileSync(path.join(ROOT, "web", "scenario-matrix.mjs"), `// Generated by analysis/generate_scenario_matrix.mjs; do not edit manually.\nexport const SCENARIO_MATRIX = Object.freeze(${JSON.stringify(result)});\n`);
  console.log(`Generated ${result.scenarios.length} challenge scenarios`);
}

main();
