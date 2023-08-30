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
 *
 * If no matches are found, the function logs a message to the console and returns an empty array.
 */
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
		console.log("No matching objects when merging data. Returning trace data.");
		return traceData;
	}
	return mergedData;
}
