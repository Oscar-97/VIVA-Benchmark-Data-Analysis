<h1 align="center">
  <img alt="VIVA Banner" src="Docs/Images/VIVA_BANNER.png">
</h1>

<p align="center">
<a href="https://github.com/Oscar-97/VIVA-Benchmark-Data-Analysis/releases">
    <img alt="Releases" src="https://img.shields.io/github/v/release/Oscar-97/VIVA-Benchmark-Data-Analysis"/>
</a>
<a href="https://github.com/Oscar-97/VIVA-Benchmark-Data-Analysis?tab=MIT-1-ov-file#readme">
    <img alt="License" src="https://img.shields.io/badge/License-MIT-brightgreen"/>
</a>
<img alt="Languages" src="https://img.shields.io/github/languages/count/Oscar-97/VIVA-Benchmark-Data-Analysis"/>
<img alt="TypeScript" src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white"/>
<img alt="Webpack" src="https://img.shields.io/badge/webpack-%238DD6F9.svg?style=flat&logo=webpack&logoColor=black"/>
<img alt="Bootstrap" src="https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=flat&logo=bootstrap&logoColor=white"/>
<img alt="Chart.js" src="https://img.shields.io/badge/chart.js-F5788D.svg?style=flat&logo=chart.js&logoColor=white"/>
</p>

# VIVA – Benchmark Data Analysis

A browser app (PWA) for analyzing benchmark data of optimization solvers. Import trace files (`.trc`, `.solu`, and the other supported formats), then look at the results as tables and charts: performance profiles, solver times, number of nodes and iterations, solution quality and time, termination statuses, and a comparison of two solvers. The demo data and the MIPLIB and MINLPLib libraries can be loaded without files of your own.

The app also runs offline once it has been opened from a web server: a service worker caches the pages and scripts.

## Requirements

- Node.js `^20.19.0 || ^22.13.0 || >=24` and npm, to build and test.
- To only use the app, open `report.html` in a browser. The built files in `Dist/` are committed, so no build is needed for that.

## Scripts

| Command                            | What it does                                                             |
| ---------------------------------- | ------------------------------------------------------------------------ |
| `npm install`                      | Installs the dependencies                                                |
| `npm start`                        | Webpack dev server                                                       |
| `npm run build`                    | Builds `Dist/` and regenerates the cache list of `service-worker.js`     |
| `npm run build:pages`              | Regenerates `report.html` and `Src/Pages/*.html` from `Src/Templates`    |
| `npm run check:pages` / `check:sw` | Fail if the generated pages or the service worker are out of date        |
| `npm run lint` / `lint:fix`        | ESLint and Prettier                                                      |
| `npx tsc --noEmit`                 | Type check                                                               |
| `npm run test:functions`           | Unit tests (jest); also run by the pre-commit hook                       |
| `npm run test:ui`                  | Browser tests (Playwright, headless Chromium); run `npm run build` first |
| `npm run release` / `release:web`  | Packages the app into `Release/`                                         |

## Structure

- `Src/Scripts/` – the TypeScript source. `Main.ts` only starts the app; `App/` holds the startup, `Pages/` the handlers of each page, `DataProcessing/` the parsing and the calculations, `Chart/` the charts and `Elements/` the lazy lookups of page elements.
- `Src/Templates/` – the source of the HTML pages. Edit these, not the pages.
- `Src/CSS/` – styles and icons.
- `Tests/` – unit tests and browser tests, with test data in `Tests/TestData/`.
- `scripts/` – generators for the pages and the service worker.

Generated and committed, so the app opens from the file system and from a plain web server: `report.html`, `Src/Pages/*.html`, `Dist/` and the marked block of `service-worker.js`. Regenerate them with the scripts above instead of editing them. CI checks that they are up to date.

## License

MIT
