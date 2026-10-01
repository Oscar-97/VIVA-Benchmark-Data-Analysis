/**
 * The mutable state shared between the application modules.
 *
 * @property {string} dataFileType - Type of file extension for the imported data. As of now, either one or more .trc or a single .json. Text based files were removed.
 * @property {number | undefined} defaultTime - The default time for the performance profile chart.
 * @property {number | undefined} gapLimit - Gap limit value for the performance profile chart.
 * @property {string[]} unprocessedData - Raw data of the imported benchmark results.
 * @property {string[]} unprocessedInstanceInformationData - Unprocessed instanceinfo.csv containing properties.
 * @property {string[]} unprocessedSolutionData - Unprocessed minlplib.solu. Best known primal and dual bounds for each instance.
 * @property {object[]} chartData - Processed data used in the different charts.
 */
export interface AppState {
	dataFileType: string;
	defaultTime: number | undefined;
	gapLimit: number | undefined;
	unprocessedData: string[];
	unprocessedInstanceInformationData: string[];
	unprocessedSolutionData: string[];
	chartData: object[];
}

function CreateInitialState(): AppState {
	return {
		dataFileType: "",
		defaultTime: undefined,
		gapLimit: undefined,
		unprocessedData: [],
		unprocessedInstanceInformationData: [],
		unprocessedSolutionData: [],
		chartData: []
	};
}

export const state: AppState = CreateInitialState();

/**
 * Resets the state to its initial values.
 * This occurs when the table is cleared and the program is initialized again.
 */
export function ResetAppState(): void {
	Object.assign(state, CreateInitialState());
}
