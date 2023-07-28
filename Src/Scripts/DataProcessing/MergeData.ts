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
	traceData: CategoriesObj[],
	data: CategoriesObj[]
): object[] {
	const mergedData = [];

	for (const obj1 of traceData) {
		for (const obj2 of data) {
			if (obj2.InputFileName) {
				if (obj1.InputFileName === obj2.InputFileName) {
					const mergedObj = Object.assign({}, obj1, obj2);
					mergedData.push(mergedObj);
					break;
				}
			} else if (obj2.name) {
				if (obj1.InputFileName === obj2.name) {
					const mergedObj = Object.assign({}, obj1, obj2);
					mergedData.push(mergedObj);
					break;
				}
			}
		}
	}

	if (mergedData.length === 0) {
		console.log("No matching objects when merging data.");
	}
	return mergedData;
}
