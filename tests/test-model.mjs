import assert from "node:assert/strict";
import { COUNTRIES } from "../web/countries.mjs";
import { TECH_COMPANIES } from "../web/tech-companies.mjs";
import { REFERENCES, REFERENCE_ORDER } from "../web/references.mjs";
import {
  ALIGNMENT_ASSUMPTIONS,
  CONSOLIDATION_ACCELERATION_ASSUMPTIONS,
  CIVILIZATIONAL_OUTCOME_ASSUMPTIONS,
  INSTITUTIONAL_CONFLICT_ASSUMPTIONS,
  POWER_CALCIFICATION_ASSUMPTIONS,
  PROCESS_UNCERTAINTY_ASSUMPTIONS,
  DEFAULTS,
  agentsAtYear,
  architectureAdoption,
  bigCycleAdjustments,
  buildBlocAssignments,
  buildInstitutionHierarchyAssignments,
  calendarYear,
  calendarYearOrNull,
  formatCalendarYear,
  consolidationAccelerationState,
  createRandom,
  CURRENT_WAVE_RESOLUTION_YEARS,
  replicateOutcomes,
  sampleBinomial,
  sampleBeta,
  sampleClusteredInterval,
  CLUSTERED_WAVE_GAPS_YEARS,
  effectiveApexInfluence,
  civilizationalOutcome,
  institutionalStandardAdoption,
  institutionCountThresholdYear,
  nextAgentCount,
  normalizeParameters,
  qualifyingEventInterval,
  apexAdoptionCohorts,
  apexStructuralInfluence,
  apexDominanceYear,
  simulateConsolidation,
  timeToAdoption,
} from "../web/model.mjs";

function closeTo(actual, expected, tolerance = 1e-6) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} is not within ${tolerance} of ${expected}`);
}

assert.equal(CIVILIZATIONAL_OUTCOME_ASSUMPTIONS.apexImpliesHumanDisempowerment, 0);
assert.equal(CIVILIZATIONAL_OUTCOME_ASSUMPTIONS.permanentDisempowermentIsExistentialCatastrophe, 1);
assert.equal(CIVILIZATIONAL_OUTCOME_ASSUMPTIONS.disempowermentEqualsBiologicalExtinction, 0);
assert.equal(CIVILIZATIONAL_OUTCOME_ASSUMPTIONS.humanDecisionRightsModeled, 0);
assert.equal(CIVILIZATIONAL_OUTCOME_ASSUMPTIONS.biologicalExtinctionModeled, 0);
assert.equal(CIVILIZATIONAL_OUTCOME_ASSUMPTIONS.incrementalAiMassDestructionHazard, 0);
assert.equal(CIVILIZATIONAL_OUTCOME_ASSUMPTIONS.autonomousMaterialTakeoverAllowed, 0);
assert.equal(CONSOLIDATION_ACCELERATION_ASSUMPTIONS.maximumMultiplier, 5);
assert.equal(CONSOLIDATION_ACCELERATION_ASSUMPTIONS.maximumInstitutionEventProbability, 0.95);
assert.equal(ALIGNMENT_ASSUMPTIONS.requiredObservabilityForEffectiveAlignment, 1);
assert.equal(ALIGNMENT_ASSUMPTIONS.remediationProbabilityOnDetectedConcealment, 1);
assert.equal(INSTITUTIONAL_CONFLICT_ASSUMPTIONS.permanentIndependenceLossOnUnconditionalDefeat, 1);
assert.equal(POWER_CALCIFICATION_ASSUMPTIONS.apexStateAbsorbingWhileOperational, 1);
assert.equal(POWER_CALCIFICATION_ASSUMPTIONS.uncuratedTopLevelBirthProbabilityAfterApex, 0);
assert.equal(POWER_CALCIFICATION_ASSUMPTIONS.authorityDecayRateWhileOperational, 0);
assert.equal(POWER_CALCIFICATION_ASSUMPTIONS.constituentInstitutionChurnContinues, 1);
assert.equal(COUNTRIES.length, 195, "baseline must contain 195 entities");
assert.equal(new Set(COUNTRIES).size, 195, "country names must be unique");
assert.equal(TECH_COMPANIES.length, 30, "corporate baseline must contain 30 companies");
const entityNames = [...COUNTRIES, ...TECH_COMPANIES.map((company) => company.name)];
assert.equal(entityNames.length, 225, "combined baseline must contain 225 institutions");
assert.equal(new Set(entityNames).size, 225, "combined institution names must be unique");
assert.ok(REFERENCE_ORDER.length >= 25, "major assumptions, variables, and singularity models must be referenced");
assert.equal(new Set(REFERENCE_ORDER).size, REFERENCE_ORDER.length, "reference order must be unique");
for (const key of REFERENCE_ORDER) {
  const reference = REFERENCES[key];
  assert.ok(reference, `missing reference: ${key}`);
  assert.ok(reference.title && reference.kind && reference.summary);
  assert.ok(reference.sources.length > 0, `${key} must have at least one source`);
  reference.sources.forEach((source) => assert.match(source.url, /^https:\/\//));
}

assert.equal(calendarYear(0), 2026);
assert.equal(calendarYear(2), 2028);
assert.equal(calendarYear(5000), 7026);
assert.equal(calendarYearOrNull(null), null);
assert.equal(formatCalendarYear(2597), "4,623");
assert.equal(formatCalendarYear(null), "No reach");
closeTo(qualifyingEventInterval(25, 0.476), 52.52100840336134);
closeTo(qualifyingEventInterval(DEFAULTS.conflictInterval, DEFAULTS.qualifyingShare), 210 / 4, 0.1);
assert.equal(qualifyingEventInterval(25, 0), Number.POSITIVE_INFINITY);

// Stochastic transitions: reproducible per seed, bounded, and centered on expected values.
assert.equal(nextAgentCount(225, DEFAULTS, createRandom(7)), nextAgentCount(225, DEFAULTS, createRandom(7)));
const transitionRandom = createRandom(11);
const draws = Array.from({ length: 4000 }, () => nextAgentCount(225, DEFAULTS, transitionRandom));
const meanDraw = draws.reduce((sum, value) => sum + value, 0) / draws.length;
closeTo(meanDraw, 225 * (1 - DEFAULTS.institutionEventProbability + DEFAULTS.internalConflict), 1.2);
assert.ok(draws.every((value) => value >= 1 && value <= 225));
const binomialRandom = createRandom(3);
const binomialMean = Array.from({ length: 5000 }, () => sampleBinomial(40, 0.2, binomialRandom)).reduce((a, b) => a + b, 0) / 5000;
closeTo(binomialMean, 8, 0.2);
assert.equal(sampleBinomial(10, 0, binomialRandom), 0);
assert.equal(sampleBinomial(10, 1, binomialRandom), 10);
assert.equal(nextAgentCount(1, { ...DEFAULTS, fragmentationPerEvent: 10, internalConflict: 0.5 }), 1);
const threeCenterOutcomes = Array.from({ length: 1000 }, (_, seed) => nextAgentCount(3, { ...DEFAULTS, startAgents: 3, institutionEventProbability: 1 / 3, internalConflict: 0, fragmentationPerEvent: 0 }, createRandom(seed + 1)));
assert.ok(threeCenterOutcomes.includes(2), "3→2 must remain a reachable state rather than being rewritten as 3→1");
const neutralCycle = bigCycleAdjustments(DEFAULTS);
closeTo(neutralCycle.effectiveInstitutionEventProbability, 0.15);
closeTo(neutralCycle.effectiveQualifyingShare, 0.476);
closeTo(neutralCycle.effectiveInternalConflict, 0.05);
const expansionCycle = bigCycleAdjustments({
  ...DEFAULTS,
  leadingInstitutionStrength: 1,
  systemicCycleStress: 1,
  economicCoupling: 1,
});
closeTo(expansionCycle.effectiveInstitutionEventProbability, 0.225);
closeTo(expansionCycle.effectiveQualifyingShare, 0.476 * 1.75);
closeTo(expansionCycle.effectiveInternalConflict, 0.075);
const declineCycle = bigCycleAdjustments({
  ...DEFAULTS,
  leadingInstitutionStrength: 0,
  systemicCycleStress: 1,
  economicCoupling: 1,
});
closeTo(declineCycle.effectiveInstitutionEventProbability, 0.075);
closeTo(declineCycle.effectiveQualifyingShare, 0.476 * 1.75);
closeTo(declineCycle.effectiveInternalConflict, 0.1);

const initialAcceleration = consolidationAccelerationState(DEFAULTS, 0, 225, 0.15);
closeTo(initialAcceleration.multiplier, 1);
closeTo(initialAcceleration.acceleratedInstitutionEventProbability, 0.15);
const fullAcceleration = consolidationAccelerationState({ ...DEFAULTS, consolidationAcceleration: 1 }, 5000, 1, 0.15);
closeTo(fullAcceleration.multiplier, 5);
closeTo(fullAcceleration.acceleratedInstitutionEventProbability, 0.15); // tempo only
const noAcceleration = consolidationAccelerationState({ ...DEFAULTS, consolidationAcceleration: 0 }, 5000, 1, 0.15);
closeTo(noAcceleration.multiplier, 1);
closeTo(noAcceleration.acceleratedInstitutionEventProbability, 0.15);

const baseline = simulateConsolidation(DEFAULTS);
assert.deepEqual(simulateConsolidation(DEFAULTS).points, simulateConsolidation(DEFAULTS).points, "same seed must reproduce the path");
assert.equal(agentsAtYear(baseline, 0), 225);
assert.ok(baseline.points.every((point, index) => index === 0 || point.year >= baseline.points[index - 1].year));
assert.ok(baseline.maximumAccelerationMultiplier >= 1 && baseline.maximumAccelerationMultiplier <= 5);
const baselineFive = institutionCountThresholdYear(baseline, 5);
assert.ok(baselineFive === null || baselineFive <= DEFAULTS.horizon);
const baselineStats = replicateOutcomes({ ...DEFAULTS, horizon: 5000 }, 300);
assert.ok(baselineStats.apex.reachProbability > 0.9, "accelerated durable baseline reaches Apex by 7026");
assert.ok(baselineStats.apex.nearProbability < 0.01, "accelerated durable baseline almost never reaches Apex by 2126");
const noAccelerationStats = replicateOutcomes({ ...DEFAULTS, horizon: 5000, consolidationAcceleration: 0 }, 300);
assert.ok(noAccelerationStats.apex.probabilityCalendarYears.p50 > baselineStats.apex.probabilityCalendarYears.p50, "acceleration pulls the median Apex year earlier");
// In-progress wave resolves exactly in 2029, even when the later-wave mean is shorter than three years.
assert.equal(simulateConsolidation(DEFAULTS).points[1].year, CURRENT_WAVE_RESOLUTION_YEARS);
assert.equal(simulateConsolidation({ ...DEFAULTS, conflictInterval: 1, qualifyingShare: 1 }).points[1].year, CURRENT_WAVE_RESOLUTION_YEARS);
assert.notEqual(simulateConsolidation({ ...DEFAULTS, currentWaveInProgress: 0 }).points[1].year, CURRENT_WAVE_RESOLUTION_YEARS);

// Stochastic process assumptions preserve means while adding arrival and wave-level severity variance.
const arrivalRandom = createRandom(41);
const arrivals = Array.from({ length: 12000 }, () => sampleClusteredInterval(52.5, arrivalRandom));
closeTo(arrivals.reduce((a, b) => a + b, 0) / arrivals.length, 52.5, 1.2);
const allowedArrivals = CLUSTERED_WAVE_GAPS_YEARS.map((gap) => 52.5 * gap / (166 / 3));
assert.ok(arrivals.every((value) => allowedArrivals.some((allowed) => Math.abs(value - allowed) < 1e-9)));
const betaRandom = createRandom(42);
const severities = Array.from({ length: 10000 }, () => sampleBeta(0.15 * 14, 0.85 * 14, betaRandom));
closeTo(severities.reduce((a, b) => a + b, 0) / severities.length, 0.15, 0.01);
const severityVariance = severities.reduce((sum, value) => sum + ((value - 0.15) ** 2), 0) / severities.length;
assert.ok(severityVariance > 0.005, "latent wave severity must add material overdispersion beyond a fixed Bernoulli rate");
assert.equal(PROCESS_UNCERTAINTY_ASSUMPTIONS.clusteredWaveArrivals, 1);
assert.equal(PROCESS_UNCERTAINTY_ASSUMPTIONS.waveSeverityBetaConcentration, 14);
const limited = simulateConsolidation({ ...DEFAULTS, currentWaveInProgress: 0, horizon: 5000 }, { maximumEvents: 2 });
assert.equal(limited.outcome, "event-limit");
assert.ok(limited.points.at(-1).year < limited.parameters.horizon, "event-limit must not fabricate a horizon point");
assert.equal(institutionCountThresholdYear(simulateConsolidation({ ...DEFAULTS, startAgents: 5 }), 5), 0);
const targetFiveSlow = simulateConsolidation({
  ...DEFAULTS,
  conflictInterval: 100,
  qualifyingShare: 0.12,
  institutionEventProbability: 0.48,
  internalConflict: 0,
  consolidationAcceleration: 0,
  horizon: 5000,
});
assert.ok((institutionCountThresholdYear(targetFiveSlow, 5) ?? 5000) <= 5000);
assert.ok((apexDominanceYear(baseline, 0.07) ?? 0) <= DEFAULTS.horizon);

const corporateWave = simulateConsolidation({ ...DEFAULTS, institutionEventProbability: 0.5, consolidationAcceleration: 0 });
assert.equal(corporateWave.outcome, "unified");
assert.ok(corporateWave.unifiedYear > 300 && corporateWave.unifiedYear < 1500);
closeTo(apexStructuralInfluence(225, 225), 1 / 225);
closeTo(apexStructuralInfluence(68, 225), 4 / 225);
closeTo(institutionalStandardAdoption(0, 0.07), 0.05);
assert.ok(institutionalStandardAdoption(100, 0.07) > 0.98);
const cohorts = apexAdoptionCohorts(corporateWave);
assert.equal(cohorts[0].institutions, 1);
assert.equal(cohorts.reduce((sum, cohort) => sum + cohort.institutions, 0), 225);
closeTo(effectiveApexInfluence(corporateWave, 0, 0.07), 0.05 / 225);
const apexYear = apexDominanceYear(corporateWave, 0.07);
const civilizational = civilizationalOutcome(corporateWave, 0.07);
closeTo(civilizational.apexCoordinationYear, apexYear);
assert.equal(civilizational.humanDisempowermentYear, null);
assert.equal(civilizational.biologicalExtinctionYear, null);
assert.equal(civilizational.postApexClassification, "unclassified-post-apex-governance");
assert.equal(civilizational.possiblePostApexClasses.length, 6);
assert.ok(apexYear > corporateWave.unifiedYear && apexYear < corporateWave.unifiedYear + 100, `unexpected adoption-adjusted Apex Institution year: ${apexYear}`);
assert.ok(effectiveApexInfluence(corporateWave, 5000, 0.07) <= 1 + 1e-9, "adoption cohorts never double count");
const institutionBlocs = buildInstitutionHierarchyAssignments(entityNames, 68);
assert.equal(institutionBlocs.length, 68);
assert.equal(institutionBlocs[0].role, "leading");
assert.equal(institutionBlocs[0].members.length, 4);
assert.ok(Math.max(...institutionBlocs.map((bloc) => bloc.members.length)) - Math.min(...institutionBlocs.map((bloc) => bloc.members.length)) <= 1);
assert.equal(new Set(institutionBlocs.flatMap((bloc) => bloc.members)).size, 225);
const orderedInstitutions = buildInstitutionHierarchyAssignments(["Largest", "Middle", "Smallest"], 3, true);
assert.equal(orderedInstitutions[0].members[0], "Largest");

const noEvents = simulateConsolidation({ ...DEFAULTS, qualifyingShare: 0 });
assert.equal(noEvents.outcome, "no-events");
assert.equal(noEvents.unifiedYear, null);
assert.equal(agentsAtYear(noEvents, DEFAULTS.horizon), 225);

const stalled = simulateConsolidation({
  ...DEFAULTS,
  qualifyingShare: 0.35,
  institutionEventProbability: 0.08,
  fragmentationPerEvent: 10,
});
assert.equal(stalled.unifiedYear, null, "heavy fragmentation prevents Apex coordination");

const blocs = buildBlocAssignments(entityNames, 8);
assert.equal(blocs.length, 8);
assert.equal(blocs.flatMap((bloc) => bloc.members).length, 225);
assert.equal(new Set(blocs.flatMap((bloc) => bloc.members)).size, 225);
const blocSizes = blocs.map((bloc) => bloc.members.length);
assert.ok(Math.max(...blocSizes) - Math.min(...blocSizes) <= 1);

const adoption0 = architectureAdoption(0, 0.15, 225);
const adoption51 = architectureAdoption(51, 0.15, 225);
closeTo(adoption0, 1 / 225);
assert.ok(adoption51 > 0.9);
closeTo(timeToAdoption(0.9, 0.15, 225), 50.72580419460839, 1e-9);
assert.equal(timeToAdoption(1, 0.15, 225), Number.POSITIVE_INFINITY);

const clamped = normalizeParameters({
  startAgents: 999,
  qualifyingShare: -1,
  institutionEventProbability: 3,
  fragmentationPerEvent: 99,
  internalConflict: 9,
  institutionalAdoptionRate: 9,
  leadingInstitutionStrength: 9,
  systemicCycleStress: -9,
  economicCoupling: 9,
  consolidationAcceleration: 9,
  horizon: 1,
  selectedYear: 9000,
});
assert.equal(clamped.startAgents, 225);
assert.equal(clamped.qualifyingShare, 0);
assert.equal(clamped.institutionEventProbability, 0.9);
assert.equal(clamped.fragmentationPerEvent, 10);
assert.equal(clamped.internalConflict, 0.5);
assert.equal(clamped.institutionalAdoptionRate, 0.3);
assert.equal(clamped.leadingInstitutionStrength, 1);
assert.equal(clamped.systemicCycleStress, 0);
assert.equal(clamped.economicCoupling, 1);
assert.equal(clamped.consolidationAcceleration, 1);
assert.equal(clamped.horizon, 50);
assert.equal(clamped.selectedYear, 50);

console.log("✓ Apex coordination, permanent disempowerment, and biological extinction separated");
console.log("✓ mandatory observability and detected-concealment remediation invariants");
console.log("✓ 195 countries + 30 revenue-driven technology corporations");
console.log("✓ complete reference registry with secure source links");
console.log("✓ neutral and stressed Big Cycle economic adjustments");
console.log("✓ bounded AI consolidation acceleration and exact zero-feedback ablation");
console.log("✓ consolidation, internal conflict, and adoption-adjusted Apex Institution dominance");
console.log("✓ institutional adoption cohorts and enforcement depth");
console.log("✓ all 225 institutions persist inside apex/independent assignments");
console.log("✓ no-event and fragmentation non-convergence");
console.log("✓ complete institution assignment across Apex Institution and independent centers");
console.log("✓ logistic AI architecture diffusion");
console.log("✓ parameter normalization and limits");
console.log("All model tests passed.");

// Probability years: monotonic, bounded by the horizon, null only when that share never reaches the event.
{
  const stats = replicateOutcomes({ ...DEFAULTS, horizon: 5000 }, 200);
  const years = ["p25", "p50", "p75", "p95"].map((key) => stats.apex.probabilityCalendarYears[key]);
  const finite = years.filter((year) => year !== null);
  assert.ok(finite.every((year, index) => index === 0 || year >= finite[index - 1]));
  assert.ok(finite.every((year) => year >= 2026 && year <= 7026));
  assert.equal(years[3] === null, stats.apex.reachProbability < 0.95);
  assert.ok(stats.structural.unconditionalMedian <= stats.apex.unconditionalMedian, "structural Apex must precede effective Apex coordination");
  console.log("✓ cumulative probability years are monotonic and horizon-bounded");
}
