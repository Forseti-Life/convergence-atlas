import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { inverseNormal, latinHypercube, resolveProfiles } from "../analysis/monte_carlo_sampling.mjs";
import { quantile, spearman, summarizeCensoredTime } from "../analysis/monte_carlo_statistics.mjs";
import { institutionCountThresholdYear, simulateConsolidation } from "../web/model.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const summaryPath = path.join(ROOT, "analysis/output/monte-carlo-summary.json");
const runsPath = path.join(ROOT, "analysis/output/monte-carlo-runs.csv");
const reportPath = path.join(ROOT, "analysis/output/MONTE_CARLO_REPORT.md");
const manifestPath = path.join(ROOT, "research/monte-carlo-manifest.json");

function sha(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

assert.ok(Math.abs(inverseNormal(0.5)) < 1e-8);
assert.ok(Math.abs(inverseNormal(0.05) + 1.6448536) < 1e-5);
assert.ok(Math.abs(inverseNormal(0.95) - 1.6448536) < 1e-5);
assert.equal(quantile([1, 2, 3, 4], 0.5), 2.5);
assert.ok(spearman([1, 2, 3], [3, 2, 1]) < -0.999);
const censored = summarizeCensoredTime([100, 200, null, null], 500);
assert.equal(censored.reachProbability, 0.5);
assert.equal(censored.conditional.median, 150);
assert.equal(censored.restrictedMean, 325);
assert.equal(censored.survival.at(-1).probabilityAboveTarget, 0.5);

const registry = JSON.parse(fs.readFileSync(path.join(ROOT, "research/monte-carlo-assumptions.v1.json")));
const profiles = resolveProfiles(registry);
assert.equal(profiles.length, 4);
assert.equal(profiles.find((profile) => profile.id === "corporate_secondary").distributions.institutionEventProbability.median, 0.5238095238);
const toy = {
  probability: { type: "logisticNormal", median: 0.2, lower90: 0.1, upper90: 0.4, min: 0.01, max: 0.9 },
  count: { type: "zeroInflatedPoisson", zeroProbability: 0.8, lambda: 2, min: 0, max: 10, integer: true },
};
const firstSample = latinHypercube(toy, 100, 42);
const secondSample = latinHypercube(toy, 100, 42);
assert.deepEqual(firstSample, secondSample);
assert.ok(firstSample.every((row) => row.probability >= 0.01 && row.probability <= 0.9));
assert.ok(firstSample.every((row) => Number.isInteger(row.count) && row.count >= 0 && row.count <= 10));

execFileSync("node", [path.join(ROOT, "analysis/monte_carlo_simulation.mjs")], { cwd: ROOT, stdio: "pipe" });
const before = [sha(summaryPath), sha(runsPath), sha(reportPath), sha(manifestPath)];
execFileSync("node", [path.join(ROOT, "analysis/monte_carlo_simulation.mjs")], { cwd: ROOT, stdio: "pipe" });
assert.deepEqual(before, [sha(summaryPath), sha(runsPath), sha(reportPath), sha(manifestPath)]);

const result = JSON.parse(fs.readFileSync(summaryPath));
assert.equal(result.metadata.baseYear, 2026);
assert.equal(result.metadata.censoringCalendarYear, 7026);
assert.equal(result.metadata.runsPerProfile, 10000);
assert.equal(result.metadata.profileCount, 4);
assert.equal(result.metadata.totalRuns, 40000);
assert.equal(result.metadata.seed, 20261008);
assert.equal(result.metadata.parameterCorrelation, "independent");
assert.equal(result.metadata.processUncertainty, true);
assert.match(result.metadata.processModel.laterWaveArrivals, /clustered-gap/);
assert.equal(result.metadata.forecast, false);
const byId = new Map(result.profiles.map((profile) => [profile.id, profile]));
const cow = byId.get("cow_centered");
assert.ok(cow.targetFive.reachProbability > 0.3 && cow.targetFive.reachProbability < 0.8, "COW-centered reach is mixed, not certain");
assert.ok(cow.dominance.reachProbability <= cow.targetFive.reachProbability, "Apex cannot be more likely than five centers");
assert.ok(byId.get("corporate_secondary").targetFive.reachProbability > cow.targetFive.reachProbability, "corporate profile consolidates faster");
assert.equal(byId.get("cow_centered").targetFive.censoringCalendarYear, 7026);
assert.ok(cow.targetFive.conditionalCalendar.median > 2126, "no near-term median among reached runs");
assert.ok(cow.targetFive.restrictedMeanCalendarYear >= cow.targetFive.conditionalCalendar.median);
assert.ok(["internalConflict", "institutionEventProbability", "conflictInterval", "consolidationAcceleration", "fragmentationPerEvent"].includes(cow.sensitivity[0].variable));
assert.equal(byId.get("broad_structural").sensitivity[0].variable, "institutionEventProbability");
for (const profile of result.profiles) {
  assert.equal(profile.runs, 10000);
  assert.equal(profile.targetFive.reached + profile.targetFive.censored, profile.targetFive.total);
  assert.equal(profile.targetFive.total + profile.targetFive.excludedComputationallyCensored, 10000);
  assert.ok(Math.abs(profile.targetFive.reachProbability + profile.targetFive.noReachProbability - 1) < 1e-12);
  assert.equal(Object.values(profile.outcomes).reduce((sum, item) => sum + item.count, 0), 10000);
  assert.equal(profile.convergence.length, 3);
  assert.equal(profile.terminalBands.reduce((sum, band) => sum + band.count, 0), 10000 - profile.outcomes["event-limit"].count);
  assert.ok(Object.hasOwn(profile.dominance.probabilityYears, "p95"));
  assert.ok(!Object.hasOwn(profile.dominance.probabilityYears, "p100"));
  assert.ok(profile.targetFive.conditional.p05 <= profile.targetFive.conditional.median);
  assert.ok(profile.targetFive.conditional.median <= profile.targetFive.conditional.p95);
}
const runLines = fs.readFileSync(runsPath, "utf8").trimEnd().split("\n");
assert.equal(runLines.length, 40001);
const runColumns = runLines[0].split(",");
const firstRun = Object.fromEntries(runColumns.map((column, index) => [column, runLines[1].split(",")[index]]));
assert.equal(Number(firstRun.seed), result.metadata.seed + 1, "CSV records the actual simulation seed");
const VARIABLES_FOR_REPLAY = ["conflictInterval", "qualifyingShare", "institutionEventProbability", "fragmentationPerEvent", "internalConflict", "institutionalAdoptionRate", "leadingInstitutionStrength", "systemicCycleStress", "economicCoupling", "spreadRate", "consolidationAcceleration"];
const replayParameters = Object.fromEntries(VARIABLES_FOR_REPLAY.map((key) => [key, Number(firstRun[key])]));
const replay = simulateConsolidation({ ...result.metadata.fixed, ...replayParameters }, { seed: Number(firstRun.seed) });
assert.equal(institutionCountThresholdYear(replay, 5), Number(firstRun.targetFiveYear));
const report = fs.readFileSync(reportPath, "utf8");
assert.match(report, /not a forecast or posterior/);
assert.match(report, /Bell-shaped inputs do not imply bell-shaped outputs/);
assert.match(report, /right-censored|censored/i);
assert.match(report, /calendar year|7026/i);
const manifest = JSON.parse(fs.readFileSync(manifestPath));
assert.equal(manifest.summaryJsonSha256, sha(summaryPath));
assert.equal(manifest.runsCsvSha256, sha(runsPath));
assert.match(fs.readFileSync(path.join(ROOT, "web/monte-carlo-results.mjs"), "utf8"), /MONTE_CARLO_RESULTS/);

console.log("✓ inverse-normal, Latin-hypercube, transformed distributions, and censored summaries");
console.log("✓ four profiles × 10,000 runs with deterministic byte-identical regeneration");
console.log("✓ reach probabilities, quantiles, terminal bands, convergence, and sensitivity");
console.log("✓ run-level CSV, reports, browser module, and checksum manifest");
console.log("Monte Carlo uncertainty validation passed.");
