#!/usr/bin/env python3
"""Validate the COW-primary sovereign consolidation proxy."""

import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main():
    subprocess.run(
        ["python3", str(ROOT / "analysis/cow_sovereign_wave_proxy.py")],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    proxy = json.loads((ROOT / "research/sovereign-consolidation-proxy.v1.json").read_text())
    assert proxy["primarySource"] == "COW State System Membership v2024"
    assert proxy["supportingSource"] == "COW Intra-State War v5.1"
    assert proxy["roundedDefault"] == 0.15
    assert proxy["futurePermanenceRule"] == 1
    assert proxy["futurePermanenceCondition"] == "decisive unconditional defeat"
    assert proxy["forecast"] is False
    waves = proxy["majorWaves"]
    assert len(waves) == 4
    assert [wave["uniqueInstitutionExits"] for wave in waves] == [5, 9, 18, 5]
    assert abs(proxy["meanMajorWaveGrossLossProbability"] - 0.15855369412279982) < 1e-12
    assert waves[0]["start"].startswith("1860")
    assert waves[-1]["start"].startswith("1990")
    linkage = proxy["civilWarLinkage"]
    assert linkage["exposed"]["exitEvents"] == 21
    assert linkage["unexposed"]["exitEvents"] == 268
    assert linkage["challengerVictory"]["exitEvents"] == 10
    assert linkage["exposed"]["fiveYearExitRisk"] < linkage["unexposed"]["fiveYearExitRisk"]
    assert linkage["challengerVictory"]["fiveYearExitRisk"] > linkage["unexposed"]["fiveYearExitRisk"]
    corporate = proxy["secondaryCorporateProxy"]
    assert corporate["range"] == [1 / 3, 5 / 7]
    report = (ROOT / "docs/COW_SOVEREIGN_WAVE_PROXY.md").read_text()
    assert "permanent subjugation and integration" in report
    assert "secondary corporate" in report.lower()
    assert "does not cover Rome" in report
    print("✓ four reproducible major COW exit waves")
    print("✓ 15% sovereign-wave default from 15.9% gross mean")
    print("✓ civil-war exit-risk linkage and negative-result disclosure")
    print("✓ permanent future defeat rule and secondary aircraft proxy")
    print("Sovereign proxy validation passed.")


if __name__ == "__main__":
    main()
