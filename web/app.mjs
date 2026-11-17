import { COUNTRIES } from "./countries.mjs";
import { COUNTRY_COORDINATES } from "./world-coordinates.mjs";
import { WORLD_BOUNDARIES } from "./world-boundaries.mjs";
import { TECH_COMPANIES } from "./tech-companies.mjs";
import { ECONOMIC_POWER_DATA, ECONOMIC_POWER_METADATA } from "./economic-power-data.mjs";
import {
  ECONOMIC_POWER_ASSUMPTIONS,
  conflictPowerState,
  hierarchyEconomicShare,
  rankEconomicPower,
} from "./economic-power.mjs";
import { REFERENCES, REFERENCE_ORDER } from "./references.mjs";
import { REFERENCE_TO_DEFAULT } from "./reference-default-map.mjs";
import { ANALYSIS_RESULTS } from "./analysis-results.mjs";
import { EMPIRICAL_RESULTS } from "./validation-results.mjs";
import { PROGRAM_STATUS } from "./program-status.mjs";
import { DEFAULT_RATIONALES } from "./default-rationales.mjs";
import { MODEL_INSIGHTS } from "./model-insights.mjs";
import { SCENARIO_MATRIX } from "./scenario-matrix.mjs";
import { COW_WAVE_ROBUSTNESS } from "./cow-wave-robustness.mjs";
import { COW_MODEL_COMPARISON } from "./cow-model-comparison.mjs";
import { TARGET_FIVE_ANALYSIS, TARGET_FIVE_PRESETS } from "./target-five-analysis.mjs";
import { MONTE_CARLO_RESULTS } from "./monte-carlo-results.mjs";
import { ANNOTATED_BIBLIOGRAPHY } from "./annotated-bibliography.mjs?v=20261008-1129";
import {
  replicateOutcomes,
  BASE_YEAR,
  DEFAULTS,
  agentsAtYear,
  architectureAdoption,
  buildInstitutionHierarchyAssignments,
  buildTimelineSeries,
  calendarYear,
  CURRENT_WAVE_RESOLUTION_YEARS,
  formatCalendarYear,
  consolidationAccelerationState,
  effectiveApexInfluence,
  institutionCountThresholdYear,
  normalizeParameters,
  apexStructuralInfluence,
  apexDominanceYear,
  simulateConsolidation,
  timeToAdoption,
} from "./model.mjs";

const ENTITIES = Object.freeze([
  ...COUNTRIES.map((name) => Object.freeze({ name, type: "country" })),
  ...TECH_COMPANIES.map((company) => Object.freeze({ ...company, type: "company" })),
]);
const ENTITY_BY_NAME = new Map(ENTITIES.map((entity) => [entity.name, entity]));
const ECONOMIC_BY_NAME = new Map(ECONOMIC_POWER_DATA.map((record) => [record.name, record]));
const DEFAULT_BY_ID = new Map(DEFAULT_RATIONALES.defaults.map((item) => [item.id, item]));
const controls = {
  startAgents: document.querySelector("#start-agents"),
  conflictInterval: document.querySelector("#conflict-interval"),
  qualifyingShare: document.querySelector("#qualifying-share"),
  institutionEventProbability: document.querySelector("#institution-event-probability"),
  fragmentationPerEvent: document.querySelector("#fragmentation"),
  internalConflict: document.querySelector("#internal-conflict"),
  leadingInstitutionStrength: document.querySelector("#leading-institution-strength"),
  systemicCycleStress: document.querySelector("#systemic-cycle-stress"),
  economicCoupling: document.querySelector("#economic-coupling"),
  institutionalAdoptionRate: document.querySelector("#institutional-adoption-rate"),
  spreadRate: document.querySelector("#spread-rate"),
  consolidationAcceleration: document.querySelector("#consolidation-acceleration"),
  currentWaveInProgress: document.querySelector("#current-wave"),
  horizon: document.querySelector("#horizon"),
  selectedYear: document.querySelector("#selected-year"),
};

const outputs = {
  startAgents: document.querySelector("#start-agents-value"),
  conflictInterval: document.querySelector("#conflict-interval-value"),
  qualifyingShare: document.querySelector("#qualifying-share-value"),
  institutionEventProbability: document.querySelector("#institution-event-probability-value"),
  fragmentationPerEvent: document.querySelector("#fragmentation-value"),
  internalConflict: document.querySelector("#internal-conflict-value"),
  leadingInstitutionStrength: document.querySelector("#leading-institution-strength-value"),
  systemicCycleStress: document.querySelector("#systemic-cycle-stress-value"),
  economicCoupling: document.querySelector("#economic-coupling-value"),
  institutionalAdoptionRate: document.querySelector("#institutional-adoption-rate-value"),
  spreadRate: document.querySelector("#spread-rate-value"),
  consolidationAcceleration: document.querySelector("#consolidation-acceleration-value"),
  currentWaveInProgress: document.querySelector("#current-wave-value"),
  horizon: document.querySelector("#horizon-value"),
  selectedYear: document.querySelector("#selected-year-value"),
};

const elements = {
  articleTimelineGrid: document.querySelector("#article-timeline-grid"),
  articleExpected: document.querySelector("#article-expected"),
  articleUncertaintyGrid: document.querySelector("#article-uncertainty-grid"),
  reset: document.querySelector("#reset-button"),
  play: document.querySelector("#play-button"),
  stepBack: document.querySelector("#step-back"),
  stepForward: document.querySelector("#step-forward"),
  activeAgents: document.querySelector("#active-agents"),
  activeAgentsCaption: document.querySelector("#active-agents-caption"),
  apexYear: document.querySelector("#apex-year"),
  apexCaption: document.querySelector("#apex-caption"),
  targetFiveYear: document.querySelector("#target-five-year"),
  targetFiveCaption: document.querySelector("#target-five-caption"),
  apexStructuralInfluence: document.querySelector("#apex-influence"),
  apexStructuralInfluenceCaption: document.querySelector("#apex-influence-caption"),
  adoptionValue: document.querySelector("#adoption-value"),
  adoptionCaption: document.querySelector("#adoption-caption"),
  effectiveConsolidation: document.querySelector("#effective-consolidation"),
  effectiveConsolidationChange: document.querySelector("#effective-consolidation-change"),
  effectiveQualifyingShare: document.querySelector("#effective-qualifying-share"),
  effectiveQualifyingChange: document.querySelector("#effective-qualifying-change"),
  effectiveInternalConflict: document.querySelector("#effective-internal-conflict"),
  effectiveInternalChange: document.querySelector("#effective-internal-change"),
  accelerationMultiplier: document.querySelector("#acceleration-multiplier"),
  acceleratedLoss: document.querySelector("#accelerated-loss"),
  economicPowerSummary: document.querySelector("#economic-power-summary"),
  economicPowerTableBody: document.querySelector("#economic-power-table-body"),
  conflictPowerState: document.querySelector("#conflict-power-state"),
  chart: document.querySelector("#timeline-chart"),
  worldMap: document.querySelector("#world-map"),
  mapPlay: document.querySelector("#map-play-button"),
  worldMapYear: document.querySelector("#world-map-year"),
  worldMapCenters: document.querySelector("#world-map-centers"),
  worldMapSlider: document.querySelector("#world-map-slider"),
  countryGrid: document.querySelector("#country-grid"),
  blocSummaries: document.querySelector("#bloc-summaries"),
  constellationTitle: document.querySelector("#constellation-title"),
  constellationCaption: document.querySelector("#constellation-caption"),
  selectedCountry: document.querySelector("#selected-country"),
  interpretationTitle: document.querySelector("#interpretation-title"),
  interpretationText: document.querySelector("#interpretation-text"),
  referenceLedger: document.querySelector("#reference-ledger"),
  apexScopeYear: document.querySelector("#apex-scope-year"),
  apexScopeRate: document.querySelector("#apex-scope-rate"),
  annotatedBibliographySummary: document.querySelector("#annotated-bibliography-summary"),
  bibliographyVariableTopics: document.querySelector("#bibliography-variable-topics"),
  annotatedBibliography: document.querySelector("#annotated-bibliography"),
  insightCards: document.querySelector("#insight-cards"),
  granularityResults: document.querySelector("#granularity-results"),
  observabilityResults: document.querySelector("#observability-results"),
  challengeSummary: document.querySelector("#challenge-summary"),
  targetFiveSummary: document.querySelector("#target-five-summary"),
  targetFiveInteractionSummary: document.querySelector("#target-five-interaction-summary"),
  targetFiveSensitivityTableBody: document.querySelector("#target-five-sensitivity-table-body"),
  challengeScenarioTableBody: document.querySelector("#challenge-scenario-table-body"),
  robustnessTableBody: document.querySelector("#robustness-table-body"),
  comparisonTableBody: document.querySelector("#comparison-table-body"),
  monteCarloProfile: document.querySelector("#monte-carlo-profile"),
  monteCarloDescription: document.querySelector("#monte-carlo-description"),
  monteCarloStats: document.querySelector("#monte-carlo-stats"),
  monteCarloHistogram: document.querySelector("#monte-carlo-histogram"),
  monteCarloSurvival: document.querySelector("#monte-carlo-survival"),
  monteCarloInputsTableBody: document.querySelector("#monte-carlo-inputs-table-body"),
  monteCarloSensitivityTableBody: document.querySelector("#monte-carlo-sensitivity-table-body"),
  monteCarloTerminalBands: document.querySelector("#monte-carlo-terminal-bands"),
  monteCarloConvergenceTableBody: document.querySelector("#monte-carlo-convergence-table-body"),
  empiricalStats: document.querySelector("#empirical-stats"),
  kmResults: document.querySelector("#km-results"),
  backtestTableBody: document.querySelector("#backtest-table-body"),
  phaseStatusGrid: document.querySelector("#phase-status-grid"),
  nextActions: document.querySelector("#next-actions"),
  pcaComponents: document.querySelector("#pca-components"),
  sensitivityList: document.querySelector("#sensitivity-list"),
  scenarioTableBody: document.querySelector("#scenario-table-body"),
  presets: [...document.querySelectorAll("[data-preset]")],
};

const PRESETS = Object.freeze({
  cow: { ...DEFAULTS },
  fast5: { ...TARGET_FIVE_PRESETS.fastest },
  slow5: { ...TARGET_FIVE_PRESETS.longestBounded },
  every: {
    ...DEFAULTS,
    qualifyingShare: 1,
    horizon: 500,
  },
  stalemate: {
    ...DEFAULTS,
    qualifyingShare: 0.35,
    institutionEventProbability: 0.08,
    fragmentationPerEvent: 10,
    internalConflict: 0.15,
    horizon: 2000,
  },
});

let parameters = { ...DEFAULTS };
let simulation = simulateConsolidation(parameters);
let selectedEntityName = null;
let replicateCache = { key: null, stats: null };

function liveReplicateStats() {
  const { selectedYear, ...rest } = parameters;
  const key = JSON.stringify(rest);
  if (replicateCache.key !== key) replicateCache = { key, stats: replicateOutcomes(rest, 200) };
  return replicateCache.stats;
}
let animationFrame = null;
let animationStart = null;
let animationFrom = 0;

function parseHash() {
  const query = new URLSearchParams(location.hash.replace(/^#/, ""));
  if ([...query].length === 0) return null;
  const numeric = Object.fromEntries(
    [...query.entries()].map(([key, value]) => [key, Number(value)]),
  );
  return normalizeParameters(numeric);
}

function updateHash() {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(parameters)) {
    query.set(key, String(Number(value.toFixed?.(4) ?? value)));
  }
  history.replaceState(null, "", `#${query}`);
}

function readControls() {
  return normalizeParameters({
    startAgents: controls.startAgents.value,
    conflictInterval: controls.conflictInterval.value,
    qualifyingShare: Number(controls.qualifyingShare.value) / 100,
    institutionEventProbability: Number(controls.institutionEventProbability.value) / 100,
    fragmentationPerEvent: controls.fragmentationPerEvent.value,
    internalConflict: Number(controls.internalConflict.value) / 100,
    leadingInstitutionStrength: Number(controls.leadingInstitutionStrength.value) / 100,
    systemicCycleStress: Number(controls.systemicCycleStress.value) / 100,
    economicCoupling: Number(controls.economicCoupling.value) / 100,
    institutionalAdoptionRate: Number(controls.institutionalAdoptionRate.value) / 100,
    spreadRate: Number(controls.spreadRate.value) / 100,
    consolidationAcceleration: Number(controls.consolidationAcceleration.value) / 100,
    currentWaveInProgress: Number(controls.currentWaveInProgress.value),
    horizon: controls.horizon.value,
    selectedYear: controls.selectedYear.value,
  });
}

function writeControls(next) {
  parameters = normalizeParameters(next);
  controls.startAgents.value = parameters.startAgents;
  controls.conflictInterval.value = parameters.conflictInterval;
  controls.qualifyingShare.value = Math.round(parameters.qualifyingShare * 1000) / 10;
  controls.institutionEventProbability.value = Math.round(parameters.institutionEventProbability * 100);
  controls.fragmentationPerEvent.value = parameters.fragmentationPerEvent;
  controls.internalConflict.value = Math.round(parameters.internalConflict * 100);
  controls.leadingInstitutionStrength.value = Math.round(parameters.leadingInstitutionStrength * 100);
  controls.systemicCycleStress.value = Math.round(parameters.systemicCycleStress * 100);
  controls.economicCoupling.value = Math.round(parameters.economicCoupling * 100);
  controls.institutionalAdoptionRate.value = Math.round(parameters.institutionalAdoptionRate * 100);
  controls.spreadRate.value = Math.round(parameters.spreadRate * 100);
  controls.consolidationAcceleration.value = Math.round(parameters.consolidationAcceleration * 100);
  controls.currentWaveInProgress.value = parameters.currentWaveInProgress;
  controls.horizon.value = parameters.horizon;
  controls.selectedYear.max = parameters.horizon;
  controls.selectedYear.value = parameters.selectedYear;
}

function setRangeFill(input) {
  const minimum = Number(input.min);
  const maximum = Number(input.max);
  const value = Number(input.value);
  const fill = ((value - minimum) / (maximum - minimum)) * 100;
  input.style.setProperty("--fill", `${fill}%`);
}

function formatNumber(value, maximumFractionDigits = 0) {
  if (value === null || value === undefined) return "No reach";
  return Number(value).toLocaleString(undefined, { maximumFractionDigits });
}

function initials(name) {
  const ignored = new Set(["and", "of", "the", "State"]);
  const words = name.replace(/\(.+?\)/g, "").split(/[\s,-]+/).filter(Boolean);
  return words.filter((word) => !ignored.has(word)).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
}

function blocColor(index, count) {
  const hue = (index * 137.508 + Math.min(count, 40) * 3.1) % 360;
  return `hsl(${hue.toFixed(1)} 72% 61%)`;
}

function refreshOutputs() {
  outputs.startAgents.textContent = formatNumber(parameters.startAgents);
  outputs.conflictInterval.textContent = `${formatNumber(parameters.conflictInterval)} years`;
  outputs.qualifyingShare.textContent = `${Number((parameters.qualifyingShare * 100).toFixed(1))}% · every ${Math.round(parameters.conflictInterval / Math.max(parameters.qualifyingShare, 1e-9))} yr`;
  outputs.institutionEventProbability.textContent = `${Math.round(parameters.institutionEventProbability * 100)}%`;
  outputs.fragmentationPerEvent.textContent = formatNumber(parameters.fragmentationPerEvent);
  outputs.internalConflict.textContent = `${Math.round(parameters.internalConflict * 100)}%`;
  outputs.leadingInstitutionStrength.textContent = `${Math.round(parameters.leadingInstitutionStrength * 100)}%`;
  outputs.systemicCycleStress.textContent = `${Math.round(parameters.systemicCycleStress * 100)}%`;
  outputs.economicCoupling.textContent = `${Math.round(parameters.economicCoupling * 100)}%`;
  outputs.institutionalAdoptionRate.textContent = `${Math.round(parameters.institutionalAdoptionRate * 100)}% / year`;
  outputs.spreadRate.textContent = `${Math.round(parameters.spreadRate * 100)}% / year`;
  outputs.consolidationAcceleration.textContent = `${Math.round(parameters.consolidationAcceleration * 100)}%`;
  outputs.currentWaveInProgress.textContent = parameters.currentWaveInProgress ? `On · resolves ${calendarYear(CURRENT_WAVE_RESOLUTION_YEARS)}` : "Off";
  outputs.horizon.textContent = `through ${formatNumber(calendarYear(parameters.horizon))}`;
  outputs.selectedYear.textContent = formatNumber(calendarYear(parameters.selectedYear));
  Object.values(controls).forEach(setRangeFill);
}

function formatEconomicValue(value) {
  if (!Number.isFinite(value)) return "Unavailable";
  if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  return `$${Math.round(value).toLocaleString()}`;
}

function buildEconomicContext(activeCenters) {
  const ranking = rankEconomicPower(ECONOMIC_POWER_DATA, parameters.selectedYear, parameters.conflictInterval);
  const blocs = buildInstitutionHierarchyAssignments(ranking.map((record) => record.name), activeCenters, true);
  return {
    ranking,
    blocs,
    independentOneShare: hierarchyEconomicShare(blocs, ranking, 0),
  };
}

function renderEconomicPower(context) {
  const conflict = conflictPowerState(parameters.selectedYear, parameters.conflictInterval);
  const measured = context.ranking.filter((record) => record.basePowerUsd !== null).length;
  elements.economicPowerSummary.textContent = `${measured} of ${context.ranking.length} institutions have measured GDP or revenue. The joint order is a heuristic: company revenue is gross sales and is already partly contained in national GDP.`;
  elements.conflictPowerState.textContent = conflict.eventCount === 0
    ? `No modeled conflict yet · first ${Math.round(ECONOMIC_POWER_ASSUMPTIONS.conflictShockFraction * 100)}% shock in ${formatNumber(calendarYear(parameters.conflictInterval))}`
    : `${formatNumber(conflict.eventCount)} conflicts · latest event ${conflict.latestEventAge.toFixed(1)} years ago · ${conflict.phase} · latest-event multiplier ${conflict.latestMultiplier.toFixed(3)}×`;

  const fragment = document.createDocumentFragment();
  context.ranking.slice(0, 15).forEach((record) => {
    const row = document.createElement("tr");
    const values = [
      record.rank,
      record.name,
      record.basis,
      `${formatEconomicValue(record.basePowerUsd)}${record.baseYear ? ` (${record.baseYear})` : ""}`,
      record.averageGrowthRate === null ? "Unavailable" : `${(record.modeledGrowthRate * 100).toFixed(2)}%`,
      `${(record.powerShare * 100).toFixed(2)}%`,
    ];
    values.forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    });
    fragment.append(row);
  });
  elements.economicPowerTableBody.replaceChildren(fragment);
}

function renderMetrics(activeCenters, adoption, coverage, structuralCoverage, emergenceYear, economicStructuralShare) {
  elements.activeAgents.textContent = formatNumber(activeCenters);
  elements.activeAgentsCaption.textContent = parameters.selectedYear === 0
    ? `${formatNumber(parameters.startAgents)} institutions remain independent`
    : `${formatNumber(parameters.startAgents - activeCenters + 1)} institutions in the Apex Institution network`;

  if (emergenceYear !== null) {
    elements.apexYear.textContent = `Year ${formatCalendarYear(emergenceYear)}`;
    elements.apexCaption.textContent = `structural unification + majority adoption in ${formatCalendarYear(emergenceYear)}`;
  } else {
    elements.apexYear.textContent = "No Apex Institution";
    elements.apexCaption.textContent = `dominance not reached by ${formatNumber(calendarYear(parameters.horizon))}`;
  }

  const live = liveReplicateStats();
  const horizonYear = formatNumber(calendarYear(parameters.horizon));
  if (live.targetFive.unconditionalMedian === null) {
    elements.targetFiveYear.textContent = "No median reach";
    elements.targetFiveCaption.textContent = `${(live.targetFive.reachProbability * 100).toFixed(1)}% of 200 seeded runs reach five by ${horizonYear}`;
  } else {
    elements.targetFiveYear.textContent = `Year ${formatNumber(live.targetFive.unconditionalMedianCalendarYear)}`;
    elements.targetFiveCaption.textContent = `median · ${(live.targetFive.reachProbability * 100).toFixed(1)}% of seeded runs reach five by ${horizonYear}`;
  }
  if (emergenceYear !== null) {
    elements.apexCaption.textContent = `seeded path · ${(live.apex.reachProbability * 100).toFixed(1)}% of runs reach Apex by ${horizonYear} · median ${live.apex.unconditionalMedianCalendarYear ?? "beyond horizon"}`;
  } else {
    elements.apexCaption.textContent = `not reached on seeded path · ${(live.apex.reachProbability * 100).toFixed(1)}% of runs reach Apex by ${horizonYear}`;
  }

  const adoptionDepth = structuralCoverage > 0 ? Math.min(1, coverage / structuralCoverage) : 0;
  const economicEffectiveInfluence = economicStructuralShare * adoptionDepth;
  const influencePercent = economicEffectiveInfluence * 100;
  elements.apexStructuralInfluence.textContent = `${influencePercent.toFixed(influencePercent < 1 ? 2 : 1)}%`;
  elements.apexStructuralInfluenceCaption.textContent = `${(economicStructuralShare * 100).toFixed(1)}% economic power · ${(adoptionDepth * 100).toFixed(0)}% internally adopted`;

  elements.adoptionValue.textContent = `${(adoption * 100).toFixed(adoption < 0.1 ? 1 : 0)}%`;
  const ninety = timeToAdoption(0.9, parameters.spreadRate, parameters.startAgents);
  elements.adoptionCaption.textContent = `90% architecture adoption by ${formatCalendarYear(ninety)}`;
}
function renderEconomics(activeCenters) {
  const adjusted = simulation.cycleAdjustments;
  const percent = (value) => `${(value * 100).toFixed(1)}%`;
  const delta = (effective, base) => {
    const points = (effective - base) * 100;
    const sign = points > 0 ? "+" : "";
    return `base ${percent(base)} · ${sign}${points.toFixed(1)} pts`;
  };

  elements.effectiveConsolidation.textContent = percent(adjusted.effectiveInstitutionEventProbability);
  elements.effectiveConsolidationChange.textContent = delta(adjusted.effectiveInstitutionEventProbability, parameters.institutionEventProbability);
  elements.effectiveQualifyingShare.textContent = percent(adjusted.effectiveQualifyingShare);
  elements.effectiveQualifyingChange.textContent = delta(adjusted.effectiveQualifyingShare, parameters.qualifyingShare);
  elements.effectiveInternalConflict.textContent = percent(adjusted.effectiveInternalConflict);
  elements.effectiveInternalChange.textContent = delta(adjusted.effectiveInternalConflict, parameters.internalConflict);
  const acceleration = consolidationAccelerationState(
    parameters,
    parameters.selectedYear,
    activeCenters,
    adjusted.effectiveInstitutionEventProbability,
  );
  elements.accelerationMultiplier.textContent = `${acceleration.multiplier.toFixed(2)}×`;
  elements.acceleratedLoss.textContent = `wave loss assumption ${(acceleration.acceleratedInstitutionEventProbability * 100).toFixed(1)}% · tempo only · max 5×`;
}

function renderChart(activeAgents, adoption) {
  const width = 900;
  const height = 340;
  const margin = { top: 24, right: 58, bottom: 46, left: 62 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const x = (year) => margin.left + (year / parameters.horizon) * innerWidth;
  const yAgents = (agents) => margin.top + (1 - ((agents - 1) / (parameters.startAgents - 1))) * innerHeight;
  const yAdoption = (share) => margin.top + (1 - share) * innerHeight;
  const series = buildTimelineSeries(simulation, 180);

  const grid = Array.from({ length: 5 }, (_, index) => {
    const ratio = index / 4;
    const y = margin.top + ratio * innerHeight;
    const agentLabel = Math.round(parameters.startAgents * (1 - ratio));
    const adoptionLabel = Math.round((1 - ratio) * 100);
    return `
      <line class="chart-grid" x1="${margin.left}" y1="${y}" x2="${width - margin.right}" y2="${y}"></line>
      <text class="chart-axis" x="${margin.left - 12}" y="${y + 4}" text-anchor="end">${agentLabel}</text>
      <text class="chart-axis" x="${width - margin.right + 12}" y="${y + 4}">${adoptionLabel}%</text>`;
  }).join("");

  const xLabels = Array.from({ length: 5 }, (_, index) => {
    const year = (parameters.horizon * index) / 4;
    return `<text class="chart-axis" x="${x(year)}" y="${height - 16}" text-anchor="middle">${formatNumber(calendarYear(year))}</text>`;
  }).join("");

  const agentPath = series.map((point, index) => `${index ? "L" : "M"}${x(point.year).toFixed(2)},${yAgents(point.agents).toFixed(2)}`).join(" ");
  const adoptionPath = series.map((point, index) => `${index ? "L" : "M"}${x(point.year).toFixed(2)},${yAdoption(point.adoption).toFixed(2)}`).join(" ");
  const apexPath = series.map((point, index) => `${index ? "L" : "M"}${x(point.year).toFixed(2)},${yAdoption(point.apexAdoption).toFixed(2)}`).join(" ");
  const selectionX = x(parameters.selectedYear);
  const thresholdY = yAdoption(0.5);

  elements.chart.innerHTML = `
    <title id="chart-title">Independent power centers and AI adoption timeline</title>
    <desc id="chart-description">In calendar year ${formatNumber(calendarYear(parameters.selectedYear))}, ${formatNumber(activeAgents)} independent power centers remain and shared AI architecture adoption is ${(adoption * 100).toFixed(1)} percent.</desc>
    ${grid}
    ${xLabels}
    <line class="chart-apex-threshold" x1="${margin.left}" y1="${thresholdY}" x2="${width - margin.right}" y2="${thresholdY}"></line>
    <text class="chart-axis chart-apex-label" x="${margin.left + 6}" y="${thresholdY - 6}">APEX &gt;50%</text>
    <path class="chart-agents" d="${agentPath}"></path>
    <path class="chart-apex" d="${apexPath}"></path>
    <path class="chart-adoption" d="${adoptionPath}"></path>
    <line class="chart-selection" x1="${selectionX}" y1="${margin.top}" x2="${selectionX}" y2="${margin.top + innerHeight}"></line>
    <circle class="chart-dot--agents" cx="${selectionX}" cy="${yAgents(activeAgents)}" r="5"></circle>
    <circle class="chart-dot--adoption" cx="${selectionX}" cy="${yAdoption(adoption)}" r="5"></circle>
    <text class="chart-axis" x="${margin.left}" y="12">INDEPENDENT CENTERS</text>
    <text class="chart-axis" x="${width - margin.right}" y="12" text-anchor="end">ARCHITECTURE ADOPTION</text>`;
}

const worldMapShapes = [];

function renderWorldMap(activeAgents, economicContext) {
  if (!elements.worldMap) return;
  const SVGNS = "http://www.w3.org/2000/svg";
  const { blocs } = economicContext;

  // Map every country to its bloc and whether that bloc is the leading/apex one.
  const countryToBloc = new Map();
  blocs.forEach((bloc, index) => {
    bloc.members.forEach((member) => countryToBloc.set(member, { bloc, index }));
  });

  if (worldMapShapes.length === 0) {
    const frag = document.createDocumentFragment();
    const land = document.createElementNS(SVGNS, "g");
    const markers = document.createElementNS(SVGNS, "g");
    for (const feature of WORLD_BOUNDARIES) {
      const path = document.createElementNS(SVGNS, "path");
      path.setAttribute("d", feature.path);
      path.setAttribute("fill-rule", "evenodd");
      path.setAttribute("class", "world-map__country");
      const title = document.createElementNS(SVGNS, "title");
      path.append(title);
      land.append(path);
      const shapes = [path];
      if (feature.name && feature.marker) {
        const [lng, lat] = COUNTRY_COORDINATES[feature.name];
        const marker = document.createElementNS(SVGNS, "circle");
        marker.setAttribute("cx", lng + 180);
        marker.setAttribute("cy", 90 - lat);
        marker.setAttribute("r", "0.65");
        marker.setAttribute("class", "world-map__country world-map__microstate");
        const markerTitle = document.createElementNS(SVGNS, "title");
        marker.append(markerTitle);
        markers.append(marker);
        shapes.push(marker);
      }
      worldMapShapes.push({ feature, shapes });
    }

    for (let lng = -150; lng <= 150; lng += 30) {
      const line = document.createElementNS(SVGNS, "line");
      const x = lng + 180;
      line.setAttribute("x1", x); line.setAttribute("y1", 0);
      line.setAttribute("x2", x); line.setAttribute("y2", 180);
      line.setAttribute("class", "world-map__grid");
      frag.append(line);
    }
    for (let lat = -60; lat <= 60; lat += 30) {
      const line = document.createElementNS(SVGNS, "line");
      const y = 90 - lat;
      line.setAttribute("x1", 0); line.setAttribute("y1", y);
      line.setAttribute("x2", 360); line.setAttribute("y2", y);
      line.setAttribute("class", "world-map__grid");
      frag.append(line);
    }

    frag.append(land, markers);
    elements.worldMap.append(frag);
  }

  for (const { feature, shapes } of worldMapShapes) {
    const assignment = countryToBloc.get(feature.name);
    const isLeading = assignment && assignment.bloc.role !== "independent";
    const color = assignment
      ? (isLeading ? "hsl(43 78% 62%)" : blocColor(assignment.index, blocs.length))
      : "hsl(200 12% 40%)";
    const hierarchy = assignment
      ? (assignment.bloc.role === "apex" ? "Apex Institution"
        : assignment.bloc.role === "leading" ? "Independent 1"
        : `Independent center ${assignment.bloc.id}`)
      : (feature.name ? "outside selected baseline" : "geographic context; not a modeled institution");
    for (const shape of shapes) {
      shape.setAttribute("fill", color);
      shape.querySelector("title").textContent = `${feature.name ?? feature.label} — ${hierarchy}`;
    }
  }

  if (elements.worldMapYear) elements.worldMapYear.textContent = formatNumber(calendarYear(parameters.selectedYear));
  if (elements.worldMapCenters) elements.worldMapCenters.textContent = formatNumber(activeAgents);
  if (elements.worldMapSlider) {
    elements.worldMapSlider.max = parameters.horizon;
    elements.worldMapSlider.value = parameters.selectedYear;
    elements.worldMapSlider.setAttribute("aria-valuetext", String(calendarYear(parameters.selectedYear)));
    setRangeFill(elements.worldMapSlider);
  }
}

function renderConstellation(activeAgents, economicContext) {
  const { ranking, blocs } = economicContext;
  const countryToBloc = new Map();
  blocs.forEach((bloc, index) => {
    bloc.members.forEach((country) => countryToBloc.set(country, { bloc, index }));
  });

  const leadingInstitution = blocs[0];
  elements.constellationTitle.textContent = activeAgents === 1
    ? `Apex Institution: ${formatNumber(leadingInstitution.members.length)} constituent institutions`
    : `Independent 1: ${formatNumber(leadingInstitution.members.length)} / ${formatNumber(ENTITIES.length)} constituents`;
  elements.constellationCaption.textContent = activeAgents === 1
    ? `One independent power center remains. All ${formatNumber(COUNTRIES.length)} countries and ${formatNumber(TECH_COMPANIES.length)} corporations persist as machine-curated constituent institutions.`
    : `${formatNumber(activeAgents)} independent power centers remain. All ${formatNumber(COUNTRIES.length)} countries and ${formatNumber(TECH_COMPANIES.length)} corporations persist as named institutions.`;

  const fragment = document.createDocumentFragment();
  ranking.forEach((powerRecord) => {
    const entity = ENTITY_BY_NAME.get(powerRecord.name);
    const { bloc, index } = countryToBloc.get(entity.name);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `country-node entity-node--${entity.type}${bloc.role !== "independent" ? " is-apex-member" : ""}`;
    if (selectedEntityName === entity.name) button.classList.add("is-selected");
    button.style.setProperty("--bloc-color", bloc.role !== "independent" ? "hsl(43 78% 62%)" : blocColor(index, blocs.length));
    const entityType = entity.type === "company" ? "technology corporation" : "country-level agent";
    const basis = powerRecord.basePowerUsd === null
      ? "economic power unavailable"
      : `${formatEconomicValue(powerRecord.basePowerUsd)} ${powerRecord.basis.toLowerCase()} · ${(powerRecord.modeledGrowthRate * 100).toFixed(2)}% growth`;
    const hierarchy = bloc.role === "apex" ? "Apex Institution" : bloc.role === "leading" ? "Independent 1" : `Independent center ${bloc.id}`;
    button.title = `#${powerRecord.rank} ${entity.name} — ${entityType} · ${basis} · ${(powerRecord.powerShare * 100).toFixed(2)}% modeled power — ${hierarchy} (${bloc.members.length} members)`;
    button.setAttribute("aria-label", button.title);
    button.textContent = initials(entity.name);
    button.addEventListener("click", () => {
      selectedEntityName = entity.name;
      renderConstellation(activeAgents, economicContext);
    });
    fragment.append(button);
  });
  elements.countryGrid.replaceChildren(fragment);

  if (selectedEntityName) {
    const selected = countryToBloc.get(selectedEntityName);
    const entity = ENTITY_BY_NAME.get(selectedEntityName);
    const selectedPower = ranking.find((record) => record.name === selectedEntityName);
    elements.selectedCountry.replaceChildren();
    const label = document.createElement("span");
    const hierarchy = selected.bloc.role === "apex" ? "Apex Institution" : selected.bloc.role === "leading" ? "Independent 1" : `Independent center ${selected.bloc.id}`;
    label.textContent = `${entity.type === "company" ? "Technology corporation" : "Country-level agent"} · ${hierarchy}`;
    const value = document.createElement("strong");
    value.textContent = `#${selectedPower.rank} · ${entity.name} · ${formatEconomicValue(selectedPower.basePowerUsd)} ${selectedPower.basis}`;
    const detail = document.createElement("span");
    detail.textContent = selectedPower.basePowerUsd === null
      ? "GDP unavailable in cached WDI panel"
      : `${(selectedPower.powerShare * 100).toFixed(2)}% modeled economic power · ${(selectedPower.modeledGrowthRate * 100).toFixed(2)}% average growth · ${selectedPower.growthMethod}`;
    elements.selectedCountry.append(label, value, detail);
  }

  elements.blocSummaries.replaceChildren();
  const visible = blocs.slice(0, 12);
  for (const [index, bloc] of visible.entries()) {
    const card = document.createElement("article");
    card.className = "bloc-card";
    card.style.setProperty("--bloc-color", bloc.role !== "independent" ? "hsl(43 78% 62%)" : blocColor(index, blocs.length));

    const title = document.createElement("div");
    title.className = "bloc-card__title";
    const name = document.createElement("span");
    name.textContent = bloc.role === "apex" ? "Apex Institution" : bloc.role === "leading" ? "Independent 1" : `Independent ${bloc.id}`;
    const count = document.createElement("span");
    const blocPowerShare = hierarchyEconomicShare(blocs, ranking, index);
    count.textContent = `${bloc.members.length} · ${(blocPowerShare * 100).toFixed(1)}%`;
    const swatch = document.createElement("i");
    swatch.className = "bloc-swatch";
    title.append(swatch, name, count);

    const members = document.createElement("p");
    const preview = bloc.members.slice(0, 4).join(", ");
    members.textContent = bloc.members.length > 4 ? `${preview} +${bloc.members.length - 4} more` : preview;
    card.append(title, members);
    elements.blocSummaries.append(card);
  }

  if (blocs.length > visible.length) {
    const overflow = document.createElement("p");
    overflow.className = "bloc-overflow";
    overflow.textContent = `${formatNumber(blocs.length - visible.length)} additional blocs hidden from summary; all remain visible above as country nodes.`;
    elements.blocSummaries.append(overflow);
  }
}

function renderInterpretation(activeCenters, adoption, coverage, structuralCoverage, emergenceYear) {
  if (emergenceYear !== null) {
    elements.interpretationTitle.textContent = "Apex power has consolidated and calcified";
    elements.interpretationText.textContent = `The leading hierarchy completes structural consolidation and exceeds 50% effective internal adoption in calendar year ${formatCalendarYear(emergenceYear)}. At the selected year it contains ${formatNumber(parameters.startAgents)} persistent constituent institutions, has ${(coverage * 100).toFixed(1)}% effective standard adoption across the full field, and leaves one independent power center. While its coordinating systems remain operational, the model makes this an absorbing state: later institutions are curated subordinates, not independent rivals. The model locks this state in for as long as its coordinating systems operate.`;
    return;
  }

  if (simulation.outcome === "event-limit") {
    elements.interpretationTitle.textContent = "Calculation stopped at the event safety limit";
    elements.interpretationText.textContent = `This extreme parameter combination generated ${formatNumber(simulation.events)} waves before the horizon. States after calendar year ${formatCalendarYear(simulation.points.at(-1).year)} are unknown and are excluded from terminal summaries.`;
    return;
  }

  if (simulation.outcome === "no-events") {
    elements.interpretationTitle.textContent = "No Apex Institution-forming consolidation cycles";
    elements.interpretationText.textContent = "The qualifying-conflict share is zero. Consolidation stops. Institutions still adopt compatible AI architecture, but no hierarchy absorbs their independent authority.";
    return;
  }

  elements.interpretationTitle.textContent = "Apex Institution dominance lies beyond the horizon";
  elements.interpretationText.textContent = `By ${formatNumber(calendarYear(parameters.horizon))}, the leading hierarchy reaches ${(coverage * 100).toFixed(1)}% effective coverage and fails to cross majority control. Consolidation pressure is too weak or fracture is too strong. Once Apex control forms, the model prevents erosion while its systems operate.`;
}
function createSourceLink(source) {
  const link = document.createElement("a");
  link.href = source.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = `${source.label} ↗`;
  return link;
}

function formatDefaultValue(value) {
  if (typeof value === "number" && value >= 0 && value <= 1) return `${value * 100}%`;
  return Number(value).toLocaleString();
}

function createDefaultEvidence(key) {
  const defaultId = REFERENCE_TO_DEFAULT[key];
  if (!defaultId) return null;
  const item = DEFAULT_BY_ID.get(defaultId);
  const block = document.createElement("span");
  block.className = "reference__default";
  const heading = document.createElement("b");
  heading.textContent = `Default ${formatDefaultValue(item.default)} · Tier ${item.tier} · ${item.confidence}`;
  const rationale = document.createElement("span");
  rationale.textContent = item.rationale;
  const derivation = document.createElement("small");
  derivation.textContent = `Basis: ${item.derivation}`;
  const bibliographyLink = document.createElement("a");
  bibliographyLink.href = `#bib-topic-${key}`;
  bibliographyLink.className = "reference__bibliography-link";
  bibliographyLink.textContent = "Open bibliography sources & rationale ↓";
  block.append(heading, rationale, derivation, bibliographyLink);
  return block;
}

function createReferenceMarker(key) {
  const reference = REFERENCES[key];
  if (!reference) throw new Error(`Unknown reference key: ${key}`);

  const wrapper = document.createElement("span");
  wrapper.className = "reference";

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "reference__trigger";
  trigger.textContent = "i";
  trigger.setAttribute("aria-label", `References for ${reference.title}`);
  trigger.addEventListener("click", (event) => event.preventDefault());

  const popover = document.createElement("span");
  popover.className = "reference__popover";
  popover.setAttribute("role", "tooltip");

  const kind = document.createElement("span");
  kind.className = "reference__kind";
  kind.textContent = reference.kind;
  const title = document.createElement("strong");
  title.textContent = reference.title;
  const summary = document.createElement("span");
  summary.className = "reference__summary";
  summary.textContent = reference.summary;
  const links = document.createElement("span");
  links.className = "reference__links";
  reference.sources.forEach((source) => links.append(createSourceLink(source)));

  const defaultEvidence = createDefaultEvidence(key);
  popover.append(kind, title, summary);
  if (defaultEvidence) popover.append(defaultEvidence);
  popover.append(links);
  wrapper.append(trigger, popover);
  return wrapper;
}

function revealArticleTarget(hash) {
  const target = document.getElementById(hash.slice(1));
  for (let node = target; node; node = node.parentElement) {
    if (node instanceof HTMLDetailsElement) node.open = true;
  }
}

function hydrateInlineReferences() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    revealArticleTarget(link.hash);
  }, { capture: true });
  window.addEventListener("hashchange", () => revealArticleTarget(location.hash));
  document.querySelectorAll("[data-reference]").forEach((target) => {
    const key = target.dataset.reference;
    target.append(createReferenceMarker(key));
    const control = target.closest("label.control");
    if (control && REFERENCE_TO_DEFAULT[key] && !control.querySelector(".control__sources")) {
      const link = document.createElement("a");
      link.className = "control__sources";
      link.href = `#bib-topic-${key}`;
      link.textContent = "Sources & default rationale ↓";
      link.addEventListener("click", (event) => event.stopPropagation());
      control.append(link);
    }
  });
}

function renderArticleSummary() {
  const anchors = new Map(TARGET_FIVE_ANALYSIS.anchors.map((item) => [item.name, item]));
  const horizonYear = String(TARGET_FIVE_ANALYSIS.metadata.horizonCalendarYear);
  const percent = (value) => `${(value * 100).toFixed(value > 0 && value < 0.01 ? 2 : 1)}%`;
  const yearOrAfter = (year) => year ?? `After ${horizonYear}`;
  const PROBABILITY_KEYS = [["p25", "25%"], ["p50", "50%"], ["p75", "75%"], ["p95", "95%"]];
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  // Featured: the authored core scenario.
  const expected = anchors.get("COW central");
  const ep = expected.parameters;
  const expectedYears = expected.apexProbabilityCalendarYears ?? {};
  const feature = document.createDocumentFragment();
  const header = make("div", "article-expected__header");
  header.append(
    make("p", "eyebrow", "Core scenario · authored assumptions"),
    make("h3", null, `Middle 50% of runs reach Apex coordination between ${yearOrAfter(expectedYears.p25)} and ${yearOrAfter(expectedYears.p75)}`),
    make("p", "article-expected__lede", `Within ${formatNumber(expected.replicates)} seeded model runs, half reach Apex coordination by ${yearOrAfter(expectedYears.p50)}. These are conditional run shares, not real-world odds. None reach it by 2126; five independent Institutions remain at a median of ${yearOrAfter(expected.targetCalendarYear)}.`),
  );
  const strip = make("ol", "article-expected__strip");
  strip.setAttribute("aria-label", "Calendar year by which each share of runs reaches Apex coordination");
  PROBABILITY_KEYS.forEach(([key, share]) => {
    const step = make("li", key === "p50" ? "article-expected__step article-expected__step--median" : "article-expected__step");
    step.append(make("span", null, `${share} of runs`), make("strong", null, String(yearOrAfter(expectedYears[key]))));
    strip.append(step);
  });
  const facts = make("dl", "article-expected__facts");
  [
    ["Five Institutions remain (median)", yearOrAfter(expected.targetCalendarYear)],
    ["Five-center 90% range", `${yearOrAfter(expected.targetFiveP05CalendarYear)}–${yearOrAfter(expected.targetFiveP95CalendarYear)}`],
    ["Run share reaching Apex by 2126", percent(expected.apexNearProbability)],
    [`Run share reaching Apex by ${horizonYear}`, percent(expected.apexProbability)],
  ].forEach(([term, value]) => facts.append(make("dt", null, term), make("dd", null, String(value))));
  const assumptions = make("ul", "article-expected__assumptions");
  [
    `${Math.round(ep.institutionEventProbability * 100)}% mean loss per wave; wave severity varies with beta-binomial concentration 14`,
    ...(ep.currentWaveInProgress ? ["An authored current-wave scenario resolves exactly in 2029"] : []),
    `Later waves sample normalized 6/36/124-year clustered gaps with a ${expected.waveIntervalYears.toFixed(1)}-year mean`,
    `${Math.round(ep.internalConflict * 100)}% mean internal fracture per wave; zero external fragments`,
    `${Math.round(ep.consolidationAcceleration * 100)}% AI acceleration of wave tempo only (5× cap)`,
    `${Math.round(ep.institutionalAdoptionRate * 100)}% annual standard adoption inside the Apex`,
    `${ep.startAgents} starting Institutions; the field reaches one only when a stochastic transition removes the final rival`,
    "Apex authority is permanent while operational; independent post-Apex births are zero",
  ].forEach((text) => assumptions.append(make("li", null, text)));
  const assumptionsBlock = make("div", "article-expected__assumptions-block");
  assumptionsBlock.append(make("h4", null, "Assumptions"), assumptions);
  const body = make("div", "article-expected__body");
  body.append(facts, assumptionsBlock);
  feature.append(header, strip, body);
  elements.articleExpected.replaceChildren(feature);

  // Secondary: alternative scenarios, compared against the core scenario's 50% year.
  const secondaryItems = [
    ["Durable COW mean loss", anchors.get("Durable COW mean loss"), "11.2% historical durable mean instead of the 15% core"],
    ["Historical-only frequency; no current wave", anchors.get("Historical-only frequency; no current wave"), "No assumed 2026 wave; three observed durable waves imply 69.4-year mean spacing"],
    ["COW without AI acceleration", anchors.get("COW central without acceleration"), "Core scenario with acceleration off"],
    ["COW without internal conflict", anchors.get("COW central without internal conflict"), "Core scenario with fracture removed"],
    ["Italian-consolidation wave", anchors.get("Italian consolidation"), "11.1% loss per wave"],
    ["German-consolidation wave", anchors.get("German consolidation"), "22.0% loss per wave"],
    ["Wartime gross-exit wave", anchors.get("Wartime gross exit"), "27.3% loss, most severe COW wave"],
    ["Aircraft midpoint", anchors.get("Aircraft midpoint · secondary"), "Corporate analogue; not sovereign calibration"],
    ["Post-Cold-War low-loss regime", anchors.get("Post-Cold-War"), "3.1% loss per wave"],
    ["Fast high-intensity preset", TARGET_FIVE_ANALYSIS.boundaries.fastest, "Maximum-intensity stress test"],
  ].filter(([, item]) => item);
  const table = make("table", "article-scenarios");
  const caption = make("caption", null, "Calendar year by which each share of runs reaches Apex coordination. Δ compares the 50% year with the core scenario.");
  const head = make("thead"); const headRow = make("tr");
  ["Scenario", "Five remain (median)", ...PROBABILITY_KEYS.map(([, share]) => `${share} of runs`), "Δ at 50%"].forEach((text) => {
    const th = make("th", null, text); th.scope = "col"; headRow.append(th);
  });
  head.append(headRow);
  const bodyRows = make("tbody");
  const expectedMedian = expectedYears.p50;
  secondaryItems.forEach(([labelText, item, noteText]) => {
    const years = item.apexProbabilityCalendarYears ?? {};
    const row = make("tr");
    const th = make("th"); th.scope = "row";
    th.append(make("span", null, labelText), make("small", null, noteText));
    row.append(th, make("td", null, String(yearOrAfter(item.targetCalendarYear))));
    PROBABILITY_KEYS.forEach(([key]) => row.append(make("td", years[key] ? null : "is-after", String(yearOrAfter(years[key])))));
    const delta = years.p50 && expectedMedian ? years.p50 - expectedMedian : null;
    row.append(make("td", delta === null ? "is-after" : delta < 0 ? "is-earlier" : "is-later",
      delta === null ? "—" : `${delta > 0 ? "+" : "−"}${formatNumber(Math.abs(delta))} yr`));
    bodyRows.append(row);
  });
  table.append(caption, head, bodyRows);
  const wrapper = make("div", "article-scenarios__wrap"); wrapper.append(table);
  elements.articleTimelineGrid.replaceChildren(wrapper);

  const profile = MONTE_CARLO_RESULTS.profiles.find((item) => item.id === "cow_centered") ?? MONTE_CARLO_RESULTS.profiles[0];
  const uncertaintyItems = [
    [`${(profile.targetFive.reachProbability * 100).toFixed(1)}%`, `reach five by ${profile.targetFive.censoringCalendarYear}`],
    [`${(profile.dominance.reachProbability * 100).toFixed(1)}%`, `reach effective Apex coordination by ${profile.targetFive.censoringCalendarYear}`],
    [`Year ${profile.targetFive.conditionalCalendar.median}`, "median five-center year among runs that reach it"],
    [formatNumber(profile.institutionCounts[5000].median, 0), `median independent centers in ${profile.targetFive.censoringCalendarYear}`],
    ...[["p25", "25%"], ["p50", "50%"], ["p75", "75%"], ["p95", "95%"]].map(([key, share]) => {
      const elapsed = profile.dominance.probabilityYears?.[key];
      return [elapsed === null || elapsed === undefined ? `After ${profile.targetFive.censoringCalendarYear}` : `Year ${calendarYear(elapsed)}`, `${share} of runs reach Apex by this year`];
    }),
  ];
  const uncertainty = document.createDocumentFragment();
  uncertaintyItems.forEach(([valueText, labelText]) => {
    const card = document.createElement("article");
    const value = document.createElement("strong"); value.textContent = valueText;
    const label = document.createElement("span"); label.textContent = labelText;
    card.append(value, label); uncertainty.append(card);
  });
  elements.articleUncertaintyGrid.replaceChildren(uncertainty);
}

function renderModelInsights() {
  const baseline = MODEL_INSIGHTS.oneAtATime.baseline;
  const phaseRows = MODEL_INSIGHTS.consolidationFragmentationMap;
  const reached = phaseRows.filter((row) => row.reached).length;
  const top = MODEL_INSIGHTS.screening.slice(0, 4);
  const cards = [
    [baseline.dominanceYear === null ? `No reach by ${formatNumber(MODEL_INSIGHTS.metadata.horizonCalendarYear)}` : formatCalendarYear(baseline.dominanceYear), "baseline dominance calendar year"],
    [`${reached}/${phaseRows.length}`, "phase-map cells reach dominance"],
    [top[0].parameter, "strongest global screen"],
    [`${(top[0].reachChangeRate * 100).toFixed(1)}%`, "top perturbations changing reach"],
  ];
  const fragment = document.createDocumentFragment();
  cards.forEach(([value, label]) => {
    const card = document.createElement("div");
    const strong = document.createElement("strong"); strong.textContent = value;
    const span = document.createElement("span"); span.textContent = label;
    card.append(strong, span); fragment.append(card);
  });
  elements.insightCards.replaceChildren(fragment);

  const calibration = MODEL_INSIGHTS.waveCalibration;
  const options = [
    [calibration.roundedDefault.dominanceYear, "11% durable COW mean"],
    [calibration.germanConsolidation.dominanceYear, "22.0% German-consolidation wave"],
    [calibration.wartimeInterruption.dominanceYear, "27.3% wartime gross-exit wave"],
    [calibration.aircraftSecondary.midpoint.dominanceYear, "52.4% aircraft midpoint · secondary"],
  ];
  const granularityFragment = document.createDocumentFragment();
  options.forEach(([value, label]) => {
    const item = document.createElement("div");
    const strong = document.createElement("strong"); strong.textContent = value === null ? `No reach by ${formatNumber(MODEL_INSIGHTS.metadata.horizonCalendarYear)}` : `Year ${formatCalendarYear(value)}`;
    const span = document.createElement("span"); span.textContent = label;
    item.append(strong, span); granularityFragment.append(item);
  });
  elements.granularityResults.replaceChildren(granularityFragment);

  elements.observabilityResults.replaceChildren();
  const heading = document.createElement("strong"); heading.textContent = `Verified observability · ${MODEL_INSIGHTS.observabilityCounterfactual.condition}`;
  const list = document.createElement("div");
  MODEL_INSIGHTS.observabilityCounterfactual.rows.forEach((item) => {
    const pill = document.createElement("span");
    pill.textContent = `${Math.round(item.observability * 100)}% → ${item.dominanceCalendarYear === null ? `no effective majority by ${formatNumber(MODEL_INSIGHTS.metadata.horizonCalendarYear)}` : item.dominanceCalendarYear}`;
    list.append(pill);
  });
  elements.observabilityResults.append(heading, list);
}

function renderChallengeAnalysis() {
  const gross = COW_WAVE_ROBUSTNESS.summary;
  const leaveOneOut = COW_WAVE_ROBUSTNESS.leaveOneOut.map((item) => item.leaveOneOutMean);
  const bestModel = COW_MODEL_COMPARISON.summary[0];
  const cards = [
    [SCENARIO_MATRIX.metadata.scenarioCount, "fixed challenge scenarios"],
    [`${(gross.grossMeanMinimum * 100).toFixed(1)}–${(gross.grossMeanMaximum * 100).toFixed(1)}%`, "gross definition envelope"],
    [`${(Math.min(...leaveOneOut) * 100).toFixed(1)}–${(Math.max(...leaveOneOut) * 100).toFixed(1)}%`, "leave-one-wave-out mean"],
    [bestModel.model.replaceAll("_", " "), "lowest rolling log loss"],
  ];
  const summary = document.createDocumentFragment();
  cards.forEach(([value, label]) => {
    const card = document.createElement("div");
    const strong = document.createElement("strong"); strong.textContent = value;
    const span = document.createElement("span"); span.textContent = label;
    card.append(strong, span); summary.append(card);
  });
  elements.challengeSummary.replaceChildren(summary);

  const targetAnchors = new Map(TARGET_FIVE_ANALYSIS.anchors.map((item) => [item.name, item]));
  const targetCards = [
    [TARGET_FIVE_ANALYSIS.boundaries.fastest.targetYear, "fast high-intensity preset"],
    [TARGET_FIVE_ANALYSIS.boundaries.longestBounded.targetYear, `longest within ${formatNumber(TARGET_FIVE_ANALYSIS.metadata.horizonCalendarYear)} horizon`],
    [targetAnchors.get("COW central").targetYear, "COW central"],
    [targetAnchors.get("COW central without internal conflict").targetYear, "COW without internal conflict"],
  ];
  const targetSummary = document.createDocumentFragment();
  targetCards.forEach(([year, label]) => {
    const card = document.createElement("div");
    const strong = document.createElement("strong"); strong.textContent = year === null ? `No reach by ${formatNumber(TARGET_FIVE_ANALYSIS.metadata.horizonCalendarYear)}` : `Year ${formatCalendarYear(year)}`;
    const span = document.createElement("span"); span.textContent = label;
    card.append(strong, span); targetSummary.append(card);
  });
  elements.targetFiveSummary.replaceChildren(targetSummary);
  const frequencyReached = TARGET_FIVE_ANALYSIS.interactions.frequency.filter((item) => item.reached).length;
  const severityReached = TARGET_FIVE_ANALYSIS.interactions.severityConflict.filter((item) => item.reached);
  const severityYears = severityReached.map((item) => item.targetYear);
  elements.targetFiveInteractionSummary.textContent = `Frequency-only grid: ${frequencyReached}/${TARGET_FIVE_ANALYSIS.interactions.frequency.length} cases reach five at the 15%/5% core baseline. Severity × internal-conflict grid: ${severityReached.length}/${TARGET_FIVE_ANALYSIS.interactions.severityConflict.length} reach, spanning calendar years ${formatCalendarYear(Math.min(...severityYears))}–${formatCalendarYear(Math.max(...severityYears))}.`;

  const targetSensitivity = document.createDocumentFragment();
  TARGET_FIVE_ANALYSIS.oneAtATimeSummary.forEach((item) => {
    const row = document.createElement("tr");
    [item.parameter, `${item.reachedValues}/${item.testedValues}`, item.fastestCalendarYear === null ? `No reach by ${TARGET_FIVE_ANALYSIS.metadata.horizonCalendarYear}` : item.fastestCalendarYear, item.slowestReachedCalendarYear === null ? `No reach by ${TARGET_FIVE_ANALYSIS.metadata.horizonCalendarYear}` : item.slowestReachedCalendarYear].forEach((value) => {
      const cell = document.createElement("td"); cell.textContent = value; row.append(cell);
    });
    targetSensitivity.append(row);
  });
  elements.targetFiveSensitivityTableBody.replaceChildren(targetSensitivity);

  const scenarioRows = document.createDocumentFragment();
  SCENARIO_MATRIX.scenarios.forEach((scenario) => {
    const row = document.createElement("tr");
    const values = [
      scenario.name,
      `${(scenario.effectiveInstitutionEventProbability * 100).toFixed(1)}%`,
      scenario.waveIntervalYears.toFixed(1),
      scenario.topLevelInstitutionsAtHorizon,
      scenario.dominanceCalendarYear === null ? `No reach by ${SCENARIO_MATRIX.metadata.horizonCalendarYear}` : scenario.dominanceCalendarYear,
    ];
    values.forEach((value) => { const cell = document.createElement("td"); cell.textContent = value; row.append(cell); });
    scenarioRows.append(row);
  });
  elements.challengeScenarioTableBody.replaceChildren(scenarioRows);

  const robustnessRows = document.createDocumentFragment();
  COW_WAVE_ROBUSTNESS.leaveOneOut.forEach((item) => {
    const row = document.createElement("tr");
    [`${item.omittedStart.slice(0, 4)}–${item.omittedEnd.slice(0, 4)}`, `${(item.omittedLossProbability * 100).toFixed(1)}%`, `${(item.leaveOneOutMean * 100).toFixed(1)}%`].forEach((value) => {
      const cell = document.createElement("td"); cell.textContent = value; row.append(cell);
    });
    robustnessRows.append(row);
  });
  elements.robustnessTableBody.replaceChildren(robustnessRows);

  const comparisonRows = document.createDocumentFragment();
  COW_MODEL_COMPARISON.summary.forEach((item) => {
    const row = document.createElement("tr");
    [item.model.replaceAll("_", " "), item.predictedExits.toFixed(1), item.observedExits, item.brier.toFixed(6), item.logLoss.toFixed(6)].forEach((value) => {
      const cell = document.createElement("td"); cell.textContent = value; row.append(cell);
    });
    comparisonRows.append(row);
  });
  elements.comparisonTableBody.replaceChildren(comparisonRows);
}

function formatMonteCarloInput(variable, value) {
  if (variable === "conflictInterval") return `${formatNumber(value, 1)}y`;
  if (variable === "fragmentationPerEvent") return formatNumber(value, 1);
  return `${(value * 100).toFixed(1)}%`;
}

function renderMonteCarlo(profileId = MONTE_CARLO_RESULTS.profiles[0].id) {
  const profile = MONTE_CARLO_RESULTS.profiles.find((item) => item.id === profileId) ?? MONTE_CARLO_RESULTS.profiles[0];
  if (!elements.monteCarloProfile.options.length) {
    MONTE_CARLO_RESULTS.profiles.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id; option.textContent = item.name;
      elements.monteCarloProfile.append(option);
    });
  }
  elements.monteCarloProfile.value = profile.id;
  elements.monteCarloDescription.textContent = `${profile.description} Seed ${profile.seed}; ${profile.runs.toLocaleString()} runs; ${MONTE_CARLO_RESULTS.metadata.parameterCorrelation} parameters.`;

  const stats = [
    [profile.runs.toLocaleString(), "sampled parameter sets"],
    [`${(profile.targetFive.reachProbability * 100).toFixed(1)}%`, `reach five by ${formatNumber(profile.targetFive.censoringCalendarYear)}`],
    [profile.targetFive.conditionalCalendar ? `Year ${formatNumber(profile.targetFive.conditionalCalendar.median)}` : `No reach by ${formatNumber(profile.targetFive.censoringCalendarYear)}`, "conditional median T5 calendar year"],
    [`${(profile.targetFive.noReachProbability * 100).toFixed(1)}%`, `right-censored at ${formatNumber(profile.targetFive.censoringCalendarYear)}`],
    [`${(profile.structural.reachProbability * 100).toFixed(1)}%`, `structural Apex by ${formatNumber(profile.targetFive.censoringCalendarYear)}`],
    [formatNumber(profile.institutionCounts[5000].median, 1), `median Institutions in ${formatNumber(profile.targetFive.censoringCalendarYear)}`],
  ];
  const statsFragment = document.createDocumentFragment();
  stats.forEach(([value, label]) => {
    const card = document.createElement("div");
    const strong = document.createElement("strong"); strong.textContent = value;
    const span = document.createElement("span"); span.textContent = label;
    card.append(strong, span); statsFragment.append(card);
  });
  elements.monteCarloStats.replaceChildren(statsFragment);

  const maxBin = Math.max(...profile.targetFive.histogram.map((bin) => bin.count), 1);
  const histogram = document.createDocumentFragment();
  profile.targetFive.histogram.forEach((bin, index) => {
    const bar = document.createElement("div");
    bar.className = "monte-carlo-bar";
    bar.style.setProperty("--height", `${(bin.count / maxBin) * 100}%`);
    bar.title = `${calendarYear(bin.lower).toLocaleString()}–${calendarYear(bin.upper).toLocaleString()}: ${bin.count.toLocaleString()} reached runs`;
    const fill = document.createElement("i");
    const label = document.createElement("span");
    label.textContent = index % 4 === 0 ? formatNumber(calendarYear(bin.upper)) : "";
    bar.append(fill, label); histogram.append(bar);
  });
  elements.monteCarloHistogram.replaceChildren(histogram);

  const survival = document.createDocumentFragment();
  profile.targetFive.survival.filter((item) => item.year % 1000 === 0).forEach((item) => {
    const row = document.createElement("div");
    const year = document.createElement("span"); year.textContent = formatNumber(calendarYear(item.year));
    const meter = document.createElement("i"); meter.style.setProperty("--survival", `${item.probabilityAboveTarget * 100}%`);
    const value = document.createElement("b"); value.textContent = `${(item.probabilityAboveTarget * 100).toFixed(1)}%`;
    row.append(year, meter, value); survival.append(row);
  });
  elements.monteCarloSurvival.replaceChildren(survival);

  const inputRows = document.createDocumentFragment();
  Object.entries(profile.distributions).forEach(([variable, distribution]) => {
    const summary = profile.inputSummary[variable];
    const row = document.createElement("tr");
    [variable, distribution.type, formatMonteCarloInput(variable, summary.p05), formatMonteCarloInput(variable, summary.median), formatMonteCarloInput(variable, summary.p95), distribution.evidence].forEach((value) => {
      const cell = document.createElement("td"); cell.textContent = value; row.append(cell);
    });
    inputRows.append(row);
  });
  elements.monteCarloInputsTableBody.replaceChildren(inputRows);

  const sensitivityRows = document.createDocumentFragment();
  profile.sensitivity.slice(0, 8).forEach((item) => {
    const row = document.createElement("tr");
    [item.variable, `${item.spearmanCappedTargetFive >= 0 ? "+" : ""}${item.spearmanCappedTargetFive.toFixed(3)}`, `${item.spearmanTargetFiveReach >= 0 ? "+" : ""}${item.spearmanTargetFiveReach.toFixed(3)}`].forEach((value) => {
      const cell = document.createElement("td"); cell.textContent = value; row.append(cell);
    });
    sensitivityRows.append(row);
  });
  elements.monteCarloSensitivityTableBody.replaceChildren(sensitivityRows);

  const terminal = document.createDocumentFragment();
  profile.terminalBands.forEach((item) => {
    const pill = document.createElement("span");
    pill.textContent = `${item.band.replaceAll("_", " ")}: ${(item.probability * 100).toFixed(1)}%`;
    terminal.append(pill);
  });
  elements.monteCarloTerminalBands.replaceChildren(terminal);

  const convergenceRows = document.createDocumentFragment();
  profile.convergence.forEach((item) => {
    const row = document.createElement("tr");
    [item.runs.toLocaleString(), `${(item.targetFiveReachProbability * 100).toFixed(1)}%`, item.targetFiveConditionalMedian === null ? `No reach by ${formatNumber(profile.targetFive.censoringCalendarYear)}` : formatNumber(calendarYear(item.targetFiveConditionalMedian)), formatNumber(calendarYear(item.targetFiveRestrictedMean))].forEach((value) => {
      const cell = document.createElement("td"); cell.textContent = value; row.append(cell);
    });
    convergenceRows.append(row);
  });
  elements.monteCarloConvergenceTableBody.replaceChildren(convergenceRows);
}

function renderEmpiricalResults() {
  const percent = (value, digits = 2) => `${(value * 100).toFixed(digits)}%`;
  const bootstrap = EMPIRICAL_RESULTS.bootstrap;
  const stats = [
    [EMPIRICAL_RESULTS.spells, "membership spells"],
    [EMPIRICAL_RESULTS.observedExits, "observed exits"],
    [EMPIRICAL_RESULTS.rightCensored, "right-censored"],
    [percent(EMPIRICAL_RESULTS.annualExitHazard, 3), "crude annual exit hazard"],
    [`${percent(bootstrap.lower95, 3)}–${percent(bootstrap.upper95, 3)}`, "bootstrap 95% interval"],
  ];
  const statsFragment = document.createDocumentFragment();
  stats.forEach(([value, label]) => {
    const card = document.createElement("div");
    const strong = document.createElement("strong");
    strong.textContent = value;
    const span = document.createElement("span");
    span.textContent = label;
    card.append(strong, span);
    statsFragment.append(card);
  });
  elements.empiricalStats.replaceChildren(statsFragment);

  const kmFragment = document.createDocumentFragment();
  EMPIRICAL_RESULTS.kaplanMeier.forEach((item) => {
    const row = document.createElement("div");
    const label = document.createElement("span");
    label.textContent = `${item.years} years`;
    const meter = document.createElement("i");
    meter.style.setProperty("--survival", `${item.survival * 100}%`);
    const value = document.createElement("b");
    value.textContent = percent(item.survival, 1);
    row.append(label, meter, value);
    kmFragment.append(row);
  });
  elements.kmResults.replaceChildren(kmFragment);

  const backtestFragment = document.createDocumentFragment();
  EMPIRICAL_RESULTS.rollingBacktest.forEach((item) => {
    const row = document.createElement("tr");
    [item.originYear, item.riskSet, item.observedExits, item.brier.toFixed(4), `${item.brierImprovement >= 0 ? "+" : ""}${item.brierImprovement.toFixed(4)}`].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    });
    backtestFragment.append(row);
  });
  elements.backtestTableBody.replaceChildren(backtestFragment);
}

function renderProgramStatus() {
  const phaseFragment = document.createDocumentFragment();
  PROGRAM_STATUS.phases.forEach((phase) => {
    const card = document.createElement("article");
    card.className = `phase-card phase-card--${phase.status.toLowerCase().replaceAll(" ", "-")}`;
    const number = document.createElement("span");
    number.textContent = `0${phase.phase}`;
    const status = document.createElement("b");
    status.textContent = phase.status;
    const title = document.createElement("h3");
    title.textContent = phase.name;
    const gate = document.createElement("p");
    gate.textContent = phase.gate;
    const detail = document.createElement("small");
    detail.textContent = phase.evidence[0] ?? phase.blockers[0];
    card.append(number, status, title, gate, detail);
    phaseFragment.append(card);
  });
  elements.phaseStatusGrid.replaceChildren(phaseFragment);

  elements.nextActions.replaceChildren();
  const heading = document.createElement("strong");
  heading.textContent = "Next evidence actions";
  const list = document.createElement("ol");
  PROGRAM_STATUS.nextActions.forEach((action) => {
    const item = document.createElement("li");
    item.textContent = action;
    list.append(item);
  });
  elements.nextActions.append(heading, list);
}

function renderAnalysisResults() {
  const componentNames = [
    "Fragmentation vs. institutional capacity",
    "Crisis-enabled consolidation",
    "Technical diffusion with persistent pluralism",
  ];
  const componentFragment = document.createDocumentFragment();
  ANALYSIS_RESULTS.pca.components.slice(0, 3).forEach((component, index) => {
    const card = document.createElement("article");
    card.className = "pca-card";
    const header = document.createElement("div");
    const number = document.createElement("span");
    number.textContent = `PC${component.component}`;
    const variance = document.createElement("strong");
    variance.textContent = `${(component.explainedVariance * 100).toFixed(1)}% variance`;
    header.append(number, variance);
    const title = document.createElement("h3");
    title.textContent = componentNames[index];
    const loadingList = document.createElement("div");
    loadingList.className = "loading-list";
    component.loadings.slice(0, 5).forEach((loading) => {
      const row = document.createElement("div");
      const label = document.createElement("span");
      label.textContent = loading.label;
      const value = document.createElement("b");
      value.textContent = `${loading.loading >= 0 ? "+" : ""}${loading.loading.toFixed(3)}`;
      row.append(label, value);
      loadingList.append(row);
    });
    const outcome = document.createElement("p");
    outcome.textContent = `Correlation with log capped dominance time: ${component.apexTimeCorrelation >= 0 ? "+" : ""}${component.apexTimeCorrelation.toFixed(3)}`;
    card.append(header, title, loadingList, outcome);
    componentFragment.append(card);
  });
  elements.pcaComponents.replaceChildren(componentFragment);

  const sensitivityFragment = document.createDocumentFragment();
  ANALYSIS_RESULTS.sensitivity.slice(0, 6).forEach((item) => {
    const row = document.createElement("div");
    const label = document.createElement("span");
    label.textContent = item.label;
    const meter = document.createElement("i");
    meter.style.setProperty("--magnitude", `${Math.abs(item.spearmanApexTime) * 100}%`);
    meter.className = item.spearmanApexTime < 0 ? "is-earlier" : "is-later";
    const value = document.createElement("b");
    value.textContent = `${item.spearmanApexTime >= 0 ? "+" : ""}${item.spearmanApexTime.toFixed(3)}`;
    row.append(label, meter, value);
    sensitivityFragment.append(row);
  });
  elements.sensitivityList.replaceChildren(sensitivityFragment);

  const scenarioFragment = document.createDocumentFragment();
  ANALYSIS_RESULTS.archetypes.forEach((scenario) => {
    const row = document.createElement("tr");
    const values = [
      scenario.label,
      `${(scenario.apexReachRate * 100).toFixed(1)}%`,
      scenario.medianApexCalendarYear === null ? `No reach by ${formatNumber(ANALYSIS_RESULTS.metadata.horizonCalendarYear)}` : formatNumber(scenario.medianApexCalendarYear),
      `${(scenario.fullConsolidationRate * 100).toFixed(1)}%`,
    ];
    values.forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    });
    scenarioFragment.append(row);
  });
  elements.scenarioTableBody.replaceChildren(scenarioFragment);
}

function renderExistentialRiskScope() {
  const cowScenario = SCENARIO_MATRIX.scenarios.find((scenario) => scenario.id === "cow-central");
  const cowProfile = MONTE_CARLO_RESULTS.profiles.find((profile) => profile.id === "cow_centered");
  elements.apexScopeYear.textContent = cowScenario.dominanceCalendarYear ?? `No event by ${SCENARIO_MATRIX.metadata.horizonCalendarYear}`;
  elements.apexScopeRate.textContent = `${(cowProfile.dominance.reachProbability * 100).toFixed(2)}%`;
}

function renderAnnotatedBibliography() {
  const metadata = ANNOTATED_BIBLIOGRAPHY.metadata;
  elements.annotatedBibliographySummary.textContent = `${metadata.uniqueSourceCount} unique linked sources: ${metadata.sourceCatalogCount} versioned catalog records, ${metadata.supplementalSourceCount} supplemental research links, and papers or sites from ${metadata.referenceRegistryCount} evidence topics. Every entry identifies support, model use, status, and limitations.`;
  const normalizedUrl = (value) => new URL(value).toString().replace(/\/$/, "");
  const sourceByReference = new Map(REFERENCE_ORDER.map((key) => {
    const declaredUrls = new Set(REFERENCES[key].sources.map((source) => normalizedUrl(source.url)));
    return [key, ANNOTATED_BIBLIOGRAPHY.entries.filter((entry) => (
      (entry.referenceKeys ?? []).includes(key) || declaredUrls.has(normalizedUrl(entry.url))
    ))];
  }));
  const topicFragment = document.createDocumentFragment();
  Object.entries(REFERENCE_TO_DEFAULT).forEach(([key, defaultId]) => {
    const reference = REFERENCES[key];
    const item = DEFAULT_BY_ID.get(defaultId);
    const card = document.createElement("article");
    card.id = `bib-topic-${key}`;
    card.className = "bibliography-topic-card";
    const title = document.createElement("h4"); title.textContent = reference.title;
    const defaultLine = document.createElement("strong");
    defaultLine.textContent = `Default ${formatDefaultValue(item.default)} · Tier ${item.tier} · ${item.confidence}`;
    const rationale = document.createElement("p"); rationale.textContent = item.rationale;
    const basis = document.createElement("p"); basis.className = "bibliography-topic-card__basis"; basis.textContent = `Basis: ${item.derivation}`;
    const links = document.createElement("div"); links.className = "bibliography-topic-card__links";
    sourceByReference.get(key).forEach((entry) => {
      const link = document.createElement("a"); link.href = `#bib-${entry.id}`; link.textContent = `Full annotation: ${entry.title} ↓`;
      link.addEventListener("click", () => {
        const target = document.querySelector(`#bib-${entry.id}`);
        const group = target?.closest("details");
        if (group) group.open = true;
      });
      links.append(link);
    });
    card.append(title, defaultLine, rationale, basis, links);
    topicFragment.append(card);
  });
  elements.bibliographyVariableTopics.replaceChildren(topicFragment);

  const fragment = document.createDocumentFragment();
  Object.entries(metadata.groups).forEach(([groupKey, groupLabel], groupIndex) => {
    const section = document.createElement("details");
    section.className = "bibliography-group";
    if (groupIndex === 0) section.open = true;
    const heading = document.createElement("summary");
    heading.className = "bibliography-group__heading";
    const title = document.createElement("h3"); title.textContent = groupLabel;
    const count = document.createElement("span");
    const entries = ANNOTATED_BIBLIOGRAPHY.entries.filter((entry) => entry.group === groupKey);
    count.textContent = `${entries.length} sources · expand/collapse`;
    heading.append(title, count);
    const grid = document.createElement("div"); grid.className = "bibliography-grid";
    entries.forEach((entry, index) => {
      const card = document.createElement("article"); card.className = "bibliography-card"; card.id = `bib-${entry.id}`;
      const number = document.createElement("span"); number.className = "bibliography-card__number"; number.textContent = String(index + 1).padStart(2, "0");
      const link = document.createElement("a"); link.href = entry.url; link.target = "_blank"; link.rel = "noopener noreferrer"; link.textContent = `${entry.title} — Open paper/site ↗`;
      const owner = document.createElement("p"); owner.className = "bibliography-card__owner"; owner.textContent = entry.owner ?? "Publisher/author identified at linked source";
      const metadataLine = document.createElement("p"); metadataLine.className = "bibliography-card__metadata"; metadataLine.textContent = `${entry.version} · ${entry.coverage}`;
      const annotation = (labelText, valueText, className = "") => {
        const line = document.createElement("p");
        if (className) line.className = className;
        const label = document.createElement("strong"); label.textContent = `${labelText}: `;
        line.append(label, document.createTextNode(valueText));
        return line;
      };
      const supports = annotation("Supports", entry.supports.join(" "));
      const usage = annotation("Used for", entry.modelUses.join("; "));
      const status = annotation("Status", entry.status);
      const limits = annotation("Limitations/access", entry.limitations.join(" "), "bibliography-card__limits");
      card.append(number, link, owner, metadataLine, supports, usage, status, limits);
      grid.append(card);
    });
    section.append(heading, grid); fragment.append(section);
  });
  elements.annotatedBibliography.replaceChildren(fragment);
}

function renderReferenceLedger() {
  const fragment = document.createDocumentFragment();
  REFERENCE_ORDER.forEach((key, index) => {
    const reference = REFERENCES[key];
    const card = document.createElement("article");
    card.className = "evidence-card";

    const number = document.createElement("span");
    number.className = "evidence-card__number";
    number.textContent = String(index + 1).padStart(2, "0");
    const kind = document.createElement("span");
    kind.className = "evidence-card__kind";
    kind.textContent = reference.kind;
    const title = document.createElement("h3");
    title.textContent = reference.title;
    const summary = document.createElement("p");
    summary.textContent = reference.summary;
    const defaultEvidence = createDefaultEvidence(key);
    const links = document.createElement("div");
    links.className = "evidence-card__links";
    reference.sources.forEach((source) => links.append(createSourceLink(source)));

    card.append(number, kind, title, summary);
    if (defaultEvidence) card.append(defaultEvidence);
    card.append(links);
    fragment.append(card);
  });
  elements.referenceLedger.replaceChildren(fragment);
}

function render() {
  simulation = simulateConsolidation(parameters);
  const activeAgents = agentsAtYear(simulation, parameters.selectedYear);
  const adoption = architectureAdoption(
    parameters.selectedYear,
    parameters.spreadRate,
    parameters.startAgents,
  );
  const economicContext = buildEconomicContext(activeAgents);
  const structuralCoverage = apexStructuralInfluence(activeAgents, parameters.startAgents);
  const coverage = effectiveApexInfluence(
    simulation,
    parameters.selectedYear,
    parameters.institutionalAdoptionRate,
  );
  const emergenceYear = apexDominanceYear(
    simulation,
    parameters.institutionalAdoptionRate,
  );

  refreshOutputs();
  renderMetrics(activeAgents, adoption, coverage, structuralCoverage, emergenceYear, economicContext.independentOneShare);
  renderEconomics(activeAgents);
  renderEconomicPower(economicContext);
  renderChart(activeAgents, adoption);
  renderWorldMap(activeAgents, economicContext);
  renderConstellation(activeAgents, economicContext);
  renderInterpretation(activeAgents, adoption, coverage, structuralCoverage, emergenceYear);
  updateHash();
}

function setParameters(next, activePreset = null) {
  stopAnimation();
  writeControls(next);
  elements.presets.forEach((button) => button.classList.toggle("is-active", button.dataset.preset === activePreset));
  render();
}

function handleControlInput(event) {
  if (event.target === controls.horizon) {
    controls.selectedYear.max = controls.horizon.value;
    if (Number(controls.selectedYear.value) > Number(controls.horizon.value)) {
      controls.selectedYear.value = controls.horizon.value;
    }
  }
  parameters = readControls();
  elements.presets.forEach((button) => button.classList.remove("is-active"));
  render();
}

function stopAnimation() {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  animationFrame = null;
  animationStart = null;
  elements.play.setAttribute("aria-pressed", "false");
  elements.play.innerHTML = '<span aria-hidden="true">▶</span> Play timeline';
  if (elements.mapPlay) {
    elements.mapPlay.setAttribute("aria-pressed", "false");
    elements.mapPlay.innerHTML = '<span aria-hidden="true">▶</span> Play consolidation';
  }
}

function animate(timestamp) {
  if (animationStart === null) animationStart = timestamp;
  const duration = 16_000;
  const progress = Math.min(1, (timestamp - animationStart) / duration);
  parameters.selectedYear = Math.round(animationFrom + (parameters.horizon - animationFrom) * progress);
  controls.selectedYear.value = parameters.selectedYear;
  render();

  if (progress < 1) {
    animationFrame = requestAnimationFrame(animate);
  } else {
    stopAnimation();
  }
}

function toggleAnimation() {
  if (animationFrame) {
    stopAnimation();
    return;
  }
  if (parameters.selectedYear >= parameters.horizon) {
    parameters.selectedYear = 0;
    controls.selectedYear.value = 0;
  }
  animationFrom = parameters.selectedYear;
  elements.play.setAttribute("aria-pressed", "true");
  elements.play.innerHTML = '<span aria-hidden="true">Ⅱ</span> Pause timeline';
  if (elements.mapPlay) {
    elements.mapPlay.setAttribute("aria-pressed", "true");
    elements.mapPlay.innerHTML = '<span aria-hidden="true">Ⅱ</span> Pause consolidation';
  }
  animationFrame = requestAnimationFrame(animate);
}

Object.values(controls).forEach((control) => control.addEventListener("input", handleControlInput));
elements.worldMapSlider?.addEventListener("input", () => {
  stopAnimation();
  controls.selectedYear.value = elements.worldMapSlider.value;
  handleControlInput({ target: controls.selectedYear });
});
elements.monteCarloProfile.addEventListener("change", () => renderMonteCarlo(elements.monteCarloProfile.value));
elements.reset.addEventListener("click", () => setParameters(DEFAULTS, "cow"));
elements.play.addEventListener("click", toggleAnimation);
if (elements.mapPlay) elements.mapPlay.addEventListener("click", toggleAnimation);
elements.stepBack.addEventListener("click", () => {
  parameters.selectedYear = Math.max(0, parameters.selectedYear - Math.max(1, Math.round(parameters.horizon / 100)));
  controls.selectedYear.value = parameters.selectedYear;
  render();
});
elements.stepForward.addEventListener("click", () => {
  parameters.selectedYear = Math.min(parameters.horizon, parameters.selectedYear + Math.max(1, Math.round(parameters.horizon / 100)));
  controls.selectedYear.value = parameters.selectedYear;
  render();
});
elements.presets.forEach((button) => {
  button.addEventListener("click", () => setParameters(PRESETS[button.dataset.preset], button.dataset.preset));
});

hydrateInlineReferences();
renderArticleSummary();
renderModelInsights();
renderChallengeAnalysis();
renderMonteCarlo();
renderEmpiricalResults();
renderProgramStatus();
renderAnalysisResults();
renderReferenceLedger();
renderExistentialRiskScope();
renderAnnotatedBibliography();

const restored = parseHash();
revealArticleTarget(location.hash);
writeControls(restored ?? DEFAULTS);
if (restored) elements.presets.forEach((button) => button.classList.remove("is-active"));
render();

console.info(`Convergence Atlas loaded with ${ENTITIES.length} institutions (${COUNTRIES.length} countries + ${TECH_COMPANIES.length} technology corporations) from baseline year ${BASE_YEAR}.`);
