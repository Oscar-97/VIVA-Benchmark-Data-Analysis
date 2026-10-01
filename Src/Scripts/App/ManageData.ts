import { ExtractTraceData } from "../DataProcessing/FilterData";
import { ProcessData } from "../DataProcessing/ProcessTraceData";
import { viewPlotsButton, viewTableButton } from "../Elements/Elements";
import { TraceData } from "../Interfaces/Interfaces";
import { HandleCommonButtons } from "../Pages/CommonButtons";
import { HandleCompareSolversPage } from "../Pages/CompareSolversPage";
import { HandlePlotPages } from "../Pages/PlotPages";
import { HandleReportPage } from "../Pages/ReportPage";
import { GetUserConfiguration } from "../UserConfiguration/UserConfiguration";
import { state } from "./AppState";
import { GetPageKind, PageKind } from "./CurrentPage";

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
		[
			state.unprocessedData,
			state.dataFileType,
			state.defaultTime,
			state.gapLimit
		] = GetUserConfiguration();
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
	 * Handle and set up the common buttons for all pages.
	 */
	HandleCommonButtons(traceData, selectedSolvers);

	/**
	 * Handle the functionality of the page that is shown, using the traceData variable.
	 */
	switch (GetPageKind()) {
		case PageKind.TABLE:
			HandleReportPage(traceData);
			if (state.dataFileType === "json") {
				viewTableButton.click();
			}
			break;
		case PageKind.COMPARE_SOLVERS:
			HandleCompareSolversPage(traceData);
			break;
		case PageKind.PLOT:
			HandlePlotPages(traceData);
			if (state.dataFileType === "json") {
				viewPlotsButton.click();
			}
			break;
	}
}
