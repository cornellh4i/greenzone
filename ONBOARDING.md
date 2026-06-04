# GreenZone — Developer Onboarding & Repo Guide

> Orientation for working on the GreenZone web app. GreenZone is an early-warning platform
> that visualizes Mongolian rangeland health (carrying capacity & vegetation anomalies) for
> herders and policymakers.

## Two separate repositories

| Repo | Path | What it is |
| --- | --- | --- |
| **Web app** | `/Users/turbold/Documents/greenzone` (this repo) | Next.js frontend + Express/Supabase backend |
| **ML pipeline** | `/Users/turbold/Documents/greenzone_ml` | Python (uv) — predicts biomass / carrying capacity from satellite, climate & soil data |

They are **independent git repos**. The web app reads model results out of **Supabase**; it does
not import the Python code directly.

---

## Web app (`greenzone`)

```
frontend/   Next.js app (Pages Router), MUI, deck.gl + MapLibre, i18n (en/mn)
backend/    Express API over Supabase (Postgres)
```

### Frontend (`frontend/`)
- **Routing:** Next.js **Pages Router** (`frontend/src/pages/*.tsx`) — *not* the App Router, despite
  the top-level README's wording. Each file is a route (`about.tsx` → `/about`, etc.).
- **Navigation:** `src/components/molecules/NavBar.tsx` and `src/components/molecules/Footer.tsx`.
  Tabs: Home, About, **Insights**, Methodologies, Platform. ⚠️ **Insights, Methodologies, and
  Platform currently all point to `/test`** — a "Coming Soon" placeholder (`src/pages/test.tsx`).
- **The map** (the core feature) lives at `src/components/organisms/Map.tsx`, rendered by the
  `src/pages/monitoring-platform.tsx` page:
  - **MapLibre GL** base map (style fetched from the backend `/maps` → CartoDB Positron) +
    **deck.gl** overlays.
  - Administrative boundaries (`PolygonLayer`): provinces (aimags) and counties (soums).
  - Data layer (`ScatterplotLayer`): **hexbin point "cells"**, colored/filtered by category.
  - Controls: year + layer-type switch in `src/components/molecules/TopPanelLayerTypeSwitch.tsx`;
    layer enum in `src/utils/global.ts`; backend base URL in `src/utils/const.tsx`.
- **i18n:** `src/i18n.ts` statically imports namespace JSON from `public/en/*.json` and
  `public/mn/*.json`. To add translated text you add a JSON file per language and register the
  namespace in `i18n.ts` (`resources` + the `ns` array). Language toggle is in the NavBar.
- **Static assets:** `frontend/public/` (images, fonts, flags, locale JSON).
- **Reference data files** (the hexbin grid geometry, not fetched at runtime today):
  `src/components/charts/data/green_zone_hex_map.geojson`, `greenzone_hex_map.csv`,
  `greenzone_hex_map.shp`.

### Backend (`backend/`)
- Express + TypeScript (`src/index.ts`, `src/server.ts`, routes in `src/routes.ts`).
- Talks to **Supabase** (Postgres) via `src/db/postgresconn.ts`. Map data is served through
  **Postgres RPC functions**, not raw table reads:
  - `getCellValuesbyYearandCtype` → RPC `get_circle_data_by_category(selected_year, category_type, gte, lte)`
  - `getYearOptions` → RPC `get_years`
  - `getCellCategorySummary` → RPC `get_category_summary`
  - (see `src/controller/Cell.ts`, `Province.ts`, `County.ts`)
- **What the map understands today:** exactly two classification types — **`carrying_capacity`**
  and **`z_score`** — for **years 2011–2022**, returned as hexbin **points** each with a `z_score`
  value and a percentile bound (`gte`/`lte`, 0.0–1.0). There are **no `/ml/*` endpoints**.

### Data flow (map)
```
User picks year + layer type (monitoring-platform.tsx)
  → Map.tsx fetches  GET /cells/{year}/{carrying_capacity|z_score}/{lower}/{upper}
  → backend Cell.ts  → Supabase RPC get_circle_data_by_category
  → returns hexbin point cells (wkb_geometry point + z_score)
  → deck.gl ScatterplotLayer renders them on the MapLibre base map
```

---

## ML pipeline (`greenzone_ml`)

- **Purpose:** predict **rangeland biomass** and **livestock carrying capacity** across Mongolia
  from satellite imagery, climate (ERA5), soil (HWSD), and ground-truth stations. Runs with
  [`uv`](https://github.com/astral-sh/uv): `uv sync`, then `uv run python scripts/...`.
- **Spatial/temporal unit:** today the pipeline works **per-soum** (admin district, `asid` IDs)
  for **2007–2020**. Key code: `scripts/run_ml_training.py`, `src/greenzone/models/train.py`,
  zonal/spatial tooling in `src/greenzone/analysis/zonal.py` and `scripts/extract_zonal_station_data.py`,
  carrying-capacity logic in `src/greenzone/features/carrying_capacity.py`, anomaly/z-scores in
  `src/greenzone/analysis/anomaly.py`.
- **Export/sync (designed, not yet wired to this site):** `scripts/run_dashboard_export.py` and
  `scripts/sync_to_supabase.py` (→ `src/greenzone/dashboard/supabase_sync.py`) describe a per-soum
  GeoJSON export + Supabase sync. **These outputs are not generated yet** (`data/dashboard_exports/`
  is empty, no migration SQL present) and they target **per-soum** tables — a *different* schema
  from the website's hexbin `cells`. See `ARCHITECTURE.md` / `DEVELOPMENT_GUIDE.md` in that repo.

### The gap that "update the maps" must bridge
The model predicts **per-soum / per-pixel** values; the website map renders **per-hexbin** cells
keyed by `carrying_capacity` / `z_score`. Updating the maps from the models therefore requires a
**spatial transfer** (zonal aggregation of model output onto the hex grid) and a **loader that
writes the website's `cells` table** (not the per-soum tables). No frontend rebuild is needed to
refresh the existing two layers.

---

## Toolchain & CI

- **npm is the real package manager** for `frontend/` and `backend/` — each has its own
  `package-lock.json`, and Dependabot is configured for the npm ecosystem (`.github/dependabot.yml`).
- The **root** `.pnp.cjs`, `yarn.lock`, and `package-lock.json` are stale stubs (~157 bytes) — ignore
  them. (`backend/` also has a leftover `yarn.lock`; harmless.)
- **CI is currently disabled:** `.github/workflows/pull_request.yml` (build/test) is fully commented
  out. Only `dependabot_auto_merge.yml` runs, and Dependabot is limited to **minor/patch** bumps —
  so major-version security fixes must be applied manually.

### Common commands
```bash
# Frontend
cd frontend && npm install && npm run dev      # http://localhost:3000
cd frontend && npm run build

# Backend
cd backend && npm install && npm start         # ts-node src/index.ts
cd backend && npm test                          # Jest

# Security audit (per folder)
cd frontend && npm audit
cd backend  && npm audit
```

---

## Where to work, by task

| Task | Primary place to work |
| --- | --- |
| **Add LinkedIn blogs under Insights** | `frontend/` — new `pages/insights.tsx` (+ `pages/insights/[slug].tsx`), a content store, `insights` i18n namespace, and repoint NavBar/Footer from `/test` to `/insights`. |
| **Update the maps from the models** | Mostly `greenzone_ml/` — train the hexbin classifier, generate z-scores, aggregate onto the hex grid, then a loader that upserts the website's Supabase `cells`. Web side usually unchanged. |
| **Fix dependency vulnerabilities** | `frontend/` and `backend/` — `npm audit fix` (safe), verify build/tests. |
```
