<h1 align="center">
  <img alt="VIVA Banner" src="../../Docs/Images/VIVA_BANNER.png">
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

Building on the concept and implementation of [PAVER 2.0](https://github.com/coin-or/paver), the main goal of VIVA is to allow end users to interact with their own uploaded benchmark data from mathematical optimization problems and their solvers. The data is presented in a tabular format, with the added ability to visualize specific results through various plots, making it easier to understand and interpret the data. 

Demo-data is attained from [miplib2010 examples](https://github.com/coin-or/Paver/tree/master/examples/miplib2010). The `.solu` file data from the problem libraries [MINLPLib](https://www.minlplib.org/minlplib.solu), [MIPLIB 2017](https://miplib.zib.de/downloads/miplib2017-v26.solu) and [MIPLIB 2010](https://miplib2010.zib.de/download/miplib2010_all.solu) can be used directly with the **Best-known bounds** selector in the navigation bar.

This project is developed using:
- TypeScript
- DataTables.js
- jQuery
- mathjs
- Chart.js
- Webpack
- Bootstrap & Bootstrap Icons

The application can be run without a live server since Webpack is responsible for bundling the files. It is also possible to install it as a Progressive Web Application by launching the project in a live server, navigating to the report page using a compatible browser, and installing it. Currently, this gives access to notifications when a table or graph has been successfully rendered with results. Support for offline functionality is also included in the PWA implementation. Additional PWA functionality will be added during development.

<div style="text-align:left;">
  <img alt="Overview of the VIVA system" src="../../Docs/Images/OverView_system_new.png" width="100%">
</div>

## Documentation

- **[User Guide](./USER_GUIDE.md)**: how to load the data, use the pages, and the supported file formats (`.trc`, `.json`, `.csv`, `.solu`). It is also the **Documentation** item in the **Help** menu of the application.
- **Developer documentation** (this page and the API reference): how the code is organized and built.

## Project Layout

- `Src/Scripts/Main.ts`: the entry point. It imports the styles and starts the application.
- `Src/Scripts/App/`: the startup, the state shared by the pages, and which page is open.
- `Src/Scripts/Pages/`: the handlers of each page. The plot pages are registered in `PlotRegistry`.
- `Src/Scripts/`: also `Actions`, `Chart`, `Constants`, `DataProcessing`, `DataTable`, `Elements`, `Interfaces`, `PWA` and `UserConfiguration`.
- `Src/Templates/`: the source of the HTML pages (`pages.mjs`, `layout.mjs`, `partials/`, `fragments/`).
- `report.html` and `Src/Pages/*.html`: **generated** from the templates, but committed, so the application opens from the file system. Change the templates and run `npm run build:pages`.
- `Tests/`: the unit tests (Jest) and the browser tests (`Tests/E2E`, Playwright).
- `Dist/`, `Docs/` and `Release/`: generated output.

## Working with the Codebase

### Prerequisites

Before getting started, make sure you have the following software installed on your machine:

    Node.js: https://nodejs.org/
    TypeScript: https://www.typescriptlang.org/
    Webpack: https://webpack.js.org/

Install the required packages by running: 
    
    npm install

### Bundling
Navigate to the project directory in your terminal and run:

    npm run build

This builds the application with webpack and then writes the cache list and cache name into `service-worker.js`. The created `bundle.js` and `main.css` are located in `Dist/`. `npm run check:sw` fails if the generated block of `service-worker.js` is out of date.

Dev server can be run with:

    npm start

### Other Scripts

Run unit tests using Jest:
    
    npm run test:functions

Run the unit tests with coverage:

    npm run test:coverage

Run the browser tests with Playwright (run `npm run build` first, and `npx playwright install chromium` once):

    npm run test:ui

Regenerate the HTML pages (`report.html` and `Src/Pages/*.html`) from `Src/Templates`, and check that they are up to date:

    npm run build:pages
    npm run check:pages

Lint the project files using ESLint:

    npm run lint

To automatically fix linting issues:
    
    npm run lint:fix

Generate documentation using TypeDoc:

    npm run build:docs

Create a slimmed down release build using gulp:

    npm run release

Create a slimmed down web release build using gulp:

    npm run release:web
