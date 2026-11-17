import assert from "node:assert/strict";
import fs from "node:fs";
import { DEFAULTS } from "../web/model.mjs";

const rationale = JSON.parse(fs.readFileSync(new URL("../research/defaults-rationale.v1.json", import.meta.url)));
const sourceCatalog = JSON.parse(fs.readFileSync(new URL("../research/source-catalog.v1.json", import.meta.url)));
const sourceIds = new Set(sourceCatalog.sources.map((source) => source.id));
const records = new Map(rationale.defaults.map((item) => [item.id, item]));

assert.equal(records.size, Object.keys(DEFAULTS).length, "every active default must have exactly one rationale");
for (const [key, value] of Object.entries(DEFAULTS)) {
  assert.ok(records.has(key), `missing rationale for ${key}`);
  assert.deepEqual(records.get(key).default, value, `rationale default drift for ${key}`);
}

for (const item of rationale.defaults) {
  assert.ok(item.rationale.length > 30);
  assert.ok(item.derivation.length > 20);
  assert.ok(rationale.evidenceTiers[item.tier] || item.tier.split("+").every((tier) => rationale.evidenceTiers[tier]));
  item.sourceIds.forEach((source) => assert.ok(sourceIds.has(source), `${item.id} references unknown source ${source}`));
  item.additionalSources.forEach((url) => assert.match(url, /^https:\/\//));
  if (["C", "D"].some((tier) => item.tier.includes(tier))) assert.equal(item.sensitivityRequired, true);
}

assert.ok(rationale.hiddenConstants.length >= 7);
assert.ok(rationale.hiddenConstants.every((item) => item.rationale));
assert.ok(rationale.hiddenConstants.filter((item) => item.sensitivityRequired === false).every((item) => item.tier === "E"), "only computational/display constants may skip sensitivity");
const hiddenIds = new Set(rationale.hiddenConstants.map((item) => item.id));
assert.ok(hiddenIds.has("requiredObservabilityForEffectiveAlignment"));
assert.ok(hiddenIds.has("remediationProbabilityOnDetectedConcealment"));
assert.ok(hiddenIds.has("permanentIndependenceLossOnUnconditionalDefeat"));

console.log(`✓ ${records.size} active model defaults have matching rationales`);
console.log(`✓ ${rationale.hiddenConstants.length} hidden constants disclosed`);
console.log("✓ evidence tiers, source IDs, and sensitivity requirements");
console.log("Default rationale validation passed.");
