# Institution Identifier Crosswalk Schema

## File

`institution-identifiers.csv`

## Purpose

Reconcile local model names with versioned identifiers from ISO, Correlates of War, World Bank, and UCDP/Gleditsch-Ward while preserving historical predecessor and successor relationships.

## Columns

| Column | Type | Required | Meaning |
|---|---|---:|---|
| `institution_id` | string | Yes | Stable project-local identifier |
| `canonical_name` | string | Yes | Current project display name |
| `entity_type` | enum | Yes | `state` in Phase 1 |
| `iso_alpha2` | string/null | No | ISO alpha-2 code after verification |
| `iso_alpha3` | string/null | No | ISO alpha-3 code after verification |
| `cow_code` | integer/null | No | COW numeric state code |
| `world_bank_code` | string/null | No | World Bank economy code |
| `ucdp_gwno` | integer/null | No | UCDP/Gleditsch-Ward number |
| `valid_from` | date/null | No | First valid date for this identity |
| `valid_to` | date/null | No | Last valid date; blank if current |
| `predecessor_ids` | pipe-delimited string | No | Reviewed local predecessor IDs |
| `successor_ids` | pipe-delimited string | No | Reviewed local successor IDs |
| `mapping_status` | enum | Yes | `unresolved`, `provisional`, or `verified` |
| `reviewer` | string/null | No | Reviewer approving provisional/verified mapping |
| `reviewed_at` | timestamp/null | No | Review timestamp |
| `source_notes` | string | Yes | Source and ambiguity notes |

## Current seed policy

The initial generated file contains 195 current country-level entities with only local IDs and canonical names populated. Every external code remains blank and every row remains `unresolved` until checked against frozen source versions.

## Promotion rules

### Unresolved → provisional

- At least two source identifiers agree or an authoritative source resolves the mapping.
- Name changes and territorial discontinuities are documented.
- Candidate predecessor/successor relationships are explicit.

### Provisional → verified

- Independent reviewer confirms codes and validity dates.
- Source versions and row references are recorded.
- Ambiguities are resolved or represented as separate time-bounded identities.

## Prohibited shortcuts

- Inferring codes from alphabetical position
- Treating a current name as valid for all historical years
- Assigning one identifier across state dissolution or succession without review
- Treating observer-state status as identical across every source system
- Filling missing codes with zero
