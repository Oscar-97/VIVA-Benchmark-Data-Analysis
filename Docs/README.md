![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white) ![Bootstrap](https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=flat&logo=bootstrap&logoColor=white) ![Webpack](https://img.shields.io/badge/webpack-%238DD6F9.svg?style=flat&logo=webpack&logoColor=black) ![Chart.js](https://img.shields.io/badge/chart.js-F5788D.svg?style=flat&logo=chart.js&logoColor=white)

# VIVA: Visualize, Interact, Verify, and Analyze Benchmarking Data for Optimization Solvers
---
Building on the concept and implementation of [PAVER 2.0](https://github.com/coin-or/paver), the main goal of this project is to allow end users to interact with their own uploaded benchmark data from mathematical optimization problems and their solvers. The data is presented in a tabular format, with the added ability to visualize specific results through various plots, making it easier to understand and interpret the data. 

This project is developed using TypeScript, DataTables.js, Chart.js and Webpack. Bootstrap is used for styling.  Notably, the application can be run without a live server since Webpack is responsible for bundling the files.

<div style="text-align:left;">
  <img src="./Images/OverView_system_new.png" width="100%">
</div>

## Instructions for using the system
- To get started with the project, either download or clone the repository and open the `report.html` file in a web browser. 
- Click the "Browse" button to upload the results and select either:
    - one or more results file in a `.trc` format.
        - .solu (best known primal and dual bounds for each instance) and .csv (instance properties) can be uploaded in conjugation to get additional information.
    - or a single `.txt` based on the PAVER format.
    - or a single `UserConfiguration.json` (Which can be created from this application).
- Once you have selected a file, click on upload.
- Click on the View All Results/View Plot button to get a table or plot with the benchmark results, depending on the currently active page.
### Table Page

- On the table page, View Selected Problems filters the table and only shows selected problems.
- Save Data stores the currently uploaded data to local storage, if the above mentioned filtering has been applied, then that currently visible table will be stored.
- The stored data can be downloaded as a `UserConfiguration.json` by clicking on the Download Saved Data button.
- Download Table as CSV downloads the currently visible table in a csv format.
- Delete Data removes all stored data from the local storage.
- Clear Data Table clears the currently visible table.
- The filter options on the table page can be collapsed and expanded.

### Supported Formats

### .trc

See: https://www.gamsworld.org/performance/trace.htm
The following header structure and order should be used in conjunction with .trc files:

    "InputFileName",
    "ModelType",
    "SolverName",
    "NLP",
    "MIP",
    "JulianDate",
    "Dir",
    "Equs",
    "Vars",
    "Disc",
    "NumberOfNonZeros",
    "NumberOfNonlinearNonZeros",
    "OptionFile",
    "ModelStatus",
    "TermStatus",
    "PrimalBoundSolver",
    "DualBoundSolver",
    "Time[s]",
    "NumberOfIterations",
    "NumberOfDomainViolations",
    "Nodes[i]",
    "UserComment",

### .txt 

The following header structure and order should be used in conjunction with .txt files, where the instance should feature:
    
    name,
    #Vars,
    #Disc,
    #Equs,
    Dir,
    Dual bound,
    Primal bound I,

and each solver should have:

    TermStatus
    Dual bound,
    DualGap,
    Primal bound,
    PrimGap Gap[%],
    Time[s],
    Nodes I

### .json
The file should include `dataSet` and `dataFileType`, it is optionally to have a `checkedSolvers`.

```json
{
    "dataSet": [
        "alan,MINLP,shot,NONE,CPLEX,43381.77804,min,8,9,4,24,3,1,8,Normal,2.925,2.925,0.041120867,0,0,0,#,2.925,2.925,2.925,2.925,0,0,0,0,0"
    ],
    "dataFileType": "trc",
    "checkedSolvers": []
}
```

--- 

## Working with the Codebase
### 1. Prerequisites

Before getting started, make sure you have the following software installed on your machine:

    Node.js: https://nodejs.org/
    TypeScript: https://www.typescriptlang.org/
    Webpack: https://webpack.js.org/

Install the required packages by running: 
    
    npm install

### 2. Bundling
Navigate to the project directory in your terminal and run:

    npm run build

This runs the command "webpack --config webpack.config.js", which will build the application using webpack'. The created `bundle.js` and `main.css` are located in `Dist/`.

### 3. Other Scripts

Run unit tests using Jest:
    
    npm run test:unit

Run UI tests with Playwright using Jest:

    npm run test:ui

Lint the project files using ESLint:

    npm run lint

To automatically fix linting issues:
    
    npm run lint:fix

Generate documentation using TypeDoc:

    npm run build-docs