import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { COUNTRIES } from "../web/countries.mjs";
import { TECH_COMPANIES } from "../web/tech-companies.mjs";
import { ECONOMIC_POWER_DATA, ECONOMIC_POWER_METADATA } from "../web/economic-power-data.mjs";
import {
  ECONOMIC_POWER_ASSUMPTIONS,
  clampEconomicGrowth,
  conflictEventMultiplier,
  conflictPowerState,
  economicPowerLog,
  rankEconomicPower,
} from "../web/economic-power.mjs";

assert.equal(ECONOMIC_POWER_DATA.length, 225);
assert.equal(ECONOMIC_POWER_DATA.filter((record) => record.type === "country").length, COUNTRIES.length);
assert.equal(ECONOMIC_POWER_DATA.filter((record) => record.type === "company").length, TECH_COMPANIES.length);
assert.equal(ECONOMIC_POWER_METADATA.measuredCountryCount, 192);
assert.deepEqual(ECONOMIC_POWER_METADATA.missingCountryNames, ["Holy See (Observer State)", "Nauru", "North Korea"]);
assert.ok(ECONOMIC_POWER_DATA.filter((record) => record.type === "company").every((record) => record.basePowerUsd > 0));
assert.match(ECONOMIC_POWER_METADATA.comparabilityWarning, /double-counts/);

assert.equal(clampEconomicGrowth(1), ECONOMIC_POWER_ASSUMPTIONS.maximumAnnualGrowth);
assert.equal(clampEconomicGrowth(-1), ECONOMIC_POWER_ASSUMPTIONS.minimumAnnualGrowth);
assert.equal(conflictEventMultiplier(0), 0.9);
assert.equal(conflictEventMultiplier(10), 1.03);
assert.ok(conflictEventMultiplier(5) > 0.9 && conflictEventMultiplier(5) < 1.03);
assert.equal(conflictPowerState(24, 25).eventCount, 0);
assert.equal(conflictPowerState(25, 25).eventCount, 1);
assert.equal(conflictPowerState(25, 25).phase, "shock/recovery");
assert.equal(conflictPowerState(35, 25).latestMultiplier, 1.03);

const baseline = rankEconomicPower(ECONOMIC_POWER_DATA, 0, 25);
assert.equal(baseline[0].name, "United States");
assert.equal(baseline.at(-1).powerShare, 0);
for (let index = 1; index < baseline.length; index += 1) {
  assert.ok(baseline[index - 1].logPower >= baseline[index].logPower);
}
const totalShare = baseline.reduce((total, record) => total + record.powerShare, 0);
assert.ok(Math.abs(totalShare - 1) < 1e-12);
assert.ok(economicPowerLog(baseline[0], 100, 25) > economicPowerLog(baseline[0], 0, 25));

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const generatedPaths = [
  path.join(ROOT, "web", "economic-power-data.mjs"),
  path.join(ROOT, "analysis", "output", "economic-power-baseline.csv"),
  path.join(ROOT, "research", "economic-power-manifest.json"),
];
const before = generatedPaths.map((file) => fs.readFileSync(file));
execFileSync(process.execPath, [path.join(ROOT, "analysis", "generate_economic_power.mjs")], { stdio: "ignore" });
const after = generatedPaths.map((file) => fs.readFileSync(file));
before.forEach((content, index) => assert.deepEqual(after[index], content, `${generatedPaths[index]} must regenerate byte-identically`));
const manifest = JSON.parse(fs.readFileSync(generatedPaths[2], "utf8"));
for (const [relativePath, expected] of Object.entries(manifest.outputs)) {
  const actual = crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, relativePath))).digest("hex");
  assert.equal(actual, expected, `${relativePath} checksum mismatch`);
}

console.log("✓ deterministic byte-identical generation and checksum manifest");
console.log("✓ 225 GDP/revenue economic-power records with explicit missing-country values");
console.log("✓ clipped growth, immediate conflict shock, recovery, and positive premium");
console.log("✓ descending rankings and normalized measured-institution shares");
console.log("Economic-power validation passed.");
