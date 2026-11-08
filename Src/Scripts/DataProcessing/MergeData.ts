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
 * into a single object with properties from both. Several objects of `data` can match, for example the lines of a
 * .solu file that give the primal bound and the dual bound of an instance one by one. All of them are merged, and where
 * two of them have the same property, the one that comes first in `data` is used.
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

	// The entries of data by InputFileName and by name, in the order of data.
	const indexesByInputFileName = new Map<unknown, number[]>();
	const indexesByName = new Map<unknown, number[]>();
	function Add(
		indexes: Map<unknown, number[]>,
		key: unknown,
		index: number
	): void {
		if (key) {
			indexes.set(key, [...(indexes.get(key) ?? []), index]);
		}
	}
	data.forEach((dataObj, index) => {
		Add(indexesByInputFileName, dataObj["InputFileName"], index);
		Add(indexesByName, dataObj["name"], index);
	});

	for (const traceDataObj of traceData) {
		const matchIndexes = new Set([
			...(indexesByInputFileName.get(traceDataObj["InputFileName"]) ?? []),
			...(indexesByName.get(traceDataObj["InputFileName"]) ?? [])
		]);
		// The entry that comes first is merged last, so its properties are the ones that are kept.
		const mergedObj: Record<string, unknown> = { ...traceDataObj };
		for (const index of [...matchIndexes].sort((a, b) => b - a)) {
			Object.assign(mergedObj, data[index]);
		}
		allProps.forEach((prop) => {
			if (mergedObj[prop] === undefined) {
				mergedObj[prop] = null;
			}
		});
		mergedData.push(mergedObj as TraceData);
	}
	return mergedData;
}
