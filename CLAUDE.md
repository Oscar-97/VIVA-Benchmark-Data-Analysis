# VIVA – Benchmark Data Analysis

Browser app (PWA) for analyzing optimization-solver benchmark data. TypeScript (strict), webpack, Chart.js, DataTables, jQuery 4, mathjs, Bootstrap 5.

## Commands
- `npm run build` – webpack build to `Dist/`
- `npm start` – webpack dev server
- `npm test` – all jest tests; `npm run test:functions` (unit); `npm run test:ui` (Playwright, needs the app running)
- `npm run lint` / `npm run lint:fix` – eslint + prettier
- `npm run build:docs` – typedoc into `Docs/`
- `npm run release` / `release:web` – gulp packaging into `Release/`
- Type check only: `npx tsc --noEmit`

## Layout
- `Src/Scripts/Main.ts` – entry point
- `Src/Scripts/` – `Actions`, `Chart`, `Constants`, `DataProcessing`, `Datasets`, `DataTable`, `Elements`, `Interfaces`, `PWA`, `UserConfiguration`
- `Src/CSS`, `Src/Pages` – styles and HTML
- `Tests/` – `Function.test.ts`, `UI.test.ts`, test data
- `Dist/`, `Docs/`, `Release/` – generated output

## Conventions (see `.eslintrc.json`)
- Functions PascalCase; variables camelCase or UPPER_CASE; classes PascalCase; parameters camelCase
- Explicit return types on all functions
- Prettier formatting
- Pre-commit hook runs `test:functions` and `lint:fix`

## Rules
- Don't hand-edit `Dist/`, `Docs/`, `Release/`; regenerate them with the scripts above.
- Don't commit `build_errors.txt` or `report.html`.
- Before finishing a change, run `npm run lint` and `npm run test:functions`.
