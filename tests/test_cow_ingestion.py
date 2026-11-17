#!/usr/bin/env python3
"""Validate COW State System Membership v2024 ingestion outputs."""

from __future__ import annotations

import csv
import hashlib
import json
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
EXPECTED_SHA = "c11689e8c0aa70ede855f6b605c4dd71c7b04122b71d5827dab5ba06b32e2015"


def rows(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def main() -> None:
    archive = ROOT / "data/raw/cow_states/v2024/States2024.zip"
    assert hashlib.sha256(archive.read_bytes()).hexdigest() == EXPECTED_SHA

    subprocess.run(
        ["python3", str(ROOT / "research/ingest_cow_states.py")],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )

    manifest = json.loads((ROOT / "data/manifests/cow_states_v2024.json").read_text())
    spells = rows(ROOT / "data/interim/cow_state_spells_v2024.csv")
    state_year = rows(ROOT / "data/processed/cow_state_year_v2024.csv")
    transitions = rows(ROOT / "data/processed/cow_state_transitions_v2024.csv")
    counts = rows(ROOT / "data/processed/cow_system_counts_v2024.csv")
    candidates = rows(ROOT / "data/crosswalks/cow-v2024-candidates.csv")

    assert len(spells) == manifest["spellRows"] == manifest["nativeRows"]
    assert len(state_year) == manifest["stateYearRows"]
    assert len(transitions) == manifest["transitionRows"]
    assert len(counts) == manifest["annualCountRows"]
    assert len(candidates) == 195
    assert all(row["source_version"] == "2024" for row in spells)
    assert all(row["source_version"] == "2024" for row in state_year)
    assert len({row["spell_id"] for row in spells}) == len(spells)
    assert len({row["transition_id"] for row in transitions}) == len(transitions)
    assert len({(row["spell_id"], row["year"]) for row in state_year}) == len(state_year)
    assert all(row["review_status"] == "unreviewed" for row in candidates)
    assert all(row["candidate_status"] != "verified" for row in candidates)
    assert manifest["crosswalkCandidates"]["verified"] == 0
    assert manifest["archiveSha256"] == EXPECTED_SHA
    assert "redistribution unresolved" in manifest["licenseDecision"]

    years = [int(row["year"]) for row in counts]
    assert min(years) == 1816
    assert max(years) == 2024
    assert all(int(row["active_membership_spells"]) > 0 for row in counts)
    assert any(row["transition_type"] == "system_membership_exit" for row in transitions)
    assert any(row["right_censored"] == "1" for row in spells)
    assert any(row["right_censored"] == "0" for row in spells)

    print(f"✓ COW archive checksum and native version ({len(spells)} spells)")
    print(f"✓ {len(state_year):,} state-year rows and {len(transitions)} entry/exit events")
    print(f"✓ annual system counts for {min(years)}–{max(years)}")
    print(f"✓ {manifest['crosswalkCandidates']['provisional']} provisional and {manifest['crosswalkCandidates']['unresolved']} unresolved candidates; zero verified")
    print("COW ingestion validation passed.")


if __name__ == "__main__":
    main()
