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

Demo-data is attained from [miplib2010 examples](https://github.com/coin-or/Paver/tree/master/examples/miplib2010). The `.solu` file data from the problem libraries [MINLPLib](https://www.minlplib.org/minlplib.solu), [MIPLIB 2017](https://miplib.zib.de/downloads/miplib2017-v26.solu) and [MIPLIB 2010](https://miplib2010.zib.de/download/miplib2010_all.solu) can be accessed directly through a dropdown option in the navigation menu.

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

## Disclaimer
**Performance Note**:  Performance slowdowns may occur when handling a large number of files or particularly large datasets, as this application operates entirely in the browser without relying on a backend server to parse and process the files. 

**Display Note**: While mobile-sized screens are supported, the most optimal experience is achieved using a larger display. A light and a dark theme are available.

**Development Note**:  This project is still a work in progress, and therefore, bugs and unexpected behavior may occur.

## 1. Instructions for Using the Application
1. Download the release ZIP and extract the contents, or clone the repository, or visit the web version at [viva-app.xyz](https://viva-app.xyz/report).
2. Open the file: `report.html` found in the root directory.
3. Click "Browse" to upload results and select either:
   - One or more result files in `.trc` format.
   - `.solu` (best known primal and dual bounds for each instance) and `.csv` (instance properties) files can be uploaded for additional information.
   - A single `UserConfiguration.json` (which can be created from this application).
4. Optionally, select a problem library to use (MIPLIB or MINLPLib).
5. Click "Upload".
6. The table or plot with the benchmark results is shown when the files are loaded, depending on the currently active page. Use the "View Table" or "Update plot" button to show it again after changing the settings. Very large data sets are not shown at once, use the button for them.
7. Available plots include:
   - Performance Profile (Absolute and relative)
   - Solver Time per Solver
   - Solver Time per Instance
   - Number of Nodes
   - Number of Iterations
   - Termination Status
   - Solution Quality
   - Solution Time
8. Compare a pair of solvers via the "Compare Solvers" page. Direct comparison on how many instances the solver time was better, worse, or equal.

### 1.1 General Button Functionality

The data actions are grouped in the **Data** menu:

- **Save to browser**: Save the currently uploaded data to local storage. If filtering has been applied on the table page, then the currently visible table will be stored.
- **Export configuration (.json)**: Download the user configuration (`UserConfiguration.json`).
- **Export with options…**: Customize the downloadable user configuration file.
- **Remove saved data**: Remove the data saved in local storage.

### 1.2 Table Page Button Functionality
- **View Table**: View the table of the uploaded results.
- **Show Selected Rows**: View rows that have been selected from the table.
- **Clear table view** (in the **Data** menu): Clear the current table.
- **Settings**:
  - **Show *n* rows**: The number of rows to show in the table.
  - **Column Visibility**: Select which columns to show or hide.
- **Advanced Search**: Create custom search queries.
- **Toggle Filters**: Show filters for each column.
- **Export**: Export the table as a CSV, copy table content to clipboard, or view it in the browser's print option.

### 1.3 Plot Pages Buttons Functionality
- **View X**: View the page-specific plot.
- **Download Chart Data**: Download the chart data.

### 1.4 Compare Solvers Page Buttons Functionality
- **Compare Solvers**: Show the comparison table between two solvers.

## 2. Supported Formats

### 2.1 .trc

The following header structure and order should be used in conjunction with .trc files, if no header is provided in the result files:

```
InputFileName
ModelType
SolverName
NLP
MIP
JulianDate
Direction
NumberOfEquations
NumberOfVariables
NumberOfDiscreteVariables
NumberOfNonZeros
NumberOfNonlinearNonZeros
OptionFile
ModelStatus
TermStatus
ObjectiveValue
ObjectiveValueEstimate
SolverTime
NumberOfIterations
NumberOfDomainViolations
NumberOfNodes
UserComment
```

For further information, see https://gams.com/latest/docs/UG_SolverUsage.html#UG_SolverUsage_TraceFile.

### 2.2 .json
The file has these fields:

- `version`: The version of the format, currently `2`. A file without it is of version 1, see below.
- `dataSet`: The results, with a row for every solver run.
- `dataFileType`: The kind of data, `"json"` for data that was saved by the application.
- `defaultTime` (optional): The **Time limit (s)** shown in the app. Runs exceeding it are counted as unsolved.
- `gapLimit` (optional): The **Gap limit (%)**. An instance counts as solved when its gap is at or below it.

Every row of `dataSet` is an object. Its keys are the names of the columns of the trace file (see 2.1), and its values are numbers, `true` or `false` where the value is one, and else text. A column that a row does not have is empty. The columns of the first row come first, then the columns that the other rows add.

```json
{
    "version": 2,
    "dataSet": [
        { "InputFileName": "alan", "ModelType": "MINLP", "SolverName": "knitro", "Direction": "min", "SolverTime": 0.142, "Fail": false },
        { "InputFileName": "ball_mk2_30", "ModelType": "MINLP", "SolverName": "knitro", "Direction": "min", "SolverTime": 900.034, "Fail": false },
        { "InputFileName": "ball_mk3_10", "ModelType": "MINLP", "SolverName": "knitro", "Direction": "min", "SolverTime": 0.95, "Fail": true }
    ],
    "dataFileType": "json",
    "defaultTime": 900,
    "gapLimit": 0.1
}
```

The application writes this format when the data is saved to the browser, and when the configuration is exported.

**Version 1.** Earlier versions of the application wrote `dataSet` as a list of the lines of a trace file as text, without a `version`. Such a file is still read, and what is saved or exported from it is in the format above. A file with a version that is higher than the one that the application knows is not read, and the application says so.

```json
{
    "dataSet": [
        "* InputFileName,ModelType,SolverName,Direction,SolverTime,Fail",
        "alan,MINLP,knitro,min,0.142,false",
        "ball_mk2_30,MINLP,knitro,min,900.034,false"
    ],
    "dataFileType": "json"
}
```

## 3. Working with the Codebase

### 3.1 Prerequisites

Before getting started, make sure you have the following software installed on your machine:

    Node.js: https://nodejs.org/
    TypeScript: https://www.typescriptlang.org/
    Webpack: https://webpack.js.org/

Install the required packages by running: 
    
    npm install

### 3.2 Bundling
Navigate to the project directory in your terminal and run:

    npm run build

This builds the application with webpack and then writes the cache list and cache name into `service-worker.js`. The created `bundle.js` and `main.css` are located in `Dist/`. `npm run check:sw` fails if the generated block of `service-worker.js` is out of date.

Dev server can be run with:

    npm start

### 3.3 Other Scripts

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
