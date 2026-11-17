export function xorshift32(seed) {
  let state = seed >>> 0;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x1_0000_0000;
  };
}

export function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function logit(value) {
  const bounded = clamp(value, 1e-12, 1 - 1e-12);
  return Math.log(bounded / (1 - bounded));
}

function logistic(value) {
  if (value >= 0) return 1 / (1 + Math.exp(-Math.min(value, 40)));
  const exp = Math.exp(Math.max(value, -40));
  return exp / (1 + exp);
}

export function inverseNormal(probability) {
  const p = clamp(probability, 1e-12, 1 - 1e-12);
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const low = 0.02425;
  const high = 1 - low;
  if (p < low) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5])
      / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p <= high) {
    const q = p - 0.5;
    const r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q
      / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }
  const q = Math.sqrt(-2 * Math.log(1 - p));
  return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5])
    / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
}

function averageSigma(center, lower, upper, transform) {
  const z90 = 1.6448536269514722;
  const middle = transform(center);
  const lowerDistance = middle - transform(lower);
  const upperDistance = transform(upper) - middle;
  return ((lowerDistance + upperDistance) / 2) / z90;
}

function poissonInverse(probability, lambda, maximum) {
  let term = Math.exp(-lambda);
  let cumulative = term;
  let count = 0;
  while (probability > cumulative && count < maximum) {
    count += 1;
    term *= lambda / count;
    cumulative += term;
  }
  return count;
}

export function sampleDistribution(specification, unit, definitionMeans = []) {
  const u = clamp(unit, 1e-12, 1 - 1e-12);
  let value;
  if (specification.type === "uniform") {
    value = specification.min + u * (specification.max - specification.min);
  } else if (specification.type === "logUniform") {
    value = Math.exp(Math.log(specification.min) + u * (Math.log(specification.max) - Math.log(specification.min)));
  } else if (specification.type === "logNormal") {
    const sigma = averageSigma(specification.median, specification.lower90, specification.upper90, Math.log);
    value = Math.exp(Math.log(specification.median) + sigma * inverseNormal(u));
  } else if (specification.type === "logisticNormal") {
    const sigma = averageSigma(specification.median, specification.lower90, specification.upper90, logit);
    value = logistic(logit(specification.median) + sigma * inverseNormal(u));
  } else if (specification.type === "zeroInflatedPoisson") {
    if (u <= specification.zeroProbability) value = 0;
    else {
      const conditional = (u - specification.zeroProbability) / (1 - specification.zeroProbability);
      value = poissonInverse(conditional, specification.lambda, specification.max);
    }
  } else if (specification.type === "cowDefinitionMeans") {
    if (!definitionMeans.length) throw new Error("COW definition means are required");
    const position = u * definitionMeans.length;
    const index = Math.min(definitionMeans.length - 1, Math.floor(position));
    const local = clamp(position - index, 1e-9, 1 - 1e-9);
    value = logistic(logit(definitionMeans[index]) + specification.jitterLogitSigma * inverseNormal(local));
  } else {
    throw new Error(`Unsupported distribution type: ${specification.type}`);
  }
  value = clamp(value, specification.min, specification.max);
  return specification.integer ? Math.round(value) : value;
}

export function resolveProfiles(registry) {
  const source = new Map(registry.profiles.map((profile) => [profile.id, profile]));
  const resolved = new Map();
  function resolve(profile) {
    if (resolved.has(profile.id)) return resolved.get(profile.id);
    const base = profile.inherits ? resolve(source.get(profile.inherits)) : null;
    const result = {
      ...profile,
      distributions: {
        ...(base?.distributions ?? {}),
        ...(profile.distributions ?? {}),
        ...(profile.overrides ?? {}),
      },
    };
    resolved.set(profile.id, result);
    return result;
  }
  return registry.profiles.map(resolve);
}

function shuffledLatinColumn(count, random) {
  const values = Array.from({ length: count }, (_, index) => (index + random()) / count);
  for (let index = count - 1; index > 0; index -= 1) {
    const selected = Math.floor(random() * (index + 1));
    [values[index], values[selected]] = [values[selected], values[index]];
  }
  return values;
}

export function latinHypercube(distributions, count, seed, definitionMeans = []) {
  const random = xorshift32(seed);
  const variables = Object.keys(distributions);
  const columns = Object.fromEntries(variables.map((variable) => [variable, shuffledLatinColumn(count, random)]));
  return Array.from({ length: count }, (_, index) => Object.fromEntries(variables.map((variable) => [
    variable,
    sampleDistribution(distributions[variable], columns[variable][index], definitionMeans),
  ])));
}
