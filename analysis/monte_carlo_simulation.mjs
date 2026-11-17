import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  BASE_YEAR,
  agentsAtYear,
  apexDominanceYear,
  calendarYear,
  calendarYearOrNull,
  institutionCountThresholdYear,
  simulateConsolidation,
} from "../web/model.mjs";
import { latinHypercube, resolveProfiles } from "./monte_carlo_sampling.mjs";
import {
  convergence,
  mean,
  sensitivity,
  summarizeCensoredTime,
  summarizeNumbers,
  terminalBands,
} from "./monte_carlo_statistics.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REGISTRY_PATH = path.join(ROOT, "research", "monte-carlo-assumptions.v1.json");
const ROBUSTNESS_PATH = path.join(ROOT, "analysis", "output", "cow-wave-robustness.json");
const OUTPUT = path.join(ROOT, "analysis", "output");
const WEB = path.join(ROOT, "web");
const VARIABLES = [
  "conflictInterval",
  "qualifyingShare",
  "institutionEventProbability",
  "fragmentationPerEvent",
  "internalConflict",
  "institutionalAdoptionRate",
  "leadingInstitutionStrength",
  "systemicCycleStress",
  "economicCoupling",
  "spreadRate",
  "consolidationAcceleration",
];
const COUNT_YEARS = [500, 1000, 2000, 5000];

function sha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function runProfile(profile, registry, profileIndex, definitionMeans) {
  const seed = registry.seed + profileIndex * 100003;
  const samples = latinHypercube(profile.distributions, registry.runsPerProfile, seed, definitionMeans);
  const rows = samples.map((sample, index) => {
    const parameters = { ...registry.fixed, ...sample };
    const simulationSeed = seed + index + 1;
    const simulation = simulateConsolidation(parameters, { seed: simulationSeed });
    const targetFiveYear = institutionCountThresholdYear(simulation, 5);
    const structuralYear = simulation.unifiedYear;
    const dominanceYear = apexDominanceYear(simulation, parameters.institutionalAdoptionRate);
    return {
      profileId: profile.id,
      run: index + 1,
      seed: simulationSeed,
      ...sample,
      targetFiveYear,
      targetFiveCalendarYear: calendarYearOrNull(targetFiveYear),
      targetFiveObserved: targetFiveYear !== null,
      structuralYear,
      structuralCalendarYear: calendarYearOrNull(structuralYear),
      structuralObserved: structuralYear !== null,
      dominanceYear,
      dominanceCalendarYear: calendarYearOrNull(dominanceYear),
      dominanceObserved: dominanceYear !== null,
      institutions500: simulation.outcome === "event-limit" && simulation.points.at(-1).year < 500 ? null : agentsAtYear(simulation, 500),
      institutions1000: simulation.outcome === "event-limit" && simulation.points.at(-1).year < 1000 ? null : agentsAtYear(simulation, 1000),
      institutions2000: simulation.outcome === "event-limit" && simulation.points.at(-1).year < 2000 ? null : agentsAtYear(simulation, 2000),
      institutions5000: simulation.outcome === "event-limit" && simulation.points.at(-1).year < 5000 ? null : agentsAtYear(simulation, 5000),
      events: simulation.events,
      maximumAccelerationMultiplier: simulation.maximumAccelerationMultiplier,
      outcome: simulation.outcome,
      computationallyCensored: simulation.outcome === "event-limit",
      lastSimulatedYear: simulation.points.at(-1).year,
    };
  });
  const horizon = registry.fixed.horizon;
  const addCalendar = (summary) => ({
    ...summary,
    censoringCalendarYear: calendarYear(horizon),
    restrictedMeanCalendarYear: calendarYear(summary.restrictedMean),
    conditionalCalendar: summary.conditional ? Object.fromEntries(
      Object.entries(summary.conditional).map(([key, value]) => [key, calendarYear(value)]),
    ) : null,
  });
  const eventValues = (key) => rows.map((row) => row.computationallyCensored && row[key] === null ? undefined : row[key]);
  const targetFive = addCalendar(summarizeCensoredTime(eventValues("targetFiveYear"), horizon));
  const structural = addCalendar(summarizeCensoredTime(eventValues("structuralYear"), horizon));
  const dominance = addCalendar(summarizeCensoredTime(eventValues("dominanceYear"), horizon));
  const counts = Object.fromEntries(COUNT_YEARS.map((year) => [
    year,
    summarizeNumbers(rows.map((row) => row[`institutions${year}`])),
  ]));
  const outcomes = Object.fromEntries(["unified", "horizon", "no-events", "event-limit"].map((outcome) => {
    const count = rows.filter((row) => row.outcome === outcome).length;
    return [outcome, { count, probability: count / rows.length }];
  }));
  const outcomeTotal = Object.values(outcomes).reduce((sum, item) => sum + item.count, 0);
  if (outcomeTotal !== rows.length) throw new Error(`Outcome accounting mismatch: ${outcomeTotal}/${rows.length}`);
  const inputs = Object.fromEntries(VARIABLES.map((variable) => [
    variable,
    summarizeNumbers(rows.map((row) => row[variable])),
  ]));
  return {
    rows,
    summary: {
      id: profile.id,
      name: profile.name,
      kind: profile.kind,
      description: profile.description,
      seed,
      runs: rows.length,
      distributions: profile.distributions,
      inputSummary: inputs,
      targetFive,
      structural,
      dominance,
      institutionCounts: counts,
      terminalBands: terminalBands(rows.map((row) => row.institutions5000)),
      outcomes,
      sensitivity: sensitivity(rows.filter((row) => !row.computationallyCensored || row.targetFiveYear !== null), VARIABLES, horizon),
      convergence: convergence(rows, [1000, 5000, 10000], horizon),
    },
  };
}

function csvValue(value) {
  if (value === null) return "";
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function writeRunsCsv(profileResults) {
  const columns = [
    "profileId", "run", "seed", ...VARIABLES,
    "targetFiveYear", "targetFiveCalendarYear", "targetFiveObserved", "structuralYear", "structuralCalendarYear", "structuralObserved",
    "dominanceYear", "dominanceCalendarYear", "dominanceObserved", "institutions500", "institutions1000",
    "institutions2000", "institutions5000", "events", "maximumAccelerationMultiplier", "outcome", "computationallyCensored", "lastSimulatedYear",
  ];
  const lines = [columns.join(",")];
  for (const profile of profileResults) {
    for (const row of profile.rows) lines.push(columns.map((column) => csvValue(row[column])).join(","));
  }
  fs.writeFileSync(path.join(OUTPUT, "monte-carlo-runs.csv"), `${lines.join("\n")}\n`);
}

function eventYear(value, horizon = 5000) {
  return value === null ? `No reach by ${calendarYear(horizon)}` : String(calendarYear(value));
}

function percent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function markdown(result) {
  const lines = [
    "# Monte Carlo Parameter-Uncertainty Analysis",
    "",
    `**Sampling:** ${result.metadata.runsPerProfile.toLocaleString()} independent Latin-hypercube samples per profile  `,
    `**Total runs:** ${result.metadata.totalRuns.toLocaleString()}  `,
    `**Seed:** ${result.metadata.seed}  `,
    "**Status:** L1 model-behavior uncertainty propagation; not a forecast or posterior",
    "",
    "## Profile outcomes",
    "",
    `| Profile | Run share at T5 by ${calendarYear(5000)} | Conditional median T5 year | Restricted-mean event year | Structural-Apex run share | Effective-Apex run share | Median Institutions in ${calendarYear(5000)} |`,
    "|---|---:|---:|---:|---:|---:|---:|",
  ];
  for (const profile of result.profiles) {
    lines.push(`| ${profile.name} | ${percent(profile.targetFive.reachProbability)} | ${eventYear(profile.targetFive.conditional?.median ?? null)} | ${calendarYear(profile.targetFive.restrictedMean)} | ${percent(profile.structural.reachProbability)} | ${percent(profile.dominance.reachProbability)} | ${profile.institutionCounts[5000].median.toFixed(1)} |`);
  }
  for (const profile of result.profiles) {
    lines.push(
      "",
      `## ${profile.name}`,
      "",
      profile.description,
      "",
      `- Seeded runs reaching five: ${profile.targetFive.reached.toLocaleString()} / ${profile.runs.toLocaleString()}`,
      `- Run share with no reach by ${calendarYear(5000)}: ${percent(profile.targetFive.noReachProbability)}`,
      `- Conditional T5 median calendar year: ${eventYear(profile.targetFive.conditional?.median ?? null)}`,
      `- T5 5th–95th percentile calendar years among reached: ${eventYear(profile.targetFive.conditional?.p05 ?? null)}–${eventYear(profile.targetFive.conditional?.p95 ?? null)}`,
      `- Restricted-mean T5 calendar year: ${calendarYear(profile.targetFive.restrictedMean)}`,
      `- Top capped-time sensitivity: ${profile.sensitivity[0].variable} (${profile.sensitivity[0].spearmanCappedTargetFive.toFixed(3)})`,
      "",
      "### Convergence checkpoints",
      "",
      "| Runs | T5 reach | Conditional median year | Restricted-mean year |",
      "|---:|---:|---:|---:|",
    );
    for (const checkpoint of profile.convergence) lines.push(`| ${checkpoint.runs.toLocaleString()} | ${percent(checkpoint.targetFiveReachProbability)} | ${eventYear(checkpoint.targetFiveConditionalMedian)} | ${calendarYear(checkpoint.targetFiveRestrictedMean)} |`);
  }
  lines.push(
    "",
    "## Interpretation limits",
    "",
    "- Bell-shaped inputs do not imply bell-shaped outputs; stalls and thresholds create censored and multimodal outcomes.",
    `- Conditional timing summaries exclude non-reaching runs. Restricted means retain them at the calendar-year ${calendarYear(5000)} censoring boundary.`,
    "- Independent parameter sampling omits plausible correlations.",
    "- The COW-definition ensemble is a sensitivity ensemble, not a posterior distribution.",
    "- Later wave arrivals bootstrap normalized 6/36/124-year clustered gaps and wave losses are beta-binomial; output frequencies remain conditional on authored assumptions.",
    "- Event-limit runs are reported as computationally censored and excluded where their post-limit state is unknown.",
    "",
  );
  return lines.join("\n");
}

function summaryCsv(result) {
  const columns = ["profileId", "runs", "targetFiveReachProbability", "baseYear", "censoringCalendarYear", "targetFiveConditionalMean", "targetFiveConditionalMeanCalendarYear", "targetFiveConditionalMedian", "targetFiveConditionalMedianCalendarYear", "targetFiveP05", "targetFiveP05CalendarYear", "targetFiveP95", "targetFiveP95CalendarYear", "targetFiveRestrictedMean", "targetFiveRestrictedMeanCalendarYear", "structuralReachProbability", "dominanceReachProbability", "meanInstitutions5000", "medianInstitutions5000", "topSensitivity"];
  const lines = [columns.join(",")];
  for (const profile of result.profiles) {
    const row = {
      profileId: profile.id,
      runs: profile.runs,
      targetFiveReachProbability: profile.targetFive.reachProbability,
      baseYear: BASE_YEAR,
      censoringCalendarYear: profile.targetFive.censoringCalendarYear,
      targetFiveConditionalMean: profile.targetFive.conditional?.mean ?? null,
      targetFiveConditionalMeanCalendarYear: profile.targetFive.conditionalCalendar?.mean ?? null,
      targetFiveConditionalMedian: profile.targetFive.conditional?.median ?? null,
      targetFiveConditionalMedianCalendarYear: profile.targetFive.conditionalCalendar?.median ?? null,
      targetFiveP05: profile.targetFive.conditional?.p05 ?? null,
      targetFiveP05CalendarYear: profile.targetFive.conditionalCalendar?.p05 ?? null,
      targetFiveP95: profile.targetFive.conditional?.p95 ?? null,
      targetFiveP95CalendarYear: profile.targetFive.conditionalCalendar?.p95 ?? null,
      targetFiveRestrictedMean: profile.targetFive.restrictedMean,
      targetFiveRestrictedMeanCalendarYear: profile.targetFive.restrictedMeanCalendarYear,
      structuralReachProbability: profile.structural.reachProbability,
      dominanceReachProbability: profile.dominance.reachProbability,
      meanInstitutions5000: profile.institutionCounts[5000].mean,
      medianInstitutions5000: profile.institutionCounts[5000].median,
      topSensitivity: profile.sensitivity[0].variable,
    };
    lines.push(columns.map((column) => csvValue(row[column])).join(","));
  }
  return `${lines.join("\n")}\n`;
}

function main() {
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH));
  const robustness = JSON.parse(fs.readFileSync(ROBUSTNESS_PATH));
  const definitionMeans = robustness.specifications
    .filter((item) => item.mode === "durable" && item.meanLossProbability !== null)
    .map((item) => item.meanLossProbability);
  const profiles = resolveProfiles(registry);
  const profileResults = profiles.map((profile, index) => runProfile(profile, registry, index, definitionMeans));
  const result = {
    metadata: {
      generated: "2026-10-09",
      baseYear: BASE_YEAR,
      censoringCalendarYear: calendarYear(registry.fixed.horizon),
      profileVersion: registry.profileVersion,
      seed: registry.seed,
      samplingMethod: registry.samplingMethod,
      runsPerProfile: registry.runsPerProfile,
      profileCount: profiles.length,
      totalRuns: profiles.length * registry.runsPerProfile,
      fixed: registry.fixed,
      parameterCorrelation: "independent",
      processUncertainty: true,
      processModel: { laterWaveArrivals: "normalized clustered-gap bootstrap (6/36/124 years)", waveLosses: "beta-binomial", severityConcentration: 14, currentWaveResolutionYears: 3 },
      claimLevel: registry.claimLevel,
      forecast: false,
    },
    profiles: profileResults.map((item) => item.summary),
  };
  fs.mkdirSync(OUTPUT, { recursive: true });
  fs.writeFileSync(path.join(OUTPUT, "monte-carlo-summary.json"), `${JSON.stringify(result, null, 2)}\n`);
  fs.writeFileSync(path.join(OUTPUT, "monte-carlo-summary.csv"), summaryCsv(result));
  fs.writeFileSync(path.join(OUTPUT, "MONTE_CARLO_REPORT.md"), markdown(result));
  writeRunsCsv(profileResults);
  fs.writeFileSync(path.join(WEB, "monte-carlo-results.mjs"), `// Generated by analysis/monte_carlo_simulation.mjs; do not edit manually.\nexport const MONTE_CARLO_RESULTS = Object.freeze(${JSON.stringify(result)});\n`);
  fs.writeFileSync(path.join(WEB, "monte-carlo-summary.csv"), summaryCsv(result));
  const manifest = {
    generated: result.metadata.generated,
    registrySha256: sha256(REGISTRY_PATH),
    robustnessSha256: sha256(ROBUSTNESS_PATH),
    modelSha256: sha256(path.join(ROOT, "web", "model.mjs")),
    samplingSha256: sha256(path.join(ROOT, "analysis", "monte_carlo_sampling.mjs")),
    statisticsSha256: sha256(path.join(ROOT, "analysis", "monte_carlo_statistics.mjs")),
    generatorSha256: sha256(fileURLToPath(import.meta.url)),
    summaryJsonSha256: sha256(path.join(OUTPUT, "monte-carlo-summary.json")),
    runsCsvSha256: sha256(path.join(OUTPUT, "monte-carlo-runs.csv")),
    reportSha256: sha256(path.join(OUTPUT, "MONTE_CARLO_REPORT.md")),
    webModuleSha256: sha256(path.join(WEB, "monte-carlo-results.mjs")),
  };
  fs.writeFileSync(path.join(ROOT, "research", "monte-carlo-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(JSON.stringify({ metadata: result.metadata, profiles: result.profiles.map((profile) => ({ id: profile.id, targetFive: profile.targetFive, structuralReach: profile.structural.reachProbability, dominanceReach: profile.dominance.reachProbability, institutions5000: profile.institutionCounts[5000], topSensitivity: profile.sensitivity.slice(0, 3) })) }, null, 2));
}

main();
