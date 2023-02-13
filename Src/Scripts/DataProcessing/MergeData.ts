/**
 * Merge TrcData and InstanceData, on matching object keys.
 * @param TrcData Results data.
 * @param InstanceData Instance information data.
 * @returns MergedData
 */
export function MergeData(TrcData: any[], InstanceData: any[]) {

    let MergedData = [];
    
    for (const obj1 of TrcData) {
        for (const obj2 of InstanceData) {
          if (obj1.filename === obj2.name) {
            console.log("found.");
            let mergedObj = Object.assign({}, obj1, obj2);
            MergedData.push(mergedObj);
            break;
          }
        }
    }
    console.log("MergedData", MergedData)
    return MergedData;
}