# VIVA – Benchmark Data Analysis

Browser app (PWA) for analyzing optimization-solver benchmark data. TypeScript (strict), webpack, Chart.js, DataTables, jQuery 4, mathjs, Bootstrap 5.

## Commands
- `npm run build` – webpack build to `Dist/`
- `npm start` – webpack dev server
- `npm test` – all jest tests; `npm run test:functions` (unit); `npm run test:ui` (Playwright, headless Chromium on `report.html` via `file://`; run `npm run build` first)
- `npm run lint` / `npm run lint:fix` – eslint + prettier
- `npm run build:pages` – regenerate `report.html` and `Src/Pages/*.html` from `Src/Templates`; `npm run check:pages` fails if they are out of date
- `npm run build:docs` – typedoc into `Docs/`
- `npm run release` / `release:web` – gulp packaging into `Release/`
- Type check only: `npx tsc --noEmit`

## Layout
- `Src/Scripts/Main.ts` – entry point, only imports styles and calls `Bootstrap()`
- `Src/Scripts/App/` – startup (`Bootstrap`, `InitializeProgram`, `ManageData`, `GlobalListeners`), shared `AppState`, `GetPageKind`
- `Src/Scripts/Pages/` – per-page handlers (report, plot pages via `PlotRegistry`, compare solvers, common buttons)
- `Src/Scripts/` – `Actions`, `Chart`, `Constants`, `DataProcessing`, `Datasets`, `DataTable`, `Elements`, `Interfaces`, `PWA`, `UserConfiguration`
- `Src/Scripts/Elements/Elements.ts` – the page elements as lazy getters (`elements.fileInput`); looked up on use, so elements created later work. Missing ones throw an error that names them; nullable ones (typed `| null`) exist on some pages only. Use `FindElement(id)` for one-off lookups.
- `Src/Templates/` – the source of the HTML pages: `pages.mjs` (the pages and their buttons), `layout.mjs`, `partials/` (navigation, alert, button catalog) and `fragments/` (page-specific controls and bodies). `scripts/build-pages.mjs` renders them and formats the result with Prettier
- `report.html` (the entry page, used by the manifest, the service worker and the UI tests) and `Src/Pages/*.html` – **generated** from `Src/Templates`, but committed, so the app still opens from the file system. Edit the templates and run `npm run build:pages`, never the pages
- `Src/CSS` – styles
- `Tests/` – `Function.test.ts`, `UI.test.ts`, test data
- `Dist/`, `Docs/`, `Release/` – generated output

## Conventions (see `eslint.config.mjs`)
- Functions PascalCase; variables camelCase or UPPER_CASE; classes PascalCase; parameters camelCase
- Explicit return types on all functions
- Prettier formatting
- Pre-commit hook runs `test:functions` and `lint:fix`

## Rules
- Don't hand-edit `Dist/`, `Docs/`, `Release/`, `report.html` or `Src/Pages/*.html`; regenerate them with the scripts above (`test:functions` fails if the pages are out of date).
- Don't commit `build_errors.txt`.
- Before finishing a change, run `npm run lint` and `npm run test:functions`.
