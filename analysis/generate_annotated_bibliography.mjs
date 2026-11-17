import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { REFERENCES, REFERENCE_ORDER } from "../web/references.mjs";
import { REFERENCE_TO_DEFAULT } from "../web/reference-default-map.mjs";
import { DEFAULT_RATIONALES } from "../web/default-rationales.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CATALOG_PATH = path.join(ROOT, "research", "source-catalog.v1.json");
const REFERENCES_PATH = path.join(ROOT, "web", "references.mjs");
const SUPPLEMENT_PATH = path.join(ROOT, "research", "bibliography-supplement.v1.json");
const JSON_PATH = path.join(ROOT, "analysis", "output", "annotated-bibliography.json");
const MD_PATH = path.join(ROOT, "analysis", "output", "ANNOTATED_BIBLIOGRAPHY.md");
const WEB_PATH = path.join(ROOT, "web", "annotated-bibliography.mjs");
const WEB_MD_PATH = path.join(ROOT, "web", "ANNOTATED_BIBLIOGRAPHY.md");
const MANIFEST_PATH = path.join(ROOT, "research", "annotated-bibliography-manifest.json");
const FRAGMENT_PATH = path.join(ROOT, "web", "annotated-bibliography-fragment.html");
const INDEX_PATH = path.join(ROOT, "web", "index.html");

const GROUPS = Object.freeze({
  empirical: "Empirical datasets and indicators",
  theory: "Theory, methods, and comparison models",
  governance: "Governance, standards, rights, and institutional context",
});

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function normalizeUrl(value) {
  const parsed = new URL(value);
  parsed.protocol = "https:";
  parsed.hash = "";
  const normalized = parsed.toString().replace(/\/$/, "");
  return normalized;
}

function classifyReference(source) {
  const text = `${source.label} ${source.url}`.toLowerCase();
  if (/nist|ohchr|united-nations|un\.org|pewresearch|justice\.gov|oecd|ifrs|cyberframework|governance/.test(text)) return "governance";
  return "theory";
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDefaultValue(value, key) {
  if (key === "currentWaveInProgress") return value ? "On" : "Off";
  if (typeof value === "number" && value >= 0 && value <= 1) return `${Number((value * 100).toFixed(1))}%`;
  return Number(value).toLocaleString();
}

function replaceGeneratedBlock(content, startMarker, endMarker, generated) {
  const start = content.indexOf(startMarker);
  const end = content.indexOf(endMarker);
  if (start < 0 || end < start) throw new Error(`Missing generated block markers: ${startMarker}`);
  const insertionStart = start + startMarker.length;
  return `${content.slice(0, insertionStart)}
${generated}
        ${content.slice(end)}`;
}

const catalogText = fs.readFileSync(CATALOG_PATH, "utf8");
const catalog = JSON.parse(catalogText);
const supplementText = fs.readFileSync(SUPPLEMENT_PATH, "utf8");
const supplement = JSON.parse(supplementText);
const entries = new Map();

for (const source of catalog.sources) {
  const url = normalizeUrl(source.url);
  entries.set(url, {
    sourceIds: [source.id],
    referenceKeys: [],
    title: source.name,
    owner: source.owner,
    url,
    group: source.id === "dalio_cwo" ? "theory" : "empirical",
    version: source.version,
    coverage: source.coverage,
    supports: [source.plannedUse],
    modelUses: [],
    status: source.verificationStatus,
    limitations: unique([source.accessNotes, `License/access: ${source.licenseStatus}`]),
  });
}

for (const source of supplement.sources) {
  const url = normalizeUrl(source.url);
  if (entries.has(url)) continue;
  entries.set(url, {
    sourceIds: [source.id],
    referenceKeys: [],
    title: source.title,
    owner: source.owner,
    url,
    group: source.group,
    version: source.version,
    coverage: source.coverage,
    supports: [source.supports],
    modelUses: [source.modelUse],
    status: source.status,
    limitations: [source.limitations],
  });
}

for (const key of REFERENCE_ORDER) {
  const reference = REFERENCES[key];
  for (const source of reference.sources) {
    const url = normalizeUrl(source.url);
    const existing = entries.get(url);
    if (existing) {
      existing.supports = unique([...existing.supports, reference.summary]);
      existing.modelUses = unique([...existing.modelUses, reference.title]);
      existing.referenceKeys = unique([...existing.referenceKeys, key]);
      continue;
    }
    entries.set(url, {
      sourceIds: [],
      referenceKeys: [key],
      title: source.label,
      owner: null,
      url,
      group: classifyReference(source),
      version: "Linked reference; version not locally frozen",
      coverage: "Source-specific",
      supports: [reference.summary],
      modelUses: [reference.title],
      status: `${reference.kind}; linked in the reviewed interface registry`,
      limitations: ["Provides contextual, conceptual, or methodological support; it does not independently validate the model's numeric defaults or forecasts."],
    });
  }
}

const bibliographyEntries = [...entries.values()].map((entry) => ({
  ...entry,
  id: `source-${sha256(entry.url).slice(0, 12)}`,
  referenceKeys: unique(entry.referenceKeys),
  supports: unique(entry.supports),
  modelUses: entry.modelUses.length ? unique(entry.modelUses) : ["Versioned research program; current or planned use"],
  limitations: unique(entry.limitations),
})).sort((left, right) => (
  Object.keys(GROUPS).indexOf(left.group) - Object.keys(GROUPS).indexOf(right.group)
  || left.title.localeCompare(right.title)
));

const result = {
  metadata: {
    generated: "2026-10-09",
    sourceCatalogVersion: catalog.catalogVersion,
    sourceCatalogCount: catalog.sources.length,
    supplementalSourceCount: supplement.sources.length,
    referenceRegistryCount: REFERENCE_ORDER.length,
    uniqueSourceCount: bibliographyEntries.length,
    groups: GROUPS,
    annotationPolicy: "Every entry identifies support, model use, status, and limitations; links are direct HTTPS URLs.",
  },
  entries: bibliographyEntries,
};

const defaultById = new Map(DEFAULT_RATIONALES.defaults.map((item) => [item.id, item]));
const sourceByReference = new Map(REFERENCE_ORDER.map((key) => [
  key,
  bibliographyEntries.filter((entry) => entry.referenceKeys.includes(key)),
]));
const topicHtml = Object.entries(REFERENCE_TO_DEFAULT).map(([key, defaultId]) => {
  const reference = REFERENCES[key];
  const item = defaultById.get(defaultId);
  const links = sourceByReference.get(key).map((entry) => (
    `<a href="#bib-${entry.id}">Full annotation: ${escapeHtml(entry.title)} ↓</a>`
  )).join("");
  return `<article id="bib-topic-${escapeHtml(key)}" class="bibliography-topic-card"><h4>${escapeHtml(reference.title)}</h4><strong>Default ${escapeHtml(formatDefaultValue(item.default, item.id))} · Tier ${escapeHtml(item.tier)} · ${escapeHtml(item.confidence)}</strong><p>${escapeHtml(item.rationale)}</p><p class="bibliography-topic-card__basis">Basis: ${escapeHtml(item.derivation)}</p><div class="bibliography-topic-card__links">${links}</div></article>`;
}).join("\n          ");
const categoryHtml = Object.entries(GROUPS).map(([groupKey, groupLabel], groupIndex) => {
  const groupEntries = bibliographyEntries.filter((entry) => entry.group === groupKey);
  const cards = groupEntries.map((entry, index) => (
    `<article id="bib-${entry.id}" class="bibliography-card"><span class="bibliography-card__number">${String(index + 1).padStart(2, "0")}</span><a href="${escapeHtml(entry.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(entry.title)} — Open paper/site ↗</a><p class="bibliography-card__owner">${escapeHtml(entry.owner ?? "Publisher/author identified at linked source")}</p><p class="bibliography-card__metadata">${escapeHtml(entry.version)} · ${escapeHtml(entry.coverage)}</p><p><strong>Supports: </strong>${escapeHtml(entry.supports.join(" "))}</p><p><strong>Used for: </strong>${escapeHtml(entry.modelUses.join("; "))}</p><p><strong>Status: </strong>${escapeHtml(entry.status)}</p><p class="bibliography-card__limits"><strong>Limitations/access: </strong>${escapeHtml(entry.limitations.join(" "))}</p></article>`
  )).join("\n            ");
  return `<details class="bibliography-group"${groupIndex === 0 ? " open" : ""}><summary class="bibliography-group__heading"><h3>${escapeHtml(groupLabel)}</h3><span>${groupEntries.length} sources · expand/collapse</span></summary><div class="bibliography-grid">${cards}</div></details>`;
}).join("\n        ");
const fragmentText = `<!-- Variable/default reference map -->
${topicHtml}

<!-- Expandable bibliography categories -->
${categoryHtml}
`;
let indexText = fs.readFileSync(INDEX_PATH, "utf8");
indexText = replaceGeneratedBlock(indexText, "<!-- GENERATED VARIABLE TOPICS START -->", "<!-- GENERATED VARIABLE TOPICS END -->", `          ${topicHtml}`);
indexText = replaceGeneratedBlock(indexText, "<!-- GENERATED BIBLIOGRAPHY START -->", "<!-- GENERATED BIBLIOGRAPHY END -->", `        ${categoryHtml}`);

fs.mkdirSync(path.dirname(JSON_PATH), { recursive: true });
const jsonText = `${JSON.stringify(result, null, 2)}\n`;
const webText = `// Generated by analysis/generate_annotated_bibliography.mjs; do not edit manually.\nexport const ANNOTATED_BIBLIOGRAPHY = Object.freeze(${JSON.stringify(result)});\n`;
const markdown = [
  "# Complete Annotated Bibliography",
  "",
  `**Unique linked sources:** ${result.metadata.uniqueSourceCount}  `,
  `**Versioned catalog sources:** ${result.metadata.sourceCatalogCount}  `,
  "**Scope:** Every source-catalog record and every paper/site linked from the interface reference registry",
  "",
  "> Inclusion documents how a source is used. It does not mean the source validates the full model or its forecasts.",
  "",
];
for (const [group, label] of Object.entries(GROUPS)) {
  markdown.push(`## ${label}`, "");
  for (const entry of bibliographyEntries.filter((item) => item.group === group)) {
    markdown.push(
      `### [${entry.title}](${entry.url})`,
      "",
      `- **Publisher/owner:** ${entry.owner ?? "See linked source"}`,
      `- **Version/coverage:** ${entry.version}; ${entry.coverage}`,
      `- **Supports:** ${entry.supports.join(" ")}`,
      `- **Used for:** ${entry.modelUses.join("; ")}`,
      `- **Status:** ${entry.status}`,
      `- **Limitations/access:** ${entry.limitations.join(" ")}`,
      "",
    );
  }
}
const mdText = `${markdown.join("\n")}\n`;
fs.writeFileSync(JSON_PATH, jsonText);
fs.writeFileSync(MD_PATH, mdText);
fs.writeFileSync(WEB_PATH, webText);
fs.writeFileSync(WEB_MD_PATH, mdText);
fs.writeFileSync(FRAGMENT_PATH, fragmentText);
fs.writeFileSync(INDEX_PATH, indexText);
const manifest = {
  generated: result.metadata.generated,
  sourceCatalogSha256: sha256(catalogText),
  supplementalSourcesSha256: sha256(supplementText),
  referenceRegistrySha256: sha256(fs.readFileSync(REFERENCES_PATH)),
  outputs: {
    [path.relative(ROOT, JSON_PATH)]: sha256(jsonText),
    [path.relative(ROOT, MD_PATH)]: sha256(mdText),
    [path.relative(ROOT, WEB_PATH)]: sha256(webText),
    [path.relative(ROOT, WEB_MD_PATH)]: sha256(mdText),
    [path.relative(ROOT, FRAGMENT_PATH)]: sha256(fragmentText),
  },
  uniqueSourceCount: result.metadata.uniqueSourceCount,
};
fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Generated ${result.metadata.uniqueSourceCount} unique annotated references from ${catalog.sources.length} catalog records, ${supplement.sources.length} supplemental research links, and ${REFERENCE_ORDER.length} reference topics.`);
