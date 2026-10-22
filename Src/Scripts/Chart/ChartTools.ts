import { Chart, ChartTypeRegistry } from "chart.js";
import { FindElement } from "../Elements/Elements";
import { GetCurrentTheme } from "../Theme";

/**
 * A chart of the application, of any kind.
 */
export type AnyChart = Chart<keyof ChartTypeRegistry, unknown[], string>;

/**
 * The tools below the buttons of a chart page: reset the zoom, show or hide all data sets and download an image.
 * They are in the page, and stay hidden until a chart is drawn.
 */
function FindTools(): {
	tools: HTMLElement;
	resetZoom: HTMLButtonElement | null;
	showAll: HTMLButtonElement | null;
	hideAll: HTMLButtonElement | null;
	download: HTMLButtonElement | null;
	status: HTMLElement | null;
} | null {
	const tools = FindElement<HTMLElement>("chartTools");
	if (!tools) {
		return null;
	}
	return {
		tools,
		resetZoom: FindElement<HTMLButtonElement>("resetZoomButton"),
		showAll: FindElement<HTMLButtonElement>("showAllSeriesButton"),
		hideAll: FindElement<HTMLButtonElement>("hideAllSeriesButton"),
		download: FindElement<HTMLButtonElement>("downloadChartImageButton"),
		status: FindElement<HTMLElement>("chartToolsStatus")
	};
}

/**
 * Whether the user can zoom or pan the chart. The zoom plugin has options for every chart, which all turn
 * the zoom and the pan off, so a chart is zoomable when one of them is turned on.
 */
function IsEnabled(
	option: { enabled?: boolean | undefined } | undefined
): boolean {
	return option?.enabled === true;
}

function IsZoomable(chart: AnyChart): boolean {
	const zoom = chart.options.plugins?.zoom;
	return [
		zoom?.zoom?.wheel,
		zoom?.zoom?.pinch,
		zoom?.zoom?.drag,
		zoom?.pan
	].some(IsEnabled);
}

/**
 * The text next to the tools: how many data sets are shown, and how to zoom.
 */
export function DescribeChartTools(
	shown: number,
	total: number,
	zoomable: boolean
): string {
	const parts: string[] = [];
	if (zoomable) {
		parts.push("Scroll or pinch to zoom.");
	}
	if (total > 1) {
		parts.push(`${shown} of ${total} data sets shown.`);
	}
	return parts.join(" ");
}

/**
 * Brings the tools in line with the chart: which of them are useful, and what they say.
 * Called after a chart is drawn, and after the user zooms, pans or toggles a data set.
 */
export function UpdateChartTools(chart: AnyChart): void {
	const found = FindTools();
	if (!found) {
		return;
	}
	const total = chart.data.datasets.length;
	const shown = chart.data.datasets.filter((_, index) =>
		chart.isDatasetVisible(index)
	).length;
	const zoomable = IsZoomable(chart);

	found.tools.hidden = false;
	if (found.resetZoom) {
		found.resetZoom.hidden = !zoomable;
		found.resetZoom.disabled = !zoomable || !chart.isZoomedOrPanned();
	}
	// Showing and hiding data sets only means something when there are several.
	if (found.showAll) {
		found.showAll.hidden = total < 2;
		found.showAll.disabled = shown === total;
	}
	if (found.hideAll) {
		found.hideAll.hidden = total < 2;
		found.hideAll.disabled = shown === 0;
	}
	if (found.status) {
		found.status.textContent = DescribeChartTools(shown, total, zoomable);
	}
}

/**
 * Shows or hides all data sets of the chart.
 */
export function SetAllDatasetsVisible(chart: AnyChart, visible: boolean): void {
	chart.data.datasets.forEach((_, index) => {
		chart.setDatasetVisibility(index, visible);
	});
	chart.update();
	UpdateChartTools(chart);
}

/**
 * A name for the image of a chart, made from its title: letters, digits and dashes.
 */
export function ChartFileName(title: string): string {
	const slug = title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
	return `viva-${slug || "chart"}.png`;
}

/**
 * Downloads the chart as a PNG image. The canvas is transparent, so the image is drawn on the background of
 * the page, or the dark text of the light theme would be unreadable on the dark background of an image viewer.
 */
export function DownloadChartImage(chart: AnyChart, title: string): void {
	const source = chart.canvas;
	const canvas = document.createElement("canvas");
	canvas.width = source.width;
	canvas.height = source.height;
	const context = canvas.getContext("2d");
	if (!context) {
		return;
	}
	const background = getComputedStyle(document.documentElement)
		.getPropertyValue("--bs-body-bg")
		.trim();
	context.fillStyle =
		background || (GetCurrentTheme() === "dark" ? "#212529" : "#ffffff");
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.drawImage(source, 0, 0);

	canvas.toBlob((blob) => {
		if (!blob) {
			return;
		}
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = ChartFileName(title);
		link.click();
		URL.revokeObjectURL(url);
	}, "image/png");
}

let wired = false;

/**
 * Connects the buttons of the tools to the chart that is shown. It is done once, as the page keeps its buttons
 * while the chart is drawn again.
 *
 * @param getChart - The chart that is shown now, if any.
 * @param getTitle - The title of the chart that is shown now.
 */
export function WireChartTools(
	getChart: () => AnyChart | null,
	getTitle: () => string
): void {
	const found = FindTools();
	if (wired || !found) {
		return;
	}
	wired = true;
	found.resetZoom?.addEventListener("click", () => {
		const chart = getChart();
		if (chart) {
			chart.resetZoom();
			UpdateChartTools(chart);
		}
	});
	found.showAll?.addEventListener("click", () => {
		const chart = getChart();
		if (chart) SetAllDatasetsVisible(chart, true);
	});
	found.hideAll?.addEventListener("click", () => {
		const chart = getChart();
		if (chart) SetAllDatasetsVisible(chart, false);
	});
	found.download?.addEventListener("click", () => {
		const chart = getChart();
		if (chart) DownloadChartImage(chart, getTitle());
	});
}
