import { state } from "../App/AppState";
import { Listen } from "../App/PageListeners";
import { ConvertToTraceFile } from "../DataProcessing/CreateData";
import { ExtractAllSolverTimesGapType } from "../DataProcessing/ChartsComputations/ComputeChartData";
import { CompareSolvers } from "../DataProcessing/ResultComputations/ComputeResults";
import { ComparisonSummaryTable } from "../DataTable/DataTableBase";
import { DisplayErrorNotification } from "../Elements/Events/DisplayAlertNotification";
import {
	GetSelectedCheckboxValues,
	PopulateCheckboxes
} from "../Elements/Events/DynamicCheckboxes";
import { ElementStateDisplayedComparisonTable } from "../Elements/Events/ElementStatus";
import { elements } from "../Elements/Elements";
import { ErrorMessages } from "../Constants/Messages";
import { TraceData } from "../Interfaces/Interfaces";
import { RegisterSaveToLocalStorage } from "./SaveToLocalStorage";

/**
 * This function manages the functionality of the buttons on the compare solvers page of the application.
 * It also handles the comparison of the solvers.
 *
 * @param {TraceData[]} traceData - Array of objects containing the result data.
 */
export function HandleCompareSolversPage(traceData: TraceData[]): void {
	PopulateCheckboxes(traceData);

	/**
	 * Save to local storage when clicking on the "Save Data" button.
	 */
	RegisterSaveToLocalStorage(() => {
		return ConvertToTraceFile(traceData);
	});

	/**
	 * Event listener for the compare solvers button.
	 */
	Listen(elements.compareSolversButton, "click", () => {
		state.defaultTime = Number(elements.defaultTimeDirectInput.value);
		state.gapLimit = Number(elements.gapLimitDirectInput.value);

		const solverTimes = ExtractAllSolverTimesGapType(
			traceData,
			elements.gapTypeSelector.value,
			state.defaultTime,
			state.gapLimit,
			elements.terminationTypeSelector.value
		);
		const selectedSolvers = GetSelectedCheckboxValues();

		if (selectedSolvers.length !== 2) {
			DisplayErrorNotification(ErrorMessages.SELECT_SOLVER_AMOUNT);
		}
		const comparisonSummary = CompareSolvers(
			selectedSolvers[0],
			selectedSolvers[1],
			solverTimes
		);
		const inverseComparisonSummary = CompareSolvers(
			selectedSolvers[1],
			selectedSolvers[0],
			solverTimes
		);
		ComparisonSummaryTable(
			comparisonSummary,
			inverseComparisonSummary,
			selectedSolvers[0],
			selectedSolvers[1]
		);
		ElementStateDisplayedComparisonTable();
	});
}
