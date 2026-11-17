import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  BASE_YEAR,
  DEFAULTS,
  agentsAtYear,
  calendarYear,
  calendarYearOrNull,
  apexDominanceYear,
  architectureAdoption,
  effectiveApexInfluence,
  simulateConsolidation,
  timeToAdoption,
} from "../web/model.mjs";

export const INPUT_COLUMNS = Object.freeze([
  "conflictInterval",
  "qualifyingShare",
  "institutionEventProbability",
  "fragmentationPerEvent",
  "internalConflict",
  "institutionalAdoptionRate",
  "leadingInstitutionStrength",
  "systemicCycleStress",
  "economicCoupling",
  "spreadRate",
  "consolidationAcceleration",
]);

export const ARCHETYPES = Object.freeze([
  {
    id: "neutral_baseline",
    label: "Neutral baseline",
    description: "Current central assumptions with economically neutral strength and stress.",
    parameters: { ...DEFAULTS },
  },
  {
    id: "stable_pluralism",
    label: "Stable pluralism",
    description: "Low systemic stress, infrequent conflict, weak consolidation, and a high dominance threshold.",
    parameters: {
      ...DEFAULTS,
      conflictInterval: 65,
      qualifyingShare: 0.08,
      institutionEventProbability: 0.18,
      fragmentationPerEvent: 3,
      internalConflict: 0.1,
      institutionalAdoptionRate: 0.05,
      leadingInstitutionStrength: 0.7,
      systemicCycleStress: 0.2,
      economicCoupling: 0.7,
      spreadRate: 0.12,
    },
  },
  {
    id: "productive_ascent",
    label: "Productive ascent",
    description: "Strong leading Institution, moderate stress, rapid implementation, and effective consolidation.",
    parameters: {
      ...DEFAULTS,
      conflictInterval: 28,
      qualifyingShare: 0.18,
      institutionEventProbability: 0.62,
      fragmentationPerEvent: 0,
      internalConflict: 0.03,
      institutionalAdoptionRate: 0.12,
      leadingInstitutionStrength: 0.88,
      systemicCycleStress: 0.52,
      economicCoupling: 0.75,
      spreadRate: 0.22,
    },
  },
  {
    id: "high_stress_hegemon",
    label: "High-stress hegemon",
    description: "A strong leading Institution consolidates rapidly during frequent systemic restructuring.",
    parameters: {
      ...DEFAULTS,
      conflictInterval: 18,
      qualifyingShare: 0.38,
      institutionEventProbability: 0.68,
      fragmentationPerEvent: 1,
      internalConflict: 0.08,
      institutionalAdoptionRate: 0.1,
      leadingInstitutionStrength: 0.95,
      systemicCycleStress: 0.9,
      economicCoupling: 0.9,
      spreadRate: 0.24,
    },
  },
  {
    id: "debt_disorder_transition",
    label: "Debt and disorder transition",
    description: "High stress creates frequent transitions while a middling leading Institution faces internal fracture.",
    parameters: {
      ...DEFAULTS,
      conflictInterval: 17,
      qualifyingShare: 0.42,
      institutionEventProbability: 0.44,
      fragmentationPerEvent: 3,
      internalConflict: 0.18,
      institutionalAdoptionRate: 0.06,
      leadingInstitutionStrength: 0.45,
      systemicCycleStress: 0.92,
      economicCoupling: 0.9,
      spreadRate: 0.16,
    },
  },
  {
    id: "fragmentation_spiral",
    label: "Fragmentation spiral",
    description: "Weak leadership, severe stress, many new fragments, and slow institutional adoption.",
    parameters: {
      ...DEFAULTS,
      conflictInterval: 12,
      qualifyingShare: 0.55,
      institutionEventProbability: 0.2,
      fragmentationPerEvent: 8,
      internalConflict: 0.32,
      institutionalAdoptionRate: 0.025,
      leadingInstitutionStrength: 0.2,
      systemicCycleStress: 0.97,
      economicCoupling: 1,
      spreadRate: 0.09,
    },
  },
  {
    id: "technical_standardization",
    label: "Technical standardization",
    description: "AI architecture and internal standards diffuse rapidly without strong political consolidation.",
    parameters: {
      ...DEFAULTS,
      conflictInterval: 48,
      qualifyingShare: 0.1,
      institutionEventProbability: 0.24,
      fragmentationPerEvent: 2,
      internalConflict: 0.07,
      institutionalAdoptionRate: 0.24,
      leadingInstitutionStrength: 0.75,
      systemicCycleStress: 0.32,
      economicCoupling: 0.45,
      spreadRate: 0.42,
    },
  },
  {
    id: "slow_federation",
    label: "Slow federation",
    description: "Moderate consolidation and low fracture unfold through infrequent restructuring events.",
    parameters: {
      ...DEFAULTS,
      conflictInterval: 52,
      qualifyingShare: 0.2,
      institutionEventProbability: 0.35,
      fragmentationPerEvent: 1,
      internalConflict: 0.04,
      institutionalAdoptionRate: 0.055,
      leadingInstitutionStrength: 0.65,
      systemicCycleStress: 0.3,
      economicCoupling: 0.6,
      spreadRate: 0.15,
    },
  },
  {
    id: "corporate_platform",
    label: "Corporate platform dominance",
    description: "High productive strength and rapid technical adoption enable platform-centered coordination.",
    parameters: {
      ...DEFAULTS,
      conflictInterval: 32,
      qualifyingShare: 0.14,
      institutionEventProbability: 0.7,
      fragmentationPerEvent: 1,
      internalConflict: 0.05,
      institutionalAdoptionRate: 0.26,
      leadingInstitutionStrength: 0.97,
      systemicCycleStress: 0.45,
      economicCoupling: 0.82,
      spreadRate: 0.45,
    },
  },
  {
    id: "multipolar_equilibrium",
    label: "Multipolar equilibrium",
    description: "Low consolidation, persistent fragmentation, and a high threshold preserve multiple centers.",
    parameters: {
      ...DEFAULTS,
      conflictInterval: 30,
      qualifyingShare: 0.22,
      institutionEventProbability: 0.14,
      fragmentationPerEvent: 6,
      internalConflict: 0.22,
      institutionalAdoptionRate: 0.08,
      leadingInstitutionStrength: 0.5,
      systemicCycleStress: 0.55,
      economicCoupling: 0.55,
      spreadRate: 0.28,
    },
  },
  {
    id: "weak_incumbent_transition",
    label: "Weak incumbent transition",
    description: "High stress and a weak leading Institution produce slow, contested reorganization.",
    parameters: {
      ...DEFAULTS,
      conflictInterval: 20,
      qualifyingShare: 0.4,
      institutionEventProbability: 0.3,
      fragmentationPerEvent: 4,
      internalConflict: 0.2,
      institutionalAdoptionRate: 0.045,
      leadingInstitutionStrength: 0.25,
      systemicCycleStress: 0.85,
      economicCoupling: 0.85,
      spreadRate: 0.14,
    },
  },
  {
    id: "rapid_restructuring",
    label: "Rapid restructuring",
    description: "Frequent qualifying events combine high consolidation with moderate counter-fragmentation.",
    parameters: {
      ...DEFAULTS,
      conflictInterval: 10,
      qualifyingShare: 0.65,
      institutionEventProbability: 0.58,
      fragmentationPerEvent: 2,
      internalConflict: 0.12,
      institutionalAdoptionRate: 0.15,
      leadingInstitutionStrength: 0.72,
      systemicCycleStress: 0.82,
      economicCoupling: 0.78,
      spreadRate: 0.3,
    },
  },
]);

const JITTER = Object.freeze({
  conflictInterval: 0.18,
  qualifyingShare: 0.045,
  institutionEventProbability: 0.065,
  fragmentationPerEvent: 1.4,
  internalConflict: 0.035,
  institutionalAdoptionRate: 0.018,
  leadingInstitutionStrength: 0.075,
  systemicCycleStress: 0.075,
  economicCoupling: 0.08,
  spreadRate: 0.035,
  consolidationAcceleration: 0.1,
});

function hashString(value) {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed) {
  let state = seed || 0x9e3779b9;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x1_0000_0000;
  };
}

function perturb(archetype, variant) {
  const parameters = {
    ...archetype.parameters,
    startAgents: 225,
    horizon: 5000,
    selectedYear: 0,
  };
  if (variant === 0) return parameters;

  const random = seededRandom(hashString(`${archetype.id}:${variant}`));
  for (const key of INPUT_COLUMNS) {
    const amplitude = JITTER[key];
    const centered = (random() * 2) - 1;
    const base = parameters[key];
    parameters[key] = key === "conflictInterval"
      ? base * (1 + (centered * amplitude))
      : base + (centered * amplitude);
  }
  parameters.fragmentationPerEvent = Math.round(parameters.fragmentationPerEvent);
  return parameters;
}

export function evaluateScenario(archetype, variant) {
  const parameters = perturb(archetype, variant);
  const simulation = simulateConsolidation(parameters);
  const apexYear = apexDominanceYear(
    simulation,
    simulation.parameters.institutionalAdoptionRate,
  );
  const fullYear = simulation.unifiedYear;
  const horizon = simulation.parameters.horizon;
  const adjusted = simulation.cycleAdjustments;

  return {
    archetype: archetype.id,
    archetypeLabel: archetype.label,
    variant,
    ...Object.fromEntries(INPUT_COLUMNS.map((key) => [key, simulation.parameters[key]])),
    effectiveInstitutionEventProbability: adjusted.effectiveInstitutionEventProbability,
    effectiveQualifyingShare: adjusted.effectiveQualifyingShare,
    effectiveInternalConflict: adjusted.effectiveInternalConflict,
    eventInterval: simulation.eventInterval,
    maximumAccelerationMultiplier: simulation.maximumAccelerationMultiplier,
    apexReached: apexYear === null ? 0 : 1,
    apexYear: apexYear ?? "",
    apexCalendarYear: calendarYearOrNull(apexYear) ?? "",
    apexYearCapped: apexYear ?? horizon,
    apexCalendarYearCapped: calendarYear(apexYear ?? horizon),
    fullConsolidationReached: fullYear === null ? 0 : 1,
    fullConsolidationYear: fullYear ?? "",
    fullConsolidationCalendarYear: calendarYearOrNull(fullYear) ?? "",
    fullConsolidationYearCapped: fullYear ?? horizon,
    fullConsolidationCalendarYearCapped: calendarYear(fullYear ?? horizon),
    apexInfluenceYear100: effectiveApexInfluence(simulation, 100),
    apexInfluenceYear500: effectiveApexInfluence(simulation, 500),
    apexInfluenceYear1000: effectiveApexInfluence(simulation, 1000),
    independentCentersYear500: agentsAtYear(simulation, 500),
    independentCentersYear1000: agentsAtYear(simulation, 1000),
    aiAdoptionYear100: architectureAdoption(100, simulation.parameters.spreadRate, 225),
    ai90Year: timeToAdoption(0.9, simulation.parameters.spreadRate, 225),
    simulationOutcome: simulation.outcome,
  };
}

export function generateScenarioRows(variantsPerArchetype = 64) {
  return ARCHETYPES.flatMap((archetype) =>
    Array.from({ length: variantsPerArchetype }, (_, variant) => evaluateScenario(archetype, variant))
  );
}

function csvCell(value) {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function rowsToCsv(rows) {
  const columns = Object.keys(rows[0]);
  return [
    columns.join(","),
    ...rows.map((row) => columns.map((column) => csvCell(row[column])).join(",")),
  ].join("\n") + "\n";
}

function main() {
  const outputDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), "output");
  fs.mkdirSync(outputDirectory, { recursive: true });
  const rows = generateScenarioRows(64);
  const outputPath = path.join(outputDirectory, "scenario-results.csv");
  fs.writeFileSync(outputPath, rowsToCsv(rows));
  console.log(`Generated ${rows.length} scenario rows at ${outputPath}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
