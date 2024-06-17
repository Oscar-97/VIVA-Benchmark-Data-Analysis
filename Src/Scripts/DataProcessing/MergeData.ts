import { TraceData, CategoriesObj } from "../Interfaces/Interfaces";

/**
 * This function merges two arrays of objects based on matching `InputFileName` or `name` properties.
 *
 * @param {TraceData[]} traceData - Array of objects containing the data to be processed.
 * @param {CategoriesObj[]} data - An array of objects to be merged with `traceData`. Each object must have at least an `InputFileName` or `name` property.
 * @returns Array of merged objects.
 *
 * @remarks
 * If an object in `traceData` has the same `InputFileName` or `name` as an object in `data`, the two objects are merged
 * into a single object with properties from both.
 */
export function MergeData(
	traceData: TraceData[],
	data: CategoriesObj[]
): TraceData[] {
	const mergedData = [];
	const allProps = new Set<string>();

	traceData.forEach((obj) =>
		Object.keys(obj).forEach((key) => allProps.add(key))
	);
	data.forEach((obj) => Object.keys(obj).forEach((key) => allProps.add(key)));

	for (const traceDataObj of traceData) {
		let isMatchFound = false;
		for (const dataObj of data) {
			if (
				(dataObj["InputFileName"] &&
					traceDataObj["InputFileName"] === dataObj["InputFileName"]) ||
				(dataObj["name"] && traceDataObj["InputFileName"] === dataObj["name"])
			) {
				const mergedObj = { ...traceDataObj, ...dataObj };
				allProps.forEach((prop) => {
					if (mergedObj[prop] === undefined) {
						mergedObj[prop] = null;
					}
				});
				mergedData.push(mergedObj);
				isMatchFound = true;
				break;
			}
		}
		if (!isMatchFound) {
			const objWithAllProps = { ...traceDataObj };
			allProps.forEach((prop) => {
				if (objWithAllProps[prop] === undefined) {
					objWithAllProps[prop] = null;
				}
			});
			mergedData.push(objWithAllProps);
		}
	}
	return mergedData;
}
