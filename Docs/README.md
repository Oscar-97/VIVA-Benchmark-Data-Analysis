# Dynamic Report Tool for MINLP Benchmarks
This is a project in progress for creating a dynamic reporting system, in a HTML format, based on benchmark results from solved mathemathical optimization problems. The main goal of this project is to visualize specific results, making it easiier for end users to understand and interpret the benchmarks.

<div style="text-align:left;">
  <img src="./Images/OverView.png" width="100%">
</div>

---
# Instructions for 

## Using the System
To get started with the project, clone the repository and open the `report.html` file in a web browser. Select a `traceresult.trc` or `solvedata*.txt` file from your computer by clicking the "Browse" button and selecting a file from the file picker that appears.
Once you have selected a file, click on the solvers that you want to see the result for and click on view selection to get the data in a tabular or chart format.

## Supported Formats

## .trc

The following header structure and order should be used in conjunction with .trc files:

`"filename",   
"modeltype", 
"solvername", 
"NLP def",    
"MIP def",    
"juliantoday",
"direction", 
"equnum",     
"varnum",	 
"dvarnum",    
"nz",       
"nlnz",    
"optfile",   
"modelstatus",  
"solvestatus",
"obj",    
"objest",    
"res used",   
"iter used",
"dom used",
"nodes used",
"user1"`

## .txt 

The following header structure and order should be used in conjunction with .txt files, where the instance should feature `name #Vars #Disc #Equs Dir Dual bound Primal bound I` and each solver should have `TermStatus Dual bound DualGap Primal bound PrimGap Gap[%] Time[s] Nodes I`.

--- 

# Features to Implement
## General
- [ ] Add support for saving as configuration as JSON.
    - [ ] Visible data (Selected rows CreateData.ts)
    - [ ] Solvers

## Table Page
- [ ] Calculate new columns for trc files.
- [ ] Hover on problem to get more in-depth details. (Using InstanceData)
- [ ] Clear table after importing new data.

## Plot Page
- [ ] Add support for custom X/Y values.
- [ ] Add more plotting types. (Selected from navbar -> plots -> type)
- [ ] Export plot data as csv.
- [ ] Fix destruction on Chart.js canvas.

## Other
- [ ] Add DocType support.
- [ ] Update the 'Working with codebase' chapter.

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