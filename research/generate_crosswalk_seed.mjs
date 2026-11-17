import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { COUNTRIES } from "../web/countries.mjs";

const COLUMNS = Object.freeze([
  "institution_id",
  "canonical_name",
  "entity_type",
  "iso_alpha2",
  "iso_alpha3",
  "cow_code",
  "world_bank_code",
  "ucdp_gwno",
  "valid_from",
  "valid_to",
  "predecessor_ids",
  "successor_ids",
  "mapping_status",
  "reviewer",
  "reviewed_at",
  "source_notes",
]);

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function buildSeedRows() {
  return COUNTRIES.map((name, index) => ({
    institution_id: `state-${String(index + 1).padStart(3, "0")}`,
    canonical_name: name,
    entity_type: "state",
    iso_alpha2: "",
    iso_alpha3: "",
    cow_code: "",
    world_bank_code: "",
    ucdp_gwno: "",
    valid_from: "",
    valid_to: "",
    predecessor_ids: "",
    successor_ids: "",
    mapping_status: "unresolved",
    reviewer: "",
    reviewed_at: "",
    source_notes: "Seeded from the 195-entity country baseline; external identifiers not yet verified.",
  }));
}

export function rowsToCsv(rows) {
  return [
    COLUMNS.join(","),
    ...rows.map((row) => COLUMNS.map((column) => csvCell(row[column])).join(",")),
  ].join("\n") + "\n";
}

function main() {
  const directory = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "data", "crosswalks");
  fs.mkdirSync(directory, { recursive: true });
  const output = path.join(directory, "institution-identifiers.csv");
  const rows = buildSeedRows();
  fs.writeFileSync(output, rowsToCsv(rows));
  console.log(`Generated ${rows.length} unresolved state identifier rows at ${output}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
