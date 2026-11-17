# COW State System Membership v2024 — Data Use Decision

**Reviewed:** October 6, 2026  
**Source:** Correlates of War Project  
**Source page:** https://correlatesofwar.org/data-sets/state-system-membership/  
**Archive:** `States2024.zip`  
**Status:** Approved for local research analysis; redistribution unresolved

## Decision

- The public source page provides downloads and a requested academic citation.
- No explicit open-data license was identified during this review.
- The raw archive is therefore excluded from version control and must not be redistributed with the project.
- Derived row-level data remains local until redistribution terms are confirmed.
- Aggregate statistics and properly attributed analytical findings may be produced, subject to source terms.

## Required citation

> Correlates of War Project. 2025. “State System Membership, v2024.” Online, https://correlatesofwar.org

## Technical controls

- Expected SHA-256: `c11689e8c0aa70ede855f6b605c4dd71c7b04122b71d5827dab5ba06b32e2015`
- Parser rejects any archive with a different checksum.
- Parser requires the exact ten-column native schema and source version `2024`.
- Raw source location is ignored by `.gitignore`.
- Crosswalk matches remain unreviewed candidates and are never promoted automatically.

## Open question

Obtain or confirm explicit COW redistribution terms before publishing any derived row-level extract. Until then, publish code, schemas, manifests, and aggregates—not source rows.
