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
