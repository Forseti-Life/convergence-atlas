export const BASE_YEAR = 2026;
export const DEFAULT_SEED = 20261008;

export function createRandom(seed = DEFAULT_SEED) {
  let state = (Number(seed) >>> 0) || 0x6d2b79f5;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const CLUSTERED_WAVE_GAPS_YEARS = Object.freeze([6, 36, 124]);

export function sampleClusteredInterval(meanInterval, random, gaps = CLUSTERED_WAVE_GAPS_YEARS) {
  const mean = Math.max(Number.EPSILON, Number(meanInterval) || 0);
  const available = gaps.filter((value) => Number.isFinite(value) && value > 0);
  if (!available.length) return mean;
  const referenceMean = available.reduce((sum, value) => sum + value, 0) / available.length;
  const selected = available[Math.min(available.length - 1, Math.floor(random() * available.length))];
  return mean * selected / referenceMean;
}

function sampleStandardNormal(random) {
  const first = Math.max(Number.EPSILON, random());
  const second = random();
  return Math.sqrt(-2 * Math.log(first)) * Math.cos(2 * Math.PI * second);
}

export function sampleGamma(shape, random) {
  const alpha = Math.max(Number.EPSILON, Number(shape) || 0);
  if (alpha < 1) return sampleGamma(alpha + 1, random) * (Math.max(Number.EPSILON, random()) ** (1 / alpha));
  const d = alpha - (1 / 3);
  const c = 1 / Math.sqrt(9 * d);
  while (true) {
    const normal = sampleStandardNormal(random);
    const base = 1 + (c * normal);
    if (base <= 0) continue;
    const cube = base ** 3;
    const unit = random();
    if (unit < 1 - (0.0331 * normal ** 4)) return d * cube;
    if (Math.log(Math.max(Number.EPSILON, unit)) < (0.5 * normal ** 2) + d * (1 - cube + Math.log(cube))) return d * cube;
  }
}

export function sampleBeta(alpha, beta, random) {
  const left = sampleGamma(alpha, random);
  const right = sampleGamma(beta, random);
  return left / (left + right);
}

export function sampleBinomial(trials, probability, random) {
  const n = Math.max(0, Math.round(trials));
  const p = clamp(probability, 0, 1);
  if (n === 0 || p === 0) return 0;
  if (p === 1) return n;
  if (p > 0.5) return n - sampleBinomial(n, 1 - p, random);
  const q = 1 - p;
  const ratio = p / q;
  let mass = q ** n;
  let draw = random();
  let count = 0;
  while (draw > mass && count < n) {
    draw -= mass;
    count += 1;
    mass *= ((n - count + 1) / count) * ratio;
  }
  return count;
}

export const ALIGNMENT_ASSUMPTIONS = Object.freeze({
  requiredObservabilityForEffectiveAlignment: 1,
  remediationProbabilityOnDetectedConcealment: 1,
});

export const INSTITUTIONAL_CONFLICT_ASSUMPTIONS = Object.freeze({
  permanentIndependenceLossOnUnconditionalDefeat: 1,
});

export const CIVILIZATIONAL_OUTCOME_ASSUMPTIONS = Object.freeze({
  apexImpliesHumanDisempowerment: 0,
  permanentDisempowermentIsExistentialCatastrophe: 1,
  disempowermentEqualsBiologicalExtinction: 0,
  humanDecisionRightsModeled: 0,
  biologicalExtinctionModeled: 0,
  incrementalAiMassDestructionHazard: 0,
  autonomousMaterialTakeoverAllowed: 0,
});

export const CONSOLIDATION_ACCELERATION_ASSUMPTIONS = Object.freeze({
  maximumMultiplier: 5,
  maximumInstitutionEventProbability: 0.95,
  affectsTempoOnly: 1,
});

export const PROCESS_UNCERTAINTY_ASSUMPTIONS = Object.freeze({
  clusteredWaveArrivals: 1,
  clusteredGapYears: CLUSTERED_WAVE_GAPS_YEARS,
  waveSeverityBetaConcentration: 14,
  maximumEventsPerRun: 10_000,
});

export const POWER_CALCIFICATION_ASSUMPTIONS = Object.freeze({
  apexStateAbsorbingWhileOperational: 1,
  uncuratedTopLevelBirthProbabilityAfterApex: 0,
  authorityDecayRateWhileOperational: 0,
  constituentInstitutionChurnContinues: 1,
});

// Author convention: the qualifying wave under way at the 2026 epoch resolves in 2029; historical clustering does not estimate this date.
export const CURRENT_WAVE_RESOLUTION_YEARS = 3;

export const DEFAULTS = Object.freeze({
  startAgents: 225,
  conflictInterval: 25,
  qualifyingShare: 0.476, // authored mean recurrence: 25 / 0.476 = 52.5 years
  institutionEventProbability: 0.15,
  fragmentationPerEvent: 0,
  internalConflict: 0.05,
  institutionalAdoptionRate: 0.07,
  leadingInstitutionStrength: 0.5,
  systemicCycleStress: 0.5,
  economicCoupling: 0.5,
  spreadRate: 0.15,
  consolidationAcceleration: 0.25,
  currentWaveInProgress: 1,
  horizon: 2000,
  selectedYear: 0,
});

export const LIMITS = Object.freeze({
  startAgents: [2, 225],
  conflictInterval: [1, 100],
  qualifyingShare: [0, 1],
  institutionEventProbability: [0.01, 0.9],
  fragmentationPerEvent: [0, 10],
  internalConflict: [0, 0.5],
  institutionalAdoptionRate: [0.01, 0.3],
  leadingInstitutionStrength: [0, 1],
  systemicCycleStress: [0, 1],
  economicCoupling: [0, 1],
  spreadRate: [0.01, 0.5],
  consolidationAcceleration: [0, 1],
  currentWaveInProgress: [0, 1],
  horizon: [50, 5000],
});

export function clamp(value, minimum, maximum) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return minimum;
  return Math.min(maximum, Math.max(minimum, numeric));
}

export function normalizeParameters(input = {}) {
  const merged = { ...DEFAULTS, ...input };
  const result = {};

  for (const [key, [minimum, maximum]] of Object.entries(LIMITS)) {
    result[key] = clamp(merged[key], minimum, maximum);
  }

  result.startAgents = Math.round(result.startAgents);
  result.fragmentationPerEvent = Math.round(result.fragmentationPerEvent);
  result.currentWaveInProgress = Math.round(result.currentWaveInProgress);
  result.horizon = Math.round(result.horizon);
  result.selectedYear = clamp(merged.selectedYear, 0, result.horizon);
  return result;
}

export function qualifyingEventInterval(conflictInterval, qualifyingShare) {
  const interval = Math.max(0, Number(conflictInterval));
  const share = clamp(qualifyingShare, 0, 1);
  if (interval === 0 || share === 0) return Number.POSITIVE_INFINITY;
  return interval / share;
}

export function nextAgentCount(currentAgents, parameters, random = createRandom()) {
  const current = Math.max(1, Math.round(currentAgents));
  if (current === 1 && POWER_CALCIFICATION_ASSUMPTIONS.apexStateAbsorbingWhileOperational === 1) return 1;
  const start = Math.max(current, Math.round(parameters.startAgents));
  const meanFraction = clamp(parameters.institutionEventProbability, 0, 1);
  const concentration = PROCESS_UNCERTAINTY_ASSUMPTIONS.waveSeverityBetaConcentration;
  const fraction = meanFraction === 0 || meanFraction === 1
    ? meanFraction
    : sampleBeta(meanFraction * concentration, (1 - meanFraction) * concentration, random);
  const fragments = Math.max(0, Math.round(parameters.fragmentationPerEvent));
  const internalConflict = clamp(parameters.internalConflict, 0, 0.75);
  const institutionalLosses = sampleBinomial(current, fraction, random);
  const internalFragments = sampleBinomial(current, internalConflict, random);
  const survivors = current - institutionalLosses;
  const projected = Math.min(start, Math.max(1, survivors + fragments + internalFragments));
  return projected;
}

export function bigCycleAdjustments(input = {}) {
  const parameters = normalizeParameters(input);
  const strengthSignal = (2 * parameters.leadingInstitutionStrength) - 1;
  const stressSignal = (2 * parameters.systemicCycleStress) - 1;
  const coupling = parameters.economicCoupling;

  return {
    strengthSignal,
    stressSignal,
    effectiveInstitutionEventProbability: clamp(
      parameters.institutionEventProbability * (1 + (0.5 * coupling * strengthSignal)),
      0.01,
      0.95,
    ),
    effectiveQualifyingShare: clamp(
      parameters.qualifyingShare * (1 + (0.75 * coupling * stressSignal)),
      0,
      1,
    ),
    effectiveInternalConflict: clamp(
      parameters.internalConflict
        * (1 + (0.75 * coupling * stressSignal) - (0.25 * coupling * strengthSignal)),
      0,
      0.75,
    ),
  };
}

export function consolidationAccelerationState(
  input = {},
  elapsedYear = 0,
  activeCenters = input.startAgents ?? DEFAULTS.startAgents,
  baseInstitutionEventProbability = input.institutionEventProbability ?? DEFAULTS.institutionEventProbability,
) {
  const parameters = normalizeParameters(input);
  const total = Math.max(2, parameters.startAgents);
  const centers = clamp(activeCenters, 1, total);
  const progress = clamp((total - centers) / (total - 1), 0, 1);
  const adoption = architectureAdoption(elapsedYear, parameters.spreadRate, total);
  const feedback = adoption * progress;
  const maximum = CONSOLIDATION_ACCELERATION_ASSUMPTIONS.maximumMultiplier;
  const multiplier = Math.min(
    maximum,
    1 + (parameters.consolidationAcceleration * (maximum - 1) * feedback),
  );
  const baseProbability = clamp(baseInstitutionEventProbability, 0, 0.95);
  // Revision 31: acceleration changes tempo only; loss probability is not compounded.
  const acceleratedInstitutionEventProbability = baseProbability;
  return {
    adoption,
    progress,
    feedback,
    multiplier,
    baseInstitutionEventProbability: baseProbability,
    acceleratedInstitutionEventProbability,
  };
}

export function simulateConsolidation(input = {}, options = {}) {
  const parameters = normalizeParameters(input);
  const random = createRandom(options.seed ?? DEFAULT_SEED);
  const cycleAdjustments = bigCycleAdjustments(parameters);
  const eventInterval = qualifyingEventInterval(
    parameters.conflictInterval,
    cycleAdjustments.effectiveQualifyingShare,
  );
  const initialAcceleration = consolidationAccelerationState(
    parameters,
    0,
    parameters.startAgents,
    cycleAdjustments.effectiveInstitutionEventProbability,
  );

  const points = [{
    year: 0,
    agents: parameters.startAgents,
    event: 0,
    accelerationMultiplier: initialAcceleration.multiplier,
    acceleratedInstitutionEventProbability: initialAcceleration.acceleratedInstitutionEventProbability,
  }];
  let agents = parameters.startAgents;
  let year = 0;
  let event = 0;
  let outcome = "horizon";
  let unifiedYear = null;

  if (!Number.isFinite(eventInterval)) {
    points.push({ year: parameters.horizon, agents, event });
    return {
      parameters,
      eventInterval,
      points,
      events: 0,
      outcome: "no-events",
      unifiedYear,
      cycleAdjustments,
      maximumAccelerationMultiplier: initialAcceleration.multiplier,
    };
  }

  let maximumAccelerationMultiplier = initialAcceleration.multiplier;
  const maximumEvents = Math.max(1, Math.round(options.maximumEvents ?? PROCESS_UNCERTAINTY_ASSUMPTIONS.maximumEventsPerRun));
  while (agents > 1 && event < maximumEvents) {
    const acceleration = consolidationAccelerationState(
      parameters,
      year,
      agents,
      cycleAdjustments.effectiveInstitutionEventProbability,
    );
    maximumAccelerationMultiplier = Math.max(maximumAccelerationMultiplier, acceleration.multiplier);
    // The active-wave scenario resolves exactly in 2029. Later gaps bootstrap the observed/assumed short, medium, and long clustered spacings.
    const meanAcceleratedInterval = eventInterval / acceleration.multiplier;
    const acceleratedEventInterval = event === 0 && parameters.currentWaveInProgress
      ? CURRENT_WAVE_RESOLUTION_YEARS
      : sampleClusteredInterval(meanAcceleratedInterval, random);
    const nextYear = year + acceleratedEventInterval;
    if (nextYear > parameters.horizon) break;

    const next = nextAgentCount(agents, {
      ...parameters,
      institutionEventProbability: acceleration.acceleratedInstitutionEventProbability,
      internalConflict: cycleAdjustments.effectiveInternalConflict,
    }, random);
    event += 1;
    points.push({
      year: nextYear,
      agents: next,
      event,
      eventInterval: acceleratedEventInterval,
      accelerationMultiplier: acceleration.multiplier,
      acceleratedInstitutionEventProbability: acceleration.acceleratedInstitutionEventProbability,
    });

    agents = next;
    year = nextYear;
  }

  if (agents === 1) {
    outcome = "unified";
    unifiedYear = year;
  } else if (event >= maximumEvents) {
    outcome = "event-limit";
  }

  // Never fabricate a horizon state after computational censoring.
  if (outcome !== "event-limit" && points.at(-1).year < parameters.horizon) {
    points.push({
      year: parameters.horizon,
      agents: points.at(-1).agents,
      event,
      accelerationMultiplier: points.at(-1).accelerationMultiplier,
      acceleratedInstitutionEventProbability: points.at(-1).acceleratedInstitutionEventProbability,
    });
  }

  return {
    parameters,
    eventInterval,
    points,
    events: event,
    outcome,
    unifiedYear,
    cycleAdjustments,
    maximumAccelerationMultiplier,
  };
}

export function agentsAtYear(simulation, elapsedYear) {
  const target = Math.max(0, Number(elapsedYear) || 0);
  let agents = simulation.points[0].agents;
  for (const point of simulation.points) {
    if (point.year > target) break;
    agents = point.agents;
  }
  return agents;
}

export function institutionCountThresholdYear(simulation, targetCount = 5) {
  const target = Math.max(1, Math.round(Number(targetCount) || 1));
  const point = simulation.points.find((candidate) => candidate.agents <= target);
  return point?.year ?? null;
}

export function architectureAdoption(elapsedYear, spreadRate, startAgents) {
  const agents = Math.max(1, Number(startAgents) || 1);
  if (agents === 1) return 1;
  const time = Math.max(0, Number(elapsedYear) || 0);
  const rate = Math.max(0, Number(spreadRate) || 0);
  const initial = 1 / agents;
  const initialOddsFactor = (1 - initial) / initial;
  return 1 / (1 + initialOddsFactor * Math.exp(-rate * time));
}

export function timeToAdoption(targetShare, spreadRate, startAgents) {
  const target = clamp(targetShare, 0, 1);
  const initial = 1 / Math.max(1, Number(startAgents) || 1);
  const rate = Math.max(0, Number(spreadRate) || 0);

  if (target <= initial) return 0;
  if (target >= 1 || rate === 0) return Number.POSITIVE_INFINITY;

  const initialLogit = Math.log(initial / (1 - initial));
  const targetLogit = Math.log(target / (1 - target));
  return (targetLogit - initialLogit) / rate;
}

export function buildBlocAssignments(countries, requestedBlocCount) {
  const names = [...countries];
  if (names.length === 0) return [];

  const blocCount = Math.min(
    names.length,
    Math.max(1, Math.round(requestedBlocCount)),
  );
  const blocs = Array.from({ length: blocCount }, (_, index) => ({
    id: index + 1,
    members: [],
  }));

  names.forEach((country, index) => {
    blocs[index % blocCount].members.push(country);
  });

  return blocs;
}

export function apexStructuralInfluence(activeCenters, totalInstitutions) {
  const total = Math.max(1, Math.round(totalInstitutions));
  const centers = Math.min(total, Math.max(1, Math.round(activeCenters)));
  return Math.ceil(total / centers) / total;
}

export function institutionalStandardAdoption(
  elapsedYears,
  adoptionRate,
  initialAdoption = 0.05,
) {
  const time = Math.max(0, Number(elapsedYears) || 0);
  const rate = Math.max(0, Number(adoptionRate) || 0);
  const initial = clamp(initialAdoption, 0.0001, 0.9999);
  const oddsFactor = (1 - initial) / initial;
  return 1 / (1 + oddsFactor * Math.exp(-rate * time));
}

export function apexAdoptionCohorts(simulation) {
  const total = simulation.parameters.startAgents;
  let previousSize = Math.ceil(total / simulation.points[0].agents);
  const cohorts = [{ year: 0, institutions: previousSize }];

  for (const point of simulation.points.slice(1)) {
    const currentSize = Math.ceil(total / point.agents);
    const newlyCoordinated = Math.max(0, currentSize - previousSize);
    if (newlyCoordinated > 0) {
      cohorts.push({ year: point.year, institutions: newlyCoordinated });
    }
    // Count only new coverage highs so stochastic fragmentation cannot double-count re-absorbed institutions.
    previousSize = Math.max(previousSize, currentSize);
  }
  return cohorts;
}

export function effectiveApexInfluence(
  simulation,
  elapsedYear,
  adoptionRate = simulation.parameters.institutionalAdoptionRate,
  initialAdoption = 0.05,
) {
  const time = Math.max(0, Number(elapsedYear) || 0);
  const adoptedInstitutions = apexAdoptionCohorts(simulation)
    .filter((cohort) => cohort.year <= time)
    .reduce((total, cohort) => total + (
      cohort.institutions
      * institutionalStandardAdoption(time - cohort.year, adoptionRate, initialAdoption)
    ), 0);
  return adoptedInstitutions / simulation.parameters.startAgents;
}

export function apexDominanceYear(
  simulation,
  adoptionRate = simulation.parameters.institutionalAdoptionRate,
) {
  if (simulation.unifiedYear === null) return null;
  const target = 0.5 + Number.EPSILON;
  const horizon = simulation.parameters.horizon;
  if (effectiveApexInfluence(simulation, horizon, adoptionRate) <= target) return null;

  let low = simulation.unifiedYear;
  let high = horizon;
  for (let iteration = 0; iteration < 64; iteration += 1) {
    const midpoint = (low + high) / 2;
    if (effectiveApexInfluence(simulation, midpoint, adoptionRate) > target) {
      high = midpoint;
    } else {
      low = midpoint;
    }
  }
  return high;
}

function stableNameHash(value) {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function civilizationalOutcome(
  simulation,
  adoptionRate = simulation.parameters.institutionalAdoptionRate,
) {
  const apexCoordinationYear = apexDominanceYear(simulation, adoptionRate);
  return {
    apexCoordinationYear,
    humanDisempowermentYear: null,
    biologicalExtinctionYear: null,
    postApexClassification: apexCoordinationYear === null
      ? "no-apex-coordination-within-horizon"
      : "unclassified-post-apex-governance",
    possiblePostApexClasses: [
      "ai-constitutional-coordination",
      "human-elite-displacement",
      "human-ai-coordinating-institution",
      "civilizational-succession",
      "permanent-human-disempowerment",
      "biological-extinction",
    ],
  };
}

export function buildInstitutionHierarchyAssignments(institutions, requestedCenterCount, preserveOrder = false) {
  const names = [...institutions];
  if (names.length === 0) return [];

  const centerCount = Math.min(names.length, Math.max(1, Math.round(requestedCenterCount)));
  const ordered = preserveOrder
    ? names
    : names
      .map((name, index) => ({ name, index, hash: stableNameHash(name) }))
      .sort((left, right) => left.hash - right.hash || left.index - right.index)
      .map(({ name }) => name);
  const institutionsByCenter = Array.from({ length: centerCount }, (_, index) => ({
    id: index + 1,
    role: centerCount === 1 && index === 0 ? "apex" : index === 0 ? "leading" : "independent",
    members: [],
  }));
  ordered.forEach((name, index) => institutionsByCenter[index % centerCount].members.push(name));
  return institutionsByCenter;
}

export function buildTimelineSeries(simulation, sampleCount = 160) {
  const horizon = simulation.parameters.horizon;
  const count = Math.max(2, Math.round(sampleCount));
  return Array.from({ length: count }, (_, index) => {
    const year = (index / (count - 1)) * horizon;
    return {
      year,
      agents: agentsAtYear(simulation, year),
      adoption: architectureAdoption(
        year,
        simulation.parameters.spreadRate,
        simulation.parameters.startAgents,
      ),
      apexAdoption: effectiveApexInfluence(
        simulation,
        year,
        simulation.parameters.institutionalAdoptionRate,
      ),
    };
  });
}

export function formatDuration(years) {
  if (!Number.isFinite(years)) return "Never";
  if (years < 10) return `${years.toFixed(1)} years`;
  return `${Math.round(years).toLocaleString()} years`;
}

export function calendarYear(elapsedYear) {
  return BASE_YEAR + Math.round(Math.max(0, Number(elapsedYear) || 0));
}

export function calendarYearOrNull(elapsedYear) {
  return Number.isFinite(elapsedYear) ? calendarYear(elapsedYear) : null;
}

export function formatCalendarYear(elapsedYear, noReachLabel = "No reach") {
  const year = calendarYearOrNull(elapsedYear);
  return year === null ? noReachLabel : year.toLocaleString();
}


function quantileOf(sorted, q) {
  if (!sorted.length) return null;
  const position = (sorted.length - 1) * q;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  return sorted[lower] + ((sorted[upper] - sorted[lower]) * (position - lower));
}

export function replicateOutcomes(input = {}, replicates = 1000, options = {}) {
  const seedBase = options.seedBase ?? DEFAULT_SEED;
  const nearYear = options.nearYear ?? 100;
  const parameters = normalizeParameters(input);
  const t5 = [];
  const structural = [];
  const apex = [];
  const finalCenters = [];
  let t5Eligible = 0;
  let structuralEligible = 0;
  let apexEligible = 0;
  let t5Near = 0;
  let apexNear = 0;
  let computationallyCensored = 0;
  for (let index = 0; index < replicates; index += 1) {
    const simulation = simulateConsolidation(parameters, { seed: seedBase + index });
    const targetYear = institutionCountThresholdYear(simulation, 5);
    const structuralYear = simulation.unifiedYear;
    const dominanceYear = apexDominanceYear(simulation, parameters.institutionalAdoptionRate);
    const limited = simulation.outcome === "event-limit";
    if (limited) computationallyCensored += 1;
    if (!limited || targetYear !== null) {
      t5Eligible += 1;
      if (targetYear !== null) {
        t5.push(targetYear);
        if (targetYear <= nearYear) t5Near += 1;
      }
    }
    if (!limited || structuralYear !== null) {
      structuralEligible += 1;
      if (structuralYear !== null) structural.push(structuralYear);
    }
    if (!limited || dominanceYear !== null) {
      apexEligible += 1;
      if (dominanceYear !== null) {
        apex.push(dominanceYear);
        if (dominanceYear <= nearYear) apexNear += 1;
      }
    }
    if (!limited) finalCenters.push(simulation.points.at(-1).agents);
  }
  t5.sort((a, b) => a - b);
  structural.sort((a, b) => a - b);
  apex.sort((a, b) => a - b);
  finalCenters.sort((a, b) => a - b);
  const summary = (values, eligible) => ({
    eligibleRuns: eligible,
    reachProbability: eligible ? values.length / eligible : null,
    unconditionalMedian: values.length * 2 > eligible
      ? quantileOf(values.concat(Array(eligible - values.length).fill(Infinity)).sort((a, b) => a - b), 0.5)
      : null,
    median: quantileOf(values, 0.5),
    p05: quantileOf(values, 0.05),
    p95: quantileOf(values, 0.95),
    medianCalendarYear: values.length ? calendarYear(quantileOf(values, 0.5)) : null,
    p05CalendarYear: values.length ? calendarYear(quantileOf(values, 0.05)) : null,
    p95CalendarYear: values.length ? calendarYear(quantileOf(values, 0.95)) : null,
  });
  const probabilityYears = (values, eligible) => Object.fromEntries([0.25, 0.5, 0.75, 0.95].map((share) => {
    const needed = Math.ceil(share * eligible);
    return [`p${Math.round(share * 100)}`, values.length >= needed ? calendarYear(values[needed - 1]) : null];
  }));
  const withUnconditional = (values, eligible) => {
    const result = summary(values, eligible);
    return {
      ...result,
      unconditionalMedianCalendarYear: result.unconditionalMedian === null ? null : calendarYear(result.unconditionalMedian),
      probabilityCalendarYears: probabilityYears(values, eligible),
    };
  };
  return {
    replicates,
    computationallyCensored,
    horizon: parameters.horizon,
    horizonCalendarYear: calendarYear(parameters.horizon),
    nearYear,
    nearCalendarYear: calendarYear(nearYear),
    targetFive: { ...withUnconditional(t5, t5Eligible), nearProbability: t5Eligible ? t5Near / t5Eligible : null },
    structural: withUnconditional(structural, structuralEligible),
    apex: { ...withUnconditional(apex, apexEligible), nearProbability: apexEligible ? apexNear / apexEligible : null },
    medianFinalCenters: quantileOf(finalCenters, 0.5),
  };
}
