export function CreateData(Instance:string, Solvers: any[], InstanceLabels: any[], DataLabels: any[], ProblemList: any[], ResultsData: any[]) {
    let output: any[] = [];
    let delimiter = " ";
    output.push([Instance].concat(Solvers));
    output.push([InstanceLabels.join(delimiter)].concat(DataLabels));
    console.log("Output: ", output);
    console.log("Add problemlist and data....");
    /**
     * TODO:
     * Add problemlist and results.
     */
    return output;
}

export function CreateDataTrc(TrcData: any[]) {
    console.clear();
    console.log("Data to exported: ", TrcData);
    let ExportData: string[] = [];
    /**
     * Create headers line based on existing keys, then add the rest of the objects.
     */
    let Keys = Object.keys(TrcData[0]);
    let HeaderString = "* " + Keys.join(",");
    ExportData.push(HeaderString);

    for (let i = 0; i < TrcData.length; i++) {
        let currentObject = TrcData[i];
        let currentString = Object.values(currentObject).join(",");
        ExportData.push(currentString);
    }

    console.log("Exported Data: ", ExportData);
    return ExportData;
}
