export function mean(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}

export function quantile(values, probability) {
  if (!values.length) return null;
  const sorted = [...values].sort((left, right) => left - right);
  const position = (sorted.length - 1) * probability;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (position - lower);
}

export function summarizeNumbers(values) {
  const finite = values.filter(Number.isFinite);
  if (!finite.length) return { mean: null, p05: null, p25: null, median: null, p75: null, p95: null, minimum: null, maximum: null };
  return {
    mean: mean(finite),
    p05: quantile(finite, 0.05),
    p25: quantile(finite, 0.25),
    median: quantile(finite, 0.5),
    p75: quantile(finite, 0.75),
    p95: quantile(finite, 0.95),
    minimum: Math.min(...finite),
    maximum: Math.max(...finite),
  };
}

export function summarizeCensoredTime(values, horizon, thresholds = [500, 1000, 2000, 5000]) {
  const eligible = values.filter((value) => value !== undefined);
  const reached = eligible.filter((value) => value !== null);
  const summary = {
    total: eligible.length,
    excludedComputationallyCensored: values.length - eligible.length,
    reached: reached.length,
    censored: eligible.length - reached.length,
    reachProbability: eligible.length ? reached.length / eligible.length : null,
    noReachProbability: eligible.length ? (eligible.length - reached.length) / eligible.length : null,
    conditional: reached.length ? summarizeNumbers(reached) : null,
    restrictedMean: mean(eligible.map((value) => value ?? horizon)),
    probabilitiesByYear: Object.fromEntries(thresholds.map((threshold) => [
      threshold,
      reached.filter((value) => value <= threshold).length / eligible.length,
    ])),
  };
  // Elapsed year by which 25/50/75/95% of all runs have reached the event; null when that share never reaches it.
  const sortedReached = [...reached].sort((a, b) => a - b);
  summary.probabilityYears = Object.fromEntries([0.25, 0.5, 0.75, 0.95].map((share) => {
    const needed = Math.ceil(share * values.length);
    return [`p${Math.round(share * 100)}`, sortedReached.length >= needed ? sortedReached[needed - 1] : null];
  }));
  summary.survival = [];
  for (let year = 0; year <= horizon; year += 250) {
    summary.survival.push({
      year,
      probabilityAboveTarget: eligible.filter((value) => value === null || value > year).length / eligible.length,
    });
  }
  summary.histogram = [];
  for (let lower = 0; lower < horizon; lower += 250) {
    const upper = lower + 250;
    summary.histogram.push({
      lower,
      upper,
      count: reached.filter((value) => value > lower && value <= upper).length,
    });
  }
  return summary;
}

function ranks(values) {
  const indexed = values.map((value, index) => ({ value, index })).sort((left, right) => left.value - right.value);
  const result = Array(values.length);
  let cursor = 0;
  while (cursor < indexed.length) {
    let end = cursor + 1;
    while (end < indexed.length && indexed[end].value === indexed[cursor].value) end += 1;
    const rank = (cursor + end - 1) / 2 + 1;
    for (let index = cursor; index < end; index += 1) result[indexed[index].index] = rank;
    cursor = end;
  }
  return result;
}

function correlation(left, right) {
  const leftMean = mean(left);
  const rightMean = mean(right);
  let numerator = 0;
  let leftSquared = 0;
  let rightSquared = 0;
  for (let index = 0; index < left.length; index += 1) {
    const leftDelta = left[index] - leftMean;
    const rightDelta = right[index] - rightMean;
    numerator += leftDelta * rightDelta;
    leftSquared += leftDelta ** 2;
    rightSquared += rightDelta ** 2;
  }
  const denominator = Math.sqrt(leftSquared * rightSquared);
  return denominator === 0 ? 0 : numerator / denominator;
}

export function spearman(left, right) {
  return correlation(ranks(left), ranks(right));
}

export function sensitivity(rows, variables, horizon) {
  const cappedTarget = rows.map((row) => row.targetFiveYear ?? horizon);
  const reached = rows.map((row) => Number(row.targetFiveYear !== null));
  return variables.map((variable) => ({
    variable,
    spearmanCappedTargetFive: spearman(rows.map((row) => row[variable]), cappedTarget),
    spearmanTargetFiveReach: spearman(rows.map((row) => row[variable]), reached),
  })).sort((left, right) => Math.abs(right.spearmanCappedTargetFive) - Math.abs(left.spearmanCappedTargetFive));
}

export function convergence(rows, checkpoints, horizon) {
  return checkpoints.filter((count) => count <= rows.length).map((count) => {
    const subset = rows.slice(0, count);
    const eligible = subset.filter((row) => !row.computationallyCensored || row.targetFiveYear !== null);
    const reached = eligible.map((row) => row.targetFiveYear).filter((value) => value !== null);
    return {
      runs: count,
      targetFiveReachProbability: eligible.length ? reached.length / eligible.length : null,
      targetFiveConditionalMedian: quantile(reached, 0.5),
      targetFiveRestrictedMean: mean(eligible.map((row) => row.targetFiveYear ?? horizon)),
      computationallyCensored: subset.length - eligible.length,
    };
  });
}

export function terminalBands(values) {
  const finite = values.filter(Number.isFinite);
  const bands = [
    { id: "one", minimum: 1, maximum: 1 },
    { id: "two_to_five", minimum: 2, maximum: 5 },
    { id: "six_to_twenty", minimum: 6, maximum: 20 },
    { id: "twenty_one_to_one_hundred", minimum: 21, maximum: 100 },
    { id: "over_one_hundred", minimum: 101, maximum: Infinity },
  ];
  return bands.map((band) => ({
    band: band.id,
    count: finite.filter((value) => value >= band.minimum && value <= band.maximum).length,
    probability: finite.length ? finite.filter((value) => value >= band.minimum && value <= band.maximum).length / finite.length : null,
  }));
}
