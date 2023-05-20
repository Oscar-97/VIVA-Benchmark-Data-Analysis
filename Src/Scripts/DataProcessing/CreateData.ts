export function CreateDataTrc(TrcData: object[]): string[] {
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
