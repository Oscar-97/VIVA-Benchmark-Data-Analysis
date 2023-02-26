/**
 * Merge TrcData and InstanceData, on matching object keys.
 * @param TrcData Results data.
 * @param InstanceData Instance information data.
 * @returns MergedData
 */
export function MergeInstanceData(
  TrcData: any[],
  InstanceData: any[]
): string[] {
  const MergedData = [];

  for (const obj1 of TrcData) {
    for (const obj2 of InstanceData) {
      if (obj1.InputFileName === obj2.name) {
        const MergedObj = Object.assign({}, obj1, obj2);
        MergedData.push(MergedObj);
        break;
      }
    }
  }
  console.log("TrcData with instanceinformation: ", MergedData);

  if (MergedData.length === 0) {
    console.log("No matching filenames found in both arrays.");
  }
  return MergedData;
}

/**
 *
 * @param TrcData
 * @param SoluData
 * @returns
 */
export function MergeSoluData(TrcData: any[], SoluData: any[]): string[] {
  const MergedData = [];

  for (const obj1 of TrcData) {
    for (const obj2 of SoluData) {
      if (obj1.InputFileName === obj2.InputFileName) {
        const MergedObj = Object.assign({}, obj1, obj2);
        MergedData.push(MergedObj);
        break;
      }
    }
  }
  console.log("TrcData with Solu information: ", MergedData);

  if (MergedData.length === 0) {
    console.log("No matching filenames found in both arrays.");
  }
  return MergedData;
}
