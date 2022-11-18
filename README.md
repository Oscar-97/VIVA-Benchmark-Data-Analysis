### Data Visualization Project
This is a project in progress for creating a dynamic reporting system, in a HTML format, for SHOT benchmark results.

---
### Instruction
1. Run the `report.html` with a liver server.
2. Place the `solvedata.txt` in the same directory as the report.
3. The dynamic report should now be accessible by navigating to the liver servers address.
--- 
### TODO
- Make the filtering of the raw data more dynamic.
- Display data in BS4 table.
    - Filters for the data.
    - Dynamic resizing.
- Display plots for results.
- Import the data by uploading the data-file.
 
TODO:
Output the filtered data to the console to check that it is 
somewhat correct when using the filter function.
Needs to be a lot more dynamic/flexible when importing the data when the number of solvers i changed.
Count the number of data labels until they repeat, then assign the value to each one of the respective data results.
Example: array[1-4], array[5-9], array[9-14]
