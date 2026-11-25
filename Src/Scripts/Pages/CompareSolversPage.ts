import { state } from "../App/AppState";
import { Listen } from "../App/PageListeners";
import { ConvertToTraceFile } from "../DataProcessing/CreateData";
import { ExtractAllSolverTimesGapType } from "../DataProcessing/ChartsComputations/ComputeChartData";
import { CompareSolvers } from "../DataProcessing/ResultComputations/ComputeResults";
import { ComparisonSummaryTable } from "../DataTable/DataTableBase";
import {
	DisplayErrorNotification,
	HideErrorNotification
} from "../Elements/Events/DisplayAlertNotification";
import {
	GetSelectedCheckboxValues,
	PopulateCheckboxes
} from "../Elements/Events/DynamicCheckboxes";
import { ElementStateDisplayedComparisonTable } from "../Elements/Events/ElementStatus";
import { elements } from "../Elements/Elements";
import { ErrorMessages } from "../Constants/Messages";
import { Values } from "../Constants/Values";
import { TraceData } from "../Interfaces/Interfaces";
import { DescribeComparisonSettings } from "./ComparisonSettings";
import { RegisterSaveToLocalStorage } from "./SaveToLocalStorage";

/**
 * This function manages the functionality of the buttons on the compare solvers page of the application.
 * It also handles the comparison of the solvers.
 *
 * @param {TraceData[]} traceData - Array of objects containing the result data.
 */
export function HandleCompareSolversPage(traceData: TraceData[]): void {
	PopulateCheckboxes(traceData);
	FillEmptyLimits();
	ShowCompareHint(true);
	UpdateCompareButton();
	document
		.getElementById("solverOptions")
		?.addEventListener("change", UpdateCompareButton);

	/**
	 * Save to local storage when clicking on the "Save to browser" menu item.
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

		const [firstSolver, secondSolver] = selectedSolvers;
		if (
			selectedSolvers.length !== 2 ||
			firstSolver === undefined ||
			secondSolver === undefined
		) {
			DisplayErrorNotification(ErrorMessages.SELECT_SOLVER_AMOUNT);
			return;
		}
		HideErrorNotification();
		const comparisonSummary = CompareSolvers(
			firstSolver,
			secondSolver,
			solverTimes
		);
		const inverseComparisonSummary = CompareSolvers(
			secondSolver,
			firstSolver,
			solverTimes
		);
		ComparisonSummaryTable(
			comparisonSummary,
			inverseComparisonSummary,
			firstSolver,
			secondSolver,
			// The fields hold the limits that were used, also when an empty or invalid one was replaced by the default.
			DescribeComparisonSettings({
				terminationStatus:
					elements.terminationTypeSelector.selectedOptions[0]?.text ?? "",
				gapType: elements.gapTypeSelector.selectedOptions[0]?.text ?? "",
				gapLimit: Number(elements.gapLimitDirectInput.value),
				timeLimit: Number(elements.defaultTimeDirectInput.value)
			})
		);
		ElementStateDisplayedComparisonTable();
		ShowCompareHint(false);
	});
}

/**
 * Puts the default time limit and gap limit in the fields that are empty, so the page shows what a comparison
 * uses before the first one is made, as the performance profile page does.
 */
function FillEmptyLimits(): void {
	if (elements.defaultTimeDirectInput.value === "") {
		elements.defaultTimeDirectInput.value = String(Values.DEFAULT_TIME);
	}
	if (elements.gapLimitDirectInput.value === "") {
		elements.gapLimitDirectInput.value = String(Values.DEFAULT_GAP_LIMIT);
	}
}

/**
 * The comparison needs exactly two solvers, so the button is available when two are ticked.
 */
function UpdateCompareButton(): void {
	const ready = GetSelectedCheckboxValues().length === 2;
	elements.compareSolversButton.disabled = !ready;
	elements.compareSolversButton.title = ready
		? "Compare the selected solvers."
		: "Tick two solvers to compare them.";
}

/**
 * Shows the line that says what to do until a comparison is shown.
 */
function ShowCompareHint(visible: boolean): void {
	const hint = document.getElementById("compareHint");
	if (hint) {
		hint.hidden = !visible;
	}
}
