import { state } from "../App/AppState";
import { Listen } from "../App/PageListeners";
import { ConvertToTraceFile } from "../DataProcessing/CreateData";
import { DisplayErrorNotification } from "../Elements/Events/DisplayAlertNotification";
import { ElementStateDisplayedChart } from "../Elements/Events/ElementStatus";
import { elements } from "../Elements/Elements";
import { ChartMessages } from "../Constants/Messages";
import { Values } from "../Constants/Values";
import { TraceData } from "../Interfaces/Interfaces";
import { GetPlotFunction } from "./PlotRegistry";
import { RegisterSaveToLocalStorage } from "./SaveToLocalStorage";

/**
 * This function manages the functionality of the buttons on the plot pages of the application.
 *
 * @param {TraceData[]} traceData - Array of objects containing the result data.
 */
export function HandlePlotPages(traceData: TraceData[]): void {
	const defaultTimeInput = document.getElementById(
		"defaultTimeInput"
	) as HTMLInputElement;
	state.defaultTime = Number(defaultTimeInput.value);
	if (!state.defaultTime) {
		state.defaultTime = Values.DEFAULT_TIME;
	}

	/**
	 * Save to local storage when clicking on the "Save Data" button.
	 */
	RegisterSaveToLocalStorage(() => {
		return ConvertToTraceFile(traceData);
	});

	/**
	 * View chart/plot when clicking on the view plot button per page.
	 */
	elements.viewPlotsButton.disabled = false;
	Listen(elements.viewPlotsButton, "click", () => {
		const plot = GetPlotFunction();
		if (plot) {
			state.chartData = plot(traceData);
		}
		ElementStateDisplayedChart();
	});

	/**
	 * Download the current chart data when clicking on the "Download Chart Data" button.
	 */
	Listen(elements.downloadChartDataButton, "click", () => {
		if (state.chartData) {
			const downloadAbleFile = JSON.stringify(state.chartData);
			const blob = new Blob([downloadAbleFile], { type: "application/json" });

			elements.downloadChartDataButton.href = window.URL.createObjectURL(blob);
			elements.downloadChartDataButton.download = "ChartData.json";
		} else {
			DisplayErrorNotification(ChartMessages.NO_CHART_DATA);
		}
	});
}
