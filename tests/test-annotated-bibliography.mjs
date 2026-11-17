import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { REFERENCES, REFERENCE_ORDER } from "../web/references.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const generator = path.join(ROOT, "analysis", "generate_annotated_bibliography.mjs");
const paths = [
  path.join(ROOT, "analysis", "output", "annotated-bibliography.json"),
  path.join(ROOT, "analysis", "output", "ANNOTATED_BIBLIOGRAPHY.md"),
  path.join(ROOT, "web", "annotated-bibliography.mjs"),
  path.join(ROOT, "web", "ANNOTATED_BIBLIOGRAPHY.md"),
  path.join(ROOT, "research", "annotated-bibliography-manifest.json"),
];

function sha(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
function normalize(value) {
  const url = new URL(value); url.protocol = "https:"; url.hash = "";
  return url.toString().replace(/\/$/, "");
}

execFileSync(process.execPath, [generator], { cwd: ROOT, stdio: "ignore" });
const before = paths.map((file) => fs.readFileSync(file));
execFileSync(process.execPath, [generator], { cwd: ROOT, stdio: "ignore" });
before.forEach((value, index) => assert.deepEqual(fs.readFileSync(paths[index]), value));

const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, "research", "source-catalog.v1.json")));
const supplement = JSON.parse(fs.readFileSync(path.join(ROOT, "research", "bibliography-supplement.v1.json")));
const result = JSON.parse(fs.readFileSync(paths[0]));
const urls = result.entries.map((entry) => entry.url);
assert.equal(new Set(urls).size, urls.length, "bibliography URLs must be unique");
assert.ok(urls.every((url) => url.startsWith("https://")));
for (const source of catalog.sources) assert.ok(urls.includes(normalize(source.url)), `missing catalog source ${source.id}`);
for (const source of supplement.sources) assert.ok(urls.includes(normalize(source.url)), `missing supplemental source ${source.id}`);
for (const key of REFERENCE_ORDER) {
  for (const source of REFERENCES[key].sources) {
    assert.ok(urls.includes(normalize(source.url)), `missing registry URL ${source.url}`);
    const entry = result.entries.find((item) => item.url === normalize(source.url));
    assert.ok(entry.referenceKeys.includes(key), `${source.url} missing reference-key mapping ${key}`);
  }
}
for (const entry of result.entries) {
  assert.ok(entry.title && entry.supports.length && entry.modelUses.length && entry.status && entry.limitations.length);
}
assert.deepEqual(Object.keys(result.metadata.groups), ["empirical", "theory", "governance"]);
const manifest = JSON.parse(fs.readFileSync(paths[4]));
for (const [relative, expected] of Object.entries(manifest.outputs)) {
  assert.equal(sha(fs.readFileSync(path.join(ROOT, relative))), expected, `${relative} checksum mismatch`);
}
const markdown = fs.readFileSync(paths[1], "utf8");
assert.match(markdown, /https:\/\//);
assert.match(markdown, /\*\*Supports:\*\*/);
assert.match(markdown, /\*\*Limitations\/access:\*\*/);

console.log(`✓ ${result.entries.length} unique linked and annotated research sources`);
console.log("✓ complete source-catalog and interface-reference coverage");
console.log("✓ byte-identical generation and checksum manifest");
console.log("Annotated bibliography validation passed.");
