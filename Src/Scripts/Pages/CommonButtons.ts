import { state } from "../App/AppState";
import { ConvertToTraceFile } from "../DataProcessing/CreateData";
import { FillSolverSelectorList } from "../Elements/Events/ImportDataEvents";
import {
	configurationSettingsButton,
	defaultTimeInput,
	deleteLocalStorageButton,
	downloadConfigurationButton,
	downloadConfigurationButtonLayer,
	gapLimitInput,
	solverSelector
} from "../Elements/Elements";
import { TraceData } from "../Interfaces/Interfaces";
import { Values } from "../Constants/Values";
import {
	DeleteUserConfiguration,
	DownloadCustomizedUserConfiguration,
	DownloadUserConfiguration
} from "../UserConfiguration/UserConfiguration";

/**
 * This function manages the functionality of the common buttons on all pages of the application.
 * @param {TraceData[]} traceData - Array of objects containing the result data.
 * @param selectedSolvers  - selectedValues holds the selected solvers.
 */
export function HandleCommonButtons(
	traceData: TraceData[],
	selectedSolvers: string[]
): void {
	/**
	 * Fill the solver selector with solvers and update the values in selectedSolvers when the user selects them.
	 */
	FillSolverSelectorList(traceData);
	document.getElementById("solverSelector")?.addEventListener("change", () => {
		const solverSelector = document.getElementById(
			"solverSelector"
		) as HTMLSelectElement;
		selectedSolvers = Array.from(solverSelector.options)
			.filter((option) => {
				return option.selected;
			})
			.map((option) => {
				return option.value;
			});
	});
	configurationSettingsButton.disabled = false;

	/**
	 * Download the current configuration when clicking on the "Download Configuration" button.
	 */
	downloadConfigurationButton.addEventListener("click", () => {
		DownloadUserConfiguration();
	});

	/**
	 * Delete stored data in local storage when clicking in the "Delete Data" button.
	 */
	deleteLocalStorageButton.addEventListener("click", () => {
		const deleteButtonInModal = document.getElementById("deleteButtonInModal");
		if (deleteButtonInModal) {
			deleteButtonInModal.addEventListener("click", () => {
				DeleteUserConfiguration();
				deleteLocalStorageButton.disabled = true;
				downloadConfigurationButtonLayer.disabled = true;
			});
		}
	});

	/**
	 * Download a customized version of the user configuration.
	 * Filters by the solvers selected in the form selector and gets
	 * the default time and gap percentage from the number input.
	 */
	const downloadCustomConfigButton = document.getElementById(
		"downloadCustomConfigurationButton"
	);
	if (downloadCustomConfigButton) {
		downloadCustomConfigButton.addEventListener("click", () => {
			if (selectedSolvers.length === 0) {
				selectedSolvers[0] = solverSelector?.value ?? "";
			}
			const customizedTraceData = traceData.filter((solver) => {
				return (
					typeof solver["SolverName"] === "string" &&
					selectedSolvers.includes(solver["SolverName"] as string)
				);
			});
			const newRawData: string[] = ConvertToTraceFile(customizedTraceData);

			state.defaultTime = Number(defaultTimeInput?.value);
			if (!state.defaultTime) {
				state.defaultTime = Values.DEFAULT_TIME;
			}

			state.gapLimit = Number(gapLimitInput?.value);
			if (!state.gapLimit) {
				state.gapLimit = Values.DEFAULT_GAP_LIMIT;
			}

			DownloadCustomizedUserConfiguration(
				newRawData,
				state.defaultTime,
				state.gapLimit
			);
		});
	}
}
