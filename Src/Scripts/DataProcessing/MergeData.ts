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
	const mergedData: TraceData[] = [];
	const allProps = new Set<string>();

	traceData.forEach((obj) =>
		Object.keys(obj).forEach((key) => allProps.add(key))
	);
	data.forEach((obj) => Object.keys(obj).forEach((key) => allProps.add(key)));

	// The first entry of data that matches by InputFileName or by name is the one that is merged.
	const indexByInputFileName = new Map<unknown, number>();
	const indexByName = new Map<unknown, number>();
	data.forEach((dataObj, index) => {
		if (
			dataObj["InputFileName"] &&
			!indexByInputFileName.has(dataObj["InputFileName"])
		) {
			indexByInputFileName.set(dataObj["InputFileName"], index);
		}
		if (dataObj["name"] && !indexByName.has(dataObj["name"])) {
			indexByName.set(dataObj["name"], index);
		}
	});

	for (const traceDataObj of traceData) {
		const matchIndexes = [
			indexByInputFileName.get(traceDataObj["InputFileName"]),
			indexByName.get(traceDataObj["InputFileName"])
		].filter((index): index is number => index !== undefined);
		const dataObj =
			matchIndexes.length > 0 ? data[Math.min(...matchIndexes)] : undefined;

		const mergedObj: Record<string, unknown> =
			dataObj === undefined
				? { ...traceDataObj }
				: { ...traceDataObj, ...dataObj };
		allProps.forEach((prop) => {
			if (mergedObj[prop] === undefined) {
				mergedObj[prop] = null;
			}
		});
		mergedData.push(mergedObj as TraceData);
	}
	return mergedData;
}
