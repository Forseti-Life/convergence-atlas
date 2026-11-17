# Natural Earth map boundaries

The map uses Natural Earth 1:50m Admin 0 Countries, which is public-domain
vector data, not copyrighted tiles or imagery. It is served locally with
no external map runtime or tracking.

- Source: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_admin_0_countries.geojson
- Terms: https://www.naturalearthdata.com/about/terms-of-use/
- License: https://github.com/nvkelso/natural-earth-vector/blob/master/LICENSE.md
- Retrieved: 2026-10-20
- Generated artifact: `web/world-boundaries.mjs` (source SHA-256 in its header).

To regenerate, download the source GeoJSON and run
`python3 research/generate_world_boundaries.py /path/to/source.geojson`.
The generator quantizes coordinates to 0.01 degrees, maps geographic names
to the model's 195 country names, and fails if any modeled country is missing.
Unmodeled territories remain geographic context; no political assignment
is inferred from Natural Earth's sovereignty attributes. Borders are
illustrative and do not endorse territorial claims.
