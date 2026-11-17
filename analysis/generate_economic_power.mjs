import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { COUNTRIES } from "../web/countries.mjs";
import { TECH_COMPANIES, TECH_REVENUE_BASIS } from "../web/tech-companies.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WDI_PATH = path.join(ROOT, "data", "processed", "wdi_state_year_2026-10-06.csv");
const MODULE_PATH = path.join(ROOT, "web", "economic-power-data.mjs");
const CSV_PATH = path.join(ROOT, "analysis", "output", "economic-power-baseline.csv");
const MANIFEST_PATH = path.join(ROOT, "research", "economic-power-manifest.json");
const COW_CANDIDATES_PATH = path.join(ROOT, "data", "crosswalks", "cow-v2024-candidates.csv");
const MID_STATE_YEAR_PATH = path.join(ROOT, "data", "processed", "cow_mid_state_year_v5.csv");

const COUNTRY_ALIASES = Object.freeze({
  Bahamas: "Bahamas, The",
  Brunei: "Brunei Darussalam",
  "Congo, Democratic Republic of the": "Congo, Dem. Rep.",
  "Congo, Republic of the": "Congo, Rep.",
  "Côte d'Ivoire": "Cote d'Ivoire",
  Egypt: "Egypt, Arab Rep.",
  Gambia: "Gambia, The",
  Iran: "Iran, Islamic Rep.",
  Kyrgyzstan: "Kyrgyz Republic",
  Laos: "Lao PDR",
  Micronesia: "Micronesia, Fed. Sts.",
  "North Korea": "Korea, Dem. People's Rep.",
  Russia: "Russian Federation",
  "Saint Kitts and Nevis": "St. Kitts and Nevis",
  "Saint Lucia": "St. Lucia",
  "Saint Vincent and the Grenadines": "St. Vincent and the Grenadines",
  Slovakia: "Slovak Republic",
  Somalia: "Somalia, Fed. Rep.",
  "South Korea": "Korea, Rep.",
  "State of Palestine (Observer State)": "West Bank and Gaza",
  Syria: "Syrian Arab Republic",
  Türkiye: "Turkiye",
  Venezuela: "Venezuela, RB",
  Vietnam: "Viet Nam",
  Yemen: "Yemen, Rep.",
});

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"') {
      if (quoted && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[index + 1] === "\n") index += 1;
      row.push(field);
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const [header, ...body] = rows;
  return body.map((values) => Object.fromEntries(header.map((key, index) => [key, values[index] ?? ""])));
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function closestGrowthWindow(series) {
  if (series.length < 2) return null;
  const latest = series.at(-1);
  const preferred = series.filter((item) => item.year >= latest.year - 12 && item.year <= latest.year - 8 && item.value > 0);
  const fallback = series.filter((item) => item.year <= latest.year - 3 && item.value > 0);
  const candidates = preferred.length ? preferred : fallback;
  if (!candidates.length || latest.value <= 0) return null;
  const start = candidates.reduce((best, item) => (
    Math.abs((latest.year - item.year) - 10) < Math.abs((latest.year - best.year) - 10) ? item : best
  ));
  const years = latest.year - start.year;
  return {
    startYear: start.year,
    endYear: latest.year,
    rate: (latest.value / start.value) ** (1 / years) - 1,
  };
}

const wdiText = fs.readFileSync(WDI_PATH, "utf8");
const wdiRows = parseCsv(wdiText);
const seriesByName = new Map();
for (const row of wdiRows) {
  const value = Number(row.gdp_current_usd);
  if (!Number.isFinite(value) || value <= 0) continue;
  if (!seriesByName.has(row.world_bank_name)) seriesByName.set(row.world_bank_name, []);
  seriesByName.get(row.world_bank_name).push({ year: Number(row.year), value });
}
for (const series of seriesByName.values()) series.sort((left, right) => left.year - right.year);

const countryDrafts = COUNTRIES.map((name) => {
  const worldBankName = COUNTRY_ALIASES[name] ?? name;
  const series = seriesByName.get(worldBankName) ?? [];
  const latest = series.at(-1) ?? null;
  const growth = closestGrowthWindow(series);
  return { name, worldBankName, latest, growth };
});
const measuredGrowth = countryDrafts.map((item) => item.growth?.rate).filter(Number.isFinite).sort((a, b) => a - b);
const medianCountryGrowth = measuredGrowth.length % 2
  ? measuredGrowth[(measuredGrowth.length - 1) / 2]
  : (measuredGrowth[measuredGrowth.length / 2 - 1] + measuredGrowth[measuredGrowth.length / 2]) / 2;

const cowCandidates = parseCsv(fs.readFileSync(COW_CANDIDATES_PATH, "utf8"));
const cowByName = new Map(cowCandidates.filter((row) => row.candidate_cow_code).map((row) => [row.canonical_name, row.candidate_cow_code]));
const midText = fs.readFileSync(MID_STATE_YEAR_PATH, "utf8");
const midTotals = new Map();
for (const row of parseCsv(midText)) {
  const year = Number(row.year);
  if (year < 1946 || year > 2014) continue;
  const current = midTotals.get(row.cow_code) ?? { onsets: 0, years: 0 };
  current.onsets += Number(row.dispute_onsets) || 0;
  current.years += 1;
  midTotals.set(row.cow_code, current);
}
const onsetRate = (name) => {
  const code = cowByName.get(name);
  const total = code ? midTotals.get(code) : null;
  return total && total.years ? total.onsets / total.years : null;
};
const rates = COUNTRIES.map(onsetRate).filter((value) => value !== null).sort((a, b) => a - b);
const p90 = rates[Math.floor(0.9 * (rates.length - 1))];
const medianRate = rates[Math.floor(rates.length / 2)];
const exposureFor = (name) => {
  const rate = onsetRate(name);
  return Math.min(1, (rate ?? medianRate) / p90);
};

const countryRecords = countryDrafts.map(({ name, worldBankName, latest, growth }) => ({
  name,
  type: "country",
  basis: "GDP",
  basePowerUsd: latest?.value ?? null,
  baseYear: latest?.year ?? null,
  averageGrowthRate: growth?.rate ?? (latest ? medianCountryGrowth : null),
  growthStartYear: growth?.startYear ?? null,
  growthEndYear: growth?.endYear ?? null,
  growthMethod: growth
    ? "nominal USD GDP CAGR"
    : latest
      ? "measured-country median nominal USD GDP CAGR fallback"
      : "unavailable",
  sourceStatus: latest ? "World Bank WDI measured" : "GDP unavailable in cached WDI panel",
  sourceName: worldBankName,
  conflictExposure: exposureFor(name),
  conflictExposureMethod: onsetRate(name) === null ? "median MID onset-rate fallback" : "COW MID onsets per state-year, 1946–2014, ÷ 90th percentile",
}));

const countryByName = new Map(countryRecords.map((record) => [record.name, record]));
const companyRecords = TECH_COMPANIES.map((company) => {
  const origins = company.origin.split(" / ");
  const originRates = origins.map((origin) => countryByName.get(origin)?.averageGrowthRate).filter(Number.isFinite);
  const growthRate = originRates.length
    ? originRates.reduce((total, value) => total + value, 0) / originRates.length
    : medianCountryGrowth;
  return {
    name: company.name,
    type: "company",
    basis: "Revenue",
    basePowerUsd: company.approximateRevenueUsdB * 1_000_000_000,
    baseYear: TECH_REVENUE_BASIS.primaryYear,
    averageGrowthRate: growthRate,
    growthStartYear: null,
    growthEndYear: null,
    growthMethod: originRates.length
      ? `origin GDP CAGR proxy (${origins.join(" + ")})`
      : "measured-country median GDP CAGR proxy",
    sourceStatus: "Approximate reported revenue; growth is a GDP proxy",
    sourceName: TECH_REVENUE_BASIS.primarySource,
    conflictExposure: origins.map(exposureFor).reduce((total, value) => total + value, 0) / origins.length,
    conflictExposureMethod: `origin-country MID exposure mean (${origins.join(" + ")})`,
  };
});

const records = [...countryRecords, ...companyRecords];
const metadata = {
  schemaVersion: "1.0",
  generated: "2026-10-09",
  powerUnit: "current USD",
  countryBasis: "latest positive World Bank GDP current USD observation",
  growthWindow: "closest positive observation approximately ten years before latest",
  companyBasis: "approximate 2025 annual revenue",
  companyGrowth: "listed-origin nominal USD GDP CAGR proxy; measured-country median fallback",
  medianCountryGrowth,
  countryCount: countryRecords.length,
  companyCount: companyRecords.length,
  measuredCountryCount: countryRecords.filter((record) => record.basePowerUsd !== null).length,
  missingCountryNames: countryRecords.filter((record) => record.basePowerUsd === null).map((record) => record.name),
  conflictExposurePolicy: "Exposure = country MID onsets per state-year (1946–2014) divided by the 90th-percentile country rate, capped at 1; unmapped countries use the median; companies use origin-country mean.",
  comparabilityWarning: "GDP is value added while corporate revenue is gross sales. The joint rank double-counts activity and is an economic-power heuristic, not an accounting total.",
};

const moduleText = `// Generated by analysis/generate_economic_power.mjs; do not edit manually.\nexport const ECONOMIC_POWER_METADATA = Object.freeze(${JSON.stringify(metadata)});\nexport const ECONOMIC_POWER_DATA = Object.freeze(${JSON.stringify(records)}.map((record) => Object.freeze(record)));\n`;
fs.writeFileSync(MODULE_PATH, moduleText);

const columns = ["rankBase", "name", "type", "basis", "basePowerUsd", "baseYear", "averageGrowthRate", "growthStartYear", "growthEndYear", "growthMethod", "sourceStatus", "sourceName"];
const ranked = [...records].sort((left, right) => (right.basePowerUsd ?? -1) - (left.basePowerUsd ?? -1));
const csvText = [columns.join(","), ...ranked.map((record, index) => columns.map((column) => csvEscape(column === "rankBase" ? index + 1 : record[column])).join(","))].join("\n") + "\n";
fs.writeFileSync(CSV_PATH, csvText);

const manifest = {
  schemaVersion: "1.0",
  generated: metadata.generated,
  source: path.relative(ROOT, WDI_PATH),
  sourceSha256: sha256(wdiText),
  midSource: path.relative(ROOT, MID_STATE_YEAR_PATH),
  midSourceSha256: sha256(midText),
  outputs: {
    [path.relative(ROOT, MODULE_PATH)]: sha256(moduleText),
    [path.relative(ROOT, CSV_PATH)]: sha256(csvText),
  },
  counts: {
    records: records.length,
    measuredCountries: metadata.measuredCountryCount,
    companies: companyRecords.length,
  },
  missingCountryNames: metadata.missingCountryNames,
};
fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`Generated ${records.length} economic-power records (${metadata.measuredCountryCount}/195 countries measured).`);
