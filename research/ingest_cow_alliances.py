#!/usr/bin/env python3
"""Ingest COW Formal Alliances v4.1 into state-year and system-year network features."""

from __future__ import annotations

import csv
import hashlib
import io
import json
import zipfile
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ARCHIVE = ROOT / "data/raw/cow_alliances/v4.1/alliance_v4.1_csv.zip"
MEMBER = "version4.1_csv/alliance_v4.1_by_directed_yearly.csv"
EXPECTED_SHA = "a2422bb361dcc4b0ab5ff0e46f65a7ab2b4c6eafa97bdd9910302dac75e786b6"
PROCESSED = ROOT / "data/processed"
MANIFESTS = ROOT / "data/manifests"
EXPECTED_COLUMNS = [
    "version4id", "ccode1", "state_name1", "ccode2", "state_name2",
    "dyad_st_day", "dyad_st_month", "dyad_st_year", "dyad_end_day",
    "dyad_end_month", "dyad_end_year", "left_censor", "right_censor",
    "defense", "neutrality", "nonaggression", "entente", "year", "version",
]


def checksum(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def write_csv(path: Path, records: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(records[0]))
        writer.writeheader()
        writer.writerows(records)


def components(nodes: set[int], edges: set[tuple[int, int]]) -> list[set[int]]:
    adjacency = {node: set() for node in nodes}
    for left, right in edges:
        adjacency[left].add(right)
        adjacency[right].add(left)
    result = []
    unseen = set(nodes)
    while unseen:
        root = unseen.pop()
        group = {root}
        stack = [root]
        while stack:
            current = stack.pop()
            neighbors = adjacency[current] & unseen
            unseen -= neighbors
            group |= neighbors
            stack.extend(neighbors)
        result.append(group)
    return result


def main() -> None:
    if checksum(ARCHIVE) != EXPECTED_SHA:
        raise ValueError("COW alliance archive checksum mismatch")
    with zipfile.ZipFile(ARCHIVE) as archive:
        with archive.open(MEMBER) as member:
            reader = csv.DictReader(io.TextIOWrapper(member, encoding="utf-8-sig", newline=""))
            if reader.fieldnames != EXPECTED_COLUMNS:
                raise ValueError(f"Unexpected alliance schema: {reader.fieldnames}")
            rows = list(reader)
    if not rows or {row["version"] for row in rows} != {"4.1"}:
        raise ValueError("Alliance rows are not consistently version 4.1")

    state_names: dict[int, str] = {}
    partners: dict[tuple[int, int], set[int]] = defaultdict(set)
    alliance_ids: dict[tuple[int, int], set[str]] = defaultdict(set)
    terms: dict[tuple[int, int], dict[str, set[int]]] = defaultdict(lambda: defaultdict(set))
    annual_edges: dict[int, set[tuple[int, int]]] = defaultdict(set)
    annual_nodes: dict[int, set[int]] = defaultdict(set)

    for row in rows:
        year = int(row["year"])
        source = int(row["ccode1"])
        target = int(row["ccode2"])
        state_names[source] = row["state_name1"]
        state_names[target] = row["state_name2"]
        key = (source, year)
        partners[key].add(target)
        alliance_ids[key].add(row["version4id"])
        for term in ("defense", "neutrality", "nonaggression", "entente"):
            if row[term] == "1":
                terms[key][term].add(target)
        annual_nodes[year].update((source, target))
        annual_edges[year].add(tuple(sorted((source, target))))

    state_year = []
    for (ccode, year), partner_set in sorted(partners.items(), key=lambda item: (item[0][1], item[0][0])):
        state_year.append({
            "cow_code": ccode,
            "cow_name": state_names[ccode],
            "year": year,
            "alliance_partners": len(partner_set),
            "alliance_records": len(alliance_ids[(ccode, year)]),
            "defense_partners": len(terms[(ccode, year)]["defense"]),
            "neutrality_partners": len(terms[(ccode, year)]["neutrality"]),
            "nonaggression_partners": len(terms[(ccode, year)]["nonaggression"]),
            "entente_partners": len(terms[(ccode, year)]["entente"]),
            "source_version": "4.1",
        })

    system_year = []
    for year in sorted(annual_nodes):
        nodes = annual_nodes[year]
        edges = annual_edges[year]
        groups = components(nodes, edges)
        degrees = CounterLike(edges, nodes)
        total_degree = sum(degrees.values())
        hhi = sum((degree / total_degree) ** 2 for degree in degrees.values()) if total_degree else 0
        possible_edges = len(nodes) * (len(nodes) - 1) / 2
        system_year.append({
            "year": year,
            "nodes_with_alliances": len(nodes),
            "unique_alliance_edges": len(edges),
            "network_density": len(edges) / possible_edges if possible_edges else 0,
            "connected_components": len(groups),
            "largest_component_nodes": max(map(len, groups), default=0),
            "largest_component_share": max(map(len, groups), default=0) / len(nodes) if nodes else 0,
            "max_degree": max(degrees.values(), default=0),
            "degree_hhi": hhi,
            "source_version": "4.1",
        })

    PROCESSED.mkdir(parents=True, exist_ok=True)
    MANIFESTS.mkdir(parents=True, exist_ok=True)
    write_csv(PROCESSED / "cow_alliance_state_year_v4_1.csv", state_year)
    write_csv(PROCESSED / "cow_alliance_system_year_v4_1.csv", system_year)
    manifest = {
        "sourceId": "cow_alliances",
        "sourceVersion": "v4.1",
        "sourceUrl": "https://correlatesofwar.org/wp-content/uploads/version4.1_csv.zip",
        "archivePath": str(ARCHIVE.relative_to(ROOT)),
        "archiveSha256": checksum(ARCHIVE),
        "retrievedAt": "2026-10-06T13:28:00-04:00",
        "licenseDecision": "analysis-only; raw and row-level derived data excluded from redistribution pending terms review",
        "nativeMember": MEMBER,
        "nativeRows": len(rows),
        "stateYearRows": len(state_year),
        "systemYearRows": len(system_year),
        "coverage": [min(annual_nodes), max(annual_nodes)],
        "limitations": [
            "Coverage ends in 2012 and cannot represent current alliances.",
            "Only formal defense, neutrality, non-aggression, and entente commitments are represented.",
            "Centrality features are descriptive and not causal.",
            "Rows may contain multiple alliance records for the same state pair and year."
        ]
    }
    path = MANIFESTS / "cow_alliances_v4_1.json"
    path.write_text(json.dumps(manifest, indent=2) + "\n")
    print(json.dumps({
        "nativeRows": len(rows),
        "stateYearRows": len(state_year),
        "systemYearRows": len(system_year),
        "coverage": manifest["coverage"],
        "manifest": str(path),
    }, indent=2))


def CounterLike(edges: set[tuple[int, int]], nodes: set[int]) -> dict[int, int]:
    values = {node: 0 for node in nodes}
    for left, right in edges:
        values[left] += 1
        values[right] += 1
    return values


if __name__ == "__main__":
    main()
