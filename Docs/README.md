# VIVA: Visualize and Analyze Benchmarking Data for Optimization Solvers
This is a project in **progress** for creating a dynamic reporting system, in a portable HTML format, based on benchmark results from mathemathical optimization problems and their solvers. The main goal of this project is to enable the end user to be able to interact with the benchmark data in a tabular format and visualize specific results by using different plots, making it easier for them to understand and interpret the data.

<div style="text-align:left;">
  <img src="./Images/OverView.png" width="100%">
</div>

---
# Instructions for 

## Using the System
To get started with the project, clone the repository and open the `report.html` file in a web browser. Select a `traceresult.trc` or `solvedata.txt`, `UserConfiguration.json` file from your computer by clicking the "Browse" button and selecting a file from the file picker that appears.
Once you have selected a file, click on the View All Results button to get a table with the benchmark results.
## Supported Formats

## .trc

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

## .txt 

The following header structure and order should be used in conjunction with .txt files, where the instance should feature
    
    name,
    #Vars,
    #Disc,
    #Equs,
    Dir,
    Dual bound,
    Primal bound I,

and each solver should have 

    TermStatus
    Dual bound,
    DualGap,
    Primal bound,
    PrimGap Gap[%],
    Time[s],
    Nodes I

## .json
The file should include `dataSet`, `dataFileType` and `checkedSolvers`.

--- 

# Features to Implement

## Table Page
- [ ] Calculate new columns for .trc files.
- [ ] SearchBuilder
- [ ] Filter columns

## Plot Page
- [ ] Add more plotting types.
- [ ] Export plot data as csv.
- [ ] Fix destruction on Chart.js canvas.

## Other
- [ ] Add DocType support.
- [ ] Update the 'Working with codebase' chapter below.

# Working with the Codebase
## 1. Prerequisites

Before getting started, make sure you have the following software installed on your machine:

    Node.js: https://nodejs.org/
    TypeScript: https://www.typescriptlang.org/
    Webpack: https://webpack.js.org/

Install the required packages by running: 
    
    npm install

## 2. Compiling
Navigate to the project directory in your terminal and run:

    npm run build

This runs the command "webpack --config webpack.config.js", which will build the application using webpack and the configuration file 'webpack.config.js'.

## 3. Other Scripts
    npm run build-docs
Runs the command "typedoc --options typedoc.json", which will generate documentation for the project using typedoc and the configuration file 'typedoc.json'. The produced documentation is located in the Docs folder.

    npm run lint

Runs the command "eslint . --ext .ts,.tsx,.html", which will lint the code in the current directory for any issues, including files with the extensions '.ts', '.tsx', and '.html'.