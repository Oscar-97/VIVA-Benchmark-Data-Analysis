import { ExtractTraceData } from "../DataProcessing/FilterData";
import { ProcessData } from "../DataProcessing/ProcessTraceData";
import { elements } from "../Elements/Elements";
import { DescribeTraceData, ShowLoadStatus } from "../Elements/LoadStatus";
import { Values } from "../Constants/Values";
import { TraceData } from "../Interfaces/Interfaces";
import { HandleCommonButtons } from "../Pages/CommonButtons";
import { HandleCompareSolversPage } from "../Pages/CompareSolversPage";
import { HandlePlotPages } from "../Pages/PlotPages";
import { HandleReportPage } from "../Pages/ReportPage";
import { GetUserConfiguration } from "../UserConfiguration/UserConfiguration";
import { ApplyStoredConfiguration, state } from "./AppState";
import { GetPageKind, PageKind } from "./CurrentPage";
import { ResetPageListeners } from "./PageListeners";

/**
 * Tells what was loaded, and for a large data set that the view button shows it.
 */
function ShowLoadSummary(traceData: TraceData[], isLarge: boolean): void {
	if (traceData.length === 0) {
		return;
	}
	const bounds =
		state.dataFileType === "trc"
			? (elements.librarySelector.selectedOptions[0]?.text ?? "None")
			: undefined;
	const summary = DescribeTraceData(traceData, bounds);
	ShowLoadStatus(
		isLarge
			? `${summary}. The data set is large, use the view button to show it.`
			: summary,
		false
	);
}

/**
 * Manage the benchmark results data.
 */
export async function ManageData(): Promise<void> {
	/**
	 * Trace data results.
	 */
	let traceData: TraceData[] = [];

	/**
	 * selectedValues holds the selected solvers.
	 */
	const selectedSolvers: string[] = [];

	/**
	 * If the uploaded data file is of type JSON, it retrieves the user configuration
	 * and updates the unprocessedData and dataFileType variables.
	 */
	if (state.dataFileType === "json") {
		const config = GetUserConfiguration();
		if (!config) {
			return;
		}
		ApplyStoredConfiguration(config);
		traceData = ExtractTraceData(state.unprocessedData);
	}

	/**
	 * If the uploaded data file is of type TRC, it extracts the trace data from the unprocessedData,
	 * gets instance information if any, gets best known bounds if any .solu file is loaded or a library is selected,
	 * merges the data, and adds result categories to the trace data.
	 */
	if (state.dataFileType === "trc") {
		traceData = await ProcessData(
			state.unprocessedData,
			state.unprocessedInstanceInformationData,
			state.unprocessedSolutionData
		);
	}

	/**
	 * Tell what was loaded. Large data sets are not shown at once, the view button shows them.
	 */
	const isLarge =
		state.dataFileType === "trc" &&
		traceData.length > Values.AUTO_RENDER_ROW_LIMIT;
	ShowLoadSummary(traceData, isLarge);

	/**
	 * Remove the listeners of earlier data, so only the ones for this data run.
	 */
	ResetPageListeners();

	/**
	 * Handle and set up the common buttons for all pages.
	 */
	HandleCommonButtons(traceData, selectedSolvers);

	/**
	 * Handle the functionality of the page that is shown, using the traceData variable.
	 */
	switch (GetPageKind()) {
		case PageKind.TABLE:
			HandleReportPage(traceData);
			if (!isLarge) {
				elements.viewTableButton.click();
			}
			break;
		case PageKind.COMPARE_SOLVERS:
			HandleCompareSolversPage(traceData);
			break;
		case PageKind.PLOT:
			HandlePlotPages(traceData);
			if (!isLarge) {
				elements.viewPlotsButton.click();
			}
			break;
	}
}
