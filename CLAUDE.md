# VIVA – Benchmark Data Analysis

Browser app (PWA) for analyzing optimization-solver benchmark data. TypeScript (strict), webpack, Chart.js, DataTables, jQuery 4, mathjs, Bootstrap 5.

## Commands
- `npm run build` – webpack build to `Dist/` (cleaned first), then writes the cache list and cache name into `service-worker.js`; `npm run check:sw` fails if that block is out of date
- `npm start` – webpack dev server
- `npm test` – all jest tests; `npm run test:functions` (unit tests and the checks of the generated files); `npm run test:ui` (Playwright, headless Chromium: the UI tests open the pages via `file://`, the offline test serves the app on localhost; run `npm run build` first)
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
- `Tests/` – unit tests (`Function`, `DataProcessing`, `Parsers`, `ChartData`, `UserConfiguration`, `Pages`), browser tests (`UI`, `ChartPages`, `Offline`), `TestHelpers.ts` and `TestData/`
- `.github/workflows/ci.yml` – CI: lint, types, generated files, unit tests, `npm audit --omit=dev`, then build and browser tests
- `Dist/`, `Docs/`, `Release/` – generated output

## Conventions (see `eslint.config.mjs`)
- Functions PascalCase; variables camelCase or UPPER_CASE; classes PascalCase; parameters camelCase
- Explicit return types on all functions
- Prettier formatting
- Pre-commit hook runs `test:functions` and `lint:fix`

## Rules
- Don't hand-edit `Dist/`, `Docs/`, `Release/`, `report.html`, `Src/Pages/*.html` or the generated block of `service-worker.js`; regenerate them with the scripts above (`test:functions` fails if the pages or the service worker are out of date). `Dist/` stays committed, so run `npm run build` and commit it together with a change to the source.
- The TypeScript settings are strict, including `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`: no `!` and no `any`; handle a missing value (`for...of`, `Object.entries`, `.at(-1)`, an early return).
- Don't commit `build_errors.txt`.
- Before finishing a change, run `npm run lint` and `npm run test:functions`.
