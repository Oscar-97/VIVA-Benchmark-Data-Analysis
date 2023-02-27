export function CreateData(
  Instance: string,
  Solvers: string[],
  InstanceLabels: string[],
  DataLabels: string[],
  ProblemList: string[],
  ResultsData: string[]
): string[] {
  const output: any[] = [];
  const delimiter = " ";
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

export function CreateDataTrc(TrcData: string[]): string[] {
  console.clear();
  console.log("Data to exported: ", TrcData);
  const ExportData: string[] = [];
  /**
   * Create headers line based on existing keys, then add the rest of the objects.
   */
  const Keys = Object.keys(TrcData[0]);
  const HeaderString = "* " + Keys.join(",");
  ExportData.push(HeaderString);

  for (let i = 0; i < TrcData.length; i++) {
    const currentObject = TrcData[i];
    const currentString = Object.values(currentObject).join(",");
    ExportData.push(currentString);
  }

  console.log("Exported Data: ", ExportData);
  return ExportData;
}
