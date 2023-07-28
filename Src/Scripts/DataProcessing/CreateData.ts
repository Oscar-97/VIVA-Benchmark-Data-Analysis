export function CreateDataTrc(traceData: object[]): string[] {
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
