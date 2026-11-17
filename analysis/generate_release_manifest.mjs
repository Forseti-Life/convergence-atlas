import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DEFAULTS, PROCESS_UNCERTAINTY_ASSUMPTIONS } from "../web/model.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT = path.join(ROOT, "research", "release-manifest.v34.json");
const executableInputs = [
  "web/model.mjs",
  "web/app.mjs",
  "web/index.html",
  "web/styles.css",
  "web/references.mjs",
  "analysis/monte_carlo_sampling.mjs",
  "analysis/monte_carlo_statistics.mjs",
  "analysis/target_five_analysis.mjs",
  "analysis/generate_scenario_matrix.mjs",
  "analysis/model_insight_sweep.mjs",
  "analysis/monte_carlo_simulation.mjs",
  "analysis/cow_model_comparison.py",
  "research/defaults-rationale.v1.json",
  "research/monte-carlo-assumptions.v1.json",
];
const artifacts = [
  "analysis/output/target-five-analysis.json",
  "analysis/output/scenario-matrix.json",
  "analysis/output/model-insights.json",
  "analysis/output/monte-carlo-summary.json",
  "analysis/output/cow-model-comparison.json",
  "analysis/output/pca-results.json",
  "web/target-five-analysis.mjs",
  "web/scenario-matrix.mjs",
  "web/monte-carlo-results.mjs",
];
const sha256 = (relativePath) => crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, relativePath))).digest("hex");
const target = JSON.parse(fs.readFileSync(path.join(ROOT, "analysis/output/target-five-analysis.json")));
const monteCarlo = JSON.parse(fs.readFileSync(path.join(ROOT, "analysis/output/monte-carlo-summary.json")));
const core = target.anchors.find((item) => item.name === "COW central");
const cowProfile = monteCarlo.profiles.find((item) => item.id === "cow_centered");
const manifest = {
  release: "Revision 34",
  generated: "2026-10-09",
  claimLevel: "L1 authored scenario behavior; not a forecast or posterior",
  defaults: DEFAULTS,
  processUncertainty: PROCESS_UNCERTAINTY_ASSUMPTIONS,
  headline: {
    replicates: core.replicates,
    apexRunShareThresholdCalendarYears: core.apexProbabilityCalendarYears,
    targetFiveMedianCalendarYear: core.targetCalendarYear,
    monteCarloRuns: cowProfile.runs,
    monteCarloApexRunShare: cowProfile.dominance.reachProbability,
    monteCarloComputationalCensoring: cowProfile.outcomes["event-limit"].count,
  },
  executableInputs: Object.fromEntries(executableInputs.map((file) => [file, sha256(file)])),
  artifacts: Object.fromEntries(artifacts.map((file) => [file, sha256(file)])),
};
fs.writeFileSync(OUTPUT, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Wrote ${path.relative(ROOT, OUTPUT)}`);
