#!/usr/bin/env python3
"""Baseline calculations for The State as Agent thought experiment.

All parameters are illustrative rather than empirical estimates.
"""

from __future__ import annotations

import math


POPULATION = 10_000_000
INITIAL_FAMILY = 1_000
CONTROLLING_CORE = 25
GENERATION_YEARS = 27


def genealogical_size(generation: int, multiplier: float = 1.8) -> int:
    """Early-phase branching estimate, capped at the reference population."""
    return min(POPULATION, round(INITIAL_FAMILY * multiplier**generation))


def first_generation_at_fraction(fraction: float, multiplier: float = 1.8) -> int:
    target = POPULATION * fraction
    generation = math.ceil(math.log(target / INITIAL_FAMILY) / math.log(multiplier))
    return max(0, generation)


def membership_flow_share(
    years: float,
    admission_rate: float,
    exit_rate: float,
    initial_share: float = INITIAL_FAMILY / POPULATION,
) -> float:
    """Solution to dq/dt = alpha(1-q) - xi*q."""
    rate = admission_rate + exit_rate
    equilibrium = admission_rate / rate
    return equilibrium + (initial_share - equilibrium) * math.exp(-rate * years)


def time_to_flow_share(
    target_share: float,
    admission_rate: float,
    exit_rate: float,
    initial_share: float = INITIAL_FAMILY / POPULATION,
) -> float | None:
    rate = admission_rate + exit_rate
    equilibrium = admission_rate / rate
    if target_share >= equilibrium:
        return None
    ratio = (equilibrium - target_share) / (equilibrium - initial_share)
    return -math.log(ratio) / rate


def residential_size(years: float, initial_residents: int = 1_000_000, net_growth: float = 0.015) -> int:
    return min(POPULATION, round(initial_residents * math.exp(net_growth * years)))


def institutional_size(years: float, net_growth: float = 0.05, capacity: int = 100_000) -> int:
    return min(capacity, round(INITIAL_FAMILY * (1 + net_growth) ** years))


def dna_contribution(generation: int) -> float:
    return 2 ** (-generation)


def idea_share(years: float, rate: float = 0.15, initial_share: float = 0.01) -> float:
    odds_factor = (1 - initial_share) / initial_share
    return 1 / (1 + odds_factor * math.exp(-rate * years))


def idea_time_to_share(target_share: float, rate: float = 0.15, initial_share: float = 0.01) -> float:
    initial_logit = math.log(initial_share / (1 - initial_share))
    target_logit = math.log(target_share / (1 - target_share))
    return (target_logit - initial_logit) / rate


def poisson_at_least_one(rate: float, years: float) -> float:
    return 1 - math.exp(-rate * years)


def pct(value: float) -> str:
    return f"{100 * value:,.3f}%"


def years_or_never(value: float | None) -> str:
    return "never at these rates" if value is None else f"{value:,.1f} years"


def main() -> None:
    print("BASELINE: N=10,000,000; F0=1,000; C0=25; generation=27 years")
    print("All values are illustrative, not empirical estimates.\n")

    print("GENEALOGICAL DESCENT (net multiplier 1.8 per generation)")
    for generation in (0, 1, 2, 3, 4, 5, 10, 12, 15, 16):
        size = genealogical_size(generation)
        print(
            f"  g={generation:2d}, year={generation * GENERATION_YEARS:3d}: "
            f"R={size:>10,} ({pct(size / POPULATION)}), C/R={pct(CONTROLLING_CORE / size)}"
        )
    for fraction in (0.10, 0.50, 0.90):
        generation = first_generation_at_fraction(fraction)
        print(f"  first ≥{fraction:.0%}: generation {generation}, about {generation * GENERATION_YEARS} years")

    print("\nPERMANENT MARRIAGE/DESCENT EXPANSION (net multiplier 2.3)")
    for fraction in (0.10, 0.50, 0.90):
        generation = first_generation_at_fraction(fraction, multiplier=2.3)
        print(f"  first ≥{fraction:.0%}: generation {generation}, about {generation * GENERATION_YEARS} years")

    print("\nFOUNDER-SPECIFIC EXPECTED DNA CONTRIBUTION")
    for generation in (1, 3, 5, 7, 10, 12):
        print(f"  g={generation:2d}: {pct(dna_contribution(generation))}")

    print("\nSELF-ASSIGNED, AUTOMATIC ACCEPTANCE (alpha=12%/yr, xi=0.5%/yr)")
    for years in (1, 5, 10, 25, 50, 100):
        share = membership_flow_share(years, 0.12, 0.005)
        print(f"  year={years:3d}: R={round(share * POPULATION):>10,} ({pct(share)})")
    for fraction in (0.50, 0.90, 0.95):
        time = time_to_flow_share(fraction, 0.12, 0.005)
        print(f"  time to {fraction:.0%}: {years_or_never(time)}")

    print("\nSELF-ASSIGNED WITH GATEKEEPING (alpha=1%/yr, xi=3%/yr)")
    for years in (10, 25, 50, 100):
        share = membership_flow_share(years, 0.01, 0.03)
        print(f"  year={years:3d}: R={round(share * POPULATION):>10,} ({pct(share)})")
    print("  equilibrium share: 25.000%")

    print("\nRESIDENTIAL REDEFINITION (1,000,000 residents immediately qualify; net growth 1.5%/yr)")
    for years in (0, 10, 25, 50, 100):
        size = residential_size(years)
        print(
            f"  year={years:3d}: R={size:>10,} ({pct(size / POPULATION)}), "
            f"C/R={pct(CONTROLLING_CORE / size)}"
        )

    print("\nCAPACITY-LIMITED INSTITUTION (5% net annual growth; capacity 100,000)")
    for years in (0, 10, 25, 50, 75, 100):
        size = institutional_size(years)
        print(f"  year={years:3d}: R={size:>10,} ({pct(size / POPULATION)})")

    print("\nWAR (lambda=0.04/year; severe-war share=15%; horizon=100 years)")
    horizon = 100
    war_rate = 0.04
    severe_rate = war_rate * 0.15
    print(f"  expected wars: {war_rate * horizon:.2f}")
    print(f"  probability of at least one war: {pct(poisson_at_least_one(war_rate, horizon))}")
    print(f"  expected severe wars: {severe_rate * horizon:.2f}")
    print(f"  probability of at least one severe war: {pct(poisson_at_least_one(severe_rate, horizon))}")

    print("\nUNSUPPRESSED IDEA (x0=1%; effective spread rate=15%/year)")
    for years in (0, 10, 20, 30, 40, 50):
        print(f"  year={years:2d}: adoption={pct(idea_share(years))}")
    for fraction in (0.10, 0.50, 0.90):
        print(f"  time to {fraction:.0%}: {idea_time_to_share(fraction):.1f} years")

    print("\nCONDITIONAL GLOBAL AI SCENARIOS (195 starting sovereign agents)")
    initial_agents = 195
    halving_rounds = math.ceil(math.log2(initial_agents))
    print(f"  binary consolidation rounds required: {halving_rounds}")
    print(f"  if every 25-year conflict causes a global halving: {halving_rounds / 0.04:.1f} expected years")
    severe_event_rate = 0.04 * 0.15
    print(
        "  if only severe conflicts cause a global halving: "
        f"{halving_rounds / severe_event_rate:.1f} expected years"
    )
    print("  sequential one-agent eliminations at one per 25 years: "
          f"{(initial_agents - 1) / 0.04:.1f} expected years")

    print("  same AI architecture spreading from 1 of 195 agents at 15%/yr:")
    for fraction in (0.50, 0.90, 0.99):
        years = idea_time_to_share(fraction, initial_share=1 / initial_agents)
        print(f"    {fraction:.0%} adoption: {years:.1f} years")

    print("  net fractional political consolidation model, T=ln(195)/k_eff:")
    for net_rate in (0.01, 0.02, 0.05, 0.10):
        years = math.log(initial_agents) / net_rate
        print(f"    k_eff={net_rate:.0%}/yr: {years:.1f} years")
    print("  if net consolidation k_eff <= 0 after fragmentation: never")


if __name__ == "__main__":
    main()
