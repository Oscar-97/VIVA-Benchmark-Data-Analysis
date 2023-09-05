/**
 * Interface representing a categories object with optional `InputFileName` and `name` properties.
 */
interface CategoriesObj {
	InputFileName?: string;
	name?: string;
}

/**
 * Merges two arrays of objects based on matching `InputFileName` or `name` properties.
 *
 * @param traceData - An array of objects to be merged with `data`. Each object must have at least an `InputFileName` or `name` property.
 * @param data - An array of objects to be merged with `traceData`. Each object must have at least an `InputFileName` or `name` property.
 * @returns Array of merged objects.
 *
 * @remarks
 * This function merges two arrays of objects (`traceData` and `data`) based on the `InputFileName` or `name` properties.
 * If an object in `traceData` has the same `InputFileName` or `name` as an object in `data`, the two objects are merged
 * into a single object with properties from both.
 */
export function MergeData(
	traceData: CategoriesObj[],
	data: CategoriesObj[]
): object[] {
	const mergedData = [];

	for (const traceDataObj of traceData) {
		let isMatchFound = false;
		for (const dataObj of data) {
			if (
				(dataObj.InputFileName &&
					traceDataObj.InputFileName === dataObj.InputFileName) ||
				(dataObj.name && traceDataObj.InputFileName === dataObj.name)
			) {
				const mergedObj = Object.assign({}, traceDataObj, dataObj);
				mergedData.push(mergedObj);
				isMatchFound = true;
				break;
			}
		}
		if (!isMatchFound) {
			mergedData.push(traceDataObj);
		}
	}
	return mergedData;
}
