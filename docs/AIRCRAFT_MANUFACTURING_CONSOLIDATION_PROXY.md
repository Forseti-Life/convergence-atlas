# Aircraft Manufacturing Consolidation Proxy

**Calibration role:** Secondary high-intensity corporate comparison; not the sovereign production default. The primary default is documented in `COW_SOVEREIGN_WAVE_PROXY.md`.
# Aircraft and Aerospace Manufacturing Consolidation Proxy

**Date:** October 7, 2026  
**Status:** Bounded corporate consolidation-wave reference

## Correct model interpretation

A major external event creates a consolidation wave. Every Institution exposed to the wave receives its own probability of losing top-level independence:

```text
p_i,e = P(Institution i loses independence during wave e)
```

Multiple mergers, acquisitions, failures, and absorptions can happen during the same wave. The expected field after a wave is:

```text
E[S_(e+1)]
= Σ_i [1 - p_i,e]
+ new entrants
+ spin-offs or fragments
```

For equal `p` and no entrants:

```text
E[S_(e+1)] = S_e(1-p)
```

This is mathematically similar to the production model's current fractional reduction, but the parameter should be interpreted as an **Institution-level loss probability during a shared wave**, not the percentage removed by one winner/loser event.

Once an Institution experiences the decisive event, consolidation is certain by definition:

```text
P(loss of independence | decisive Institution event) = 1
```

The probability being estimated is whether each Institution experiences that event during the wave.

## Market-definition correction

The proxy must separate:

1. **Large civil aircraft primes:** Boeing and Airbus became the two major Western/global LCA producers after Boeing combined with McDonnell Douglas in 1997.
2. **Military aerospace primes:** Lockheed Martin, Boeing, Northrop Grumman, and other defense firms occupy a different market.
3. **Broader aircraft manufacturing:** Embraer, COMAC, and other manufacturers prevent describing all aircraft production as a Boeing/Airbus/Lockheed three-firm market.

Lockheed is a major aerospace survivor but not a current large-commercial-airliner prime.

## Bounded wave observations

| Segment and wave | Before | After | Institution loss share |
|---|---:|---:|---:|
| Global Western large civil aircraft, 1997 | 3 | 2 | 33.3% |
| U.S. fixed-wing combat-aircraft primes, 1990s | 7 | 2 | 71.4% |
| U.S. missile manufacturers, 1990–1998 | 14 | 4 | 71.4% |
| U.S. launch-vehicle producers, 1990–1998 | 6 | 2 | 66.7% |

The aircraft-only lower/upper range is approximately:

```text
33.3%–71.4% Institution loss per severe consolidation wave
```

Its midpoint is:

```text
(33.3% + 71.4%) / 2 = 52.4%
```

The model's 50% central default is therefore a reasonable rounded corporate-wave reference. It remains a proxy, not a universal estimate.

## Major lineage markers

This is not an exhaustive census of every manufacturer since 1903. It records well-documented consolidation markers:

- 1967: McDonnell and Douglas combined into McDonnell Douglas.
- 1970: Airbus began as a European consortium.
- 1995: Lockheed and Martin Marietta formed Lockheed Martin.
- 1997: Boeing combined with McDonnell Douglas.
- 2000: Aérospatiale-Matra, DASA, and CASA formed EADS, later Airbus Group.

A complete start-to-present manufacturer genealogy would require a dedicated historical corporate-event dataset. The current proxy is sufficient to justify a bounded wave-loss range.

## Major-event multiplier

A future stochastic model should calculate:

```text
p_i,e = logistic(
    α
  + β_size relative_size_i
  + β_debt debt_stress_i
  + β_network dependency_i
  + β_tech technology_gap_i
  + β_event wave_severity_e
)
```

A shared wave variable makes Institution outcomes correlated. Independent Bernoulli draws alone would understate systemic clustering.

## Airbus relevance to observability

The USITC report also noted that Airbus's former consortium structure limited cost transparency and centralized oversight, while restructuring toward a single corporate entity was intended to consolidate authority and responsibility. This provides a direct organizational analogue for the model's mandatory-observability assumption.

## Sources

- USITC Publication 3143, *The Changing Structure of the Global Large Civil Aircraft Industry and Market* — https://www.usitc.gov/publications/332/pub3143.pdf
- RAND MR-1696, *Industry Structure, Innovation, and Competition in the U.S. Combat Aircraft Industry: 1909–2000* — https://www.rand.org/pubs/monograph_reports/MR1696.html
- RAND MR-1537, *Going Global? U.S. Government Policy and the Defense Aerospace Industry* — https://www.rand.org/pubs/monograph_reports/MR1537.html
- Encyclopaedia Britannica, McDonnell Douglas history — https://www.britannica.com/money/McDonnell-Douglas-Corporation

## Use rule

Use the 33%–71% range as a severe corporate consolidation-wave prior and 50% as a rounded central scenario. Do not apply the range directly to sovereign Institutions without separate calibration.
