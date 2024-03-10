/**
 * This function converts an array of objects into an array of strings for .trc file format, to be able to save it to local storage.
 *
 * @param {object[]} traceData - Array of objects containing the result data.
 * @returns Array of strings, where each string is a comma-separated representation of a row of data.
 *
 * @remarks
 * This function takes in an array of objects, and converts it into an array of strings,
 * where each string is a comma-separated list of the object's property values. The keys of the first object
 * in the array are used to create a header string that is prepended to the output array.
 * The header string is prefixed with an asterisk(*) character to match the .trc file format.
 */
export function CreateNewTraceData(traceData: object[]): string[] {
	const exportData: string[] = [];
	/**
	 * Create headers line based on existing keys, then add the rest of the objects.
	 */
	const keys = Object.keys(traceData[0]);
	const headerString = "* " + keys.join(",");
	exportData.push(headerString);

	for (let i = 0; i < traceData.length; i++) {
		const currentObject = traceData[i];
		const currentString = Object.values(currentObject).join(",");
		exportData.push(currentString);
	}

	return exportData;
}
