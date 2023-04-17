/**
 * Merge data on matching object keys.
 * @param TrcData Results data.
 * @param Data Instance/Solution information data.
 * @returns MergedData ResultsData with more information.
 */
interface CategoriesObj {
  InputFileName?: string;
  name?: string;
}
export function MergeData(
  TrcData: CategoriesObj[],
  Data: CategoriesObj[]
): object[] {
  const MergedData = [];

  for (const obj1 of TrcData) {
    for (const obj2 of Data) {
      if (obj2.InputFileName) {
        if (obj1.InputFileName === obj2.InputFileName) {
          const MergedObj = Object.assign({}, obj1, obj2);
          MergedData.push(MergedObj);
          break;
        }
      } else if (obj2.name) {
        if (obj1.InputFileName === obj2.name) {
          const MergedObj = Object.assign({}, obj1, obj2);
          MergedData.push(MergedObj);
          break;
        }
      }
    }
  }
  console.log("New TrcData: ", MergedData);

  if (MergedData.length === 0) {
    console.log("No matching objects when merging data.");
  }
  return MergedData;
}
