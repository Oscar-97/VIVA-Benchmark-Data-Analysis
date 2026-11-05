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
	resolution: HTMLSelectElement | null;
	background: HTMLSelectElement | null;
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
		resolution: FindElement<HTMLSelectElement>("chartImageResolution"),
		background: FindElement<HTMLSelectElement>("chartImageBackground"),
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
 * The date as year, month and day, for example "2026-10-29", in the time zone of the user.
 */
function FormatDate(date: Date): string {
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * A name for the image of a chart, made from its title and the date: letters, digits and underscores,
 * for example "viva_performance_profile_2026-10-29.png".
 *
 * @param title - The title of the chart.
 * @param date - The date in the name. By default today.
 */
export function ChartFileName(title: string, date: Date = new Date()): string {
	const slug = title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "_")
		.replace(/^_+|_+$/g, "");
	return `viva_${slug || "chart"}_${FormatDate(date)}.png`;
}

/**
 * What the user chose for the image: how many times the size on the screen, and the background.
 */
export interface ImageOptions {
	scale: number;
	background: "page" | "transparent";
}

/**
 * The longest side of an image in pixels. A browser cannot make a canvas that is much larger.
 */
export const MAX_IMAGE_SIDE = 16384;

/**
 * The pixel ratio to draw the chart at for an image: the one of the screen times the scale, but not so large that
 * the image is longer than the most that a canvas can have.
 *
 * @param scale - How many times the size on the screen.
 * @param screenRatio - The pixel ratio that the chart is drawn at now.
 * @param width - The width of the chart in CSS pixels.
 * @param height - The height of the chart in CSS pixels.
 */
export function ImagePixelRatio(
	scale: number,
	screenRatio: number,
	width: number,
	height: number
): number {
	const longest = Math.max(width, height, 1);
	return Math.min(screenRatio * Math.max(scale, 1), MAX_IMAGE_SIDE / longest);
}

/**
 * Reads what the user chose for the image from the selectors of the tools.
 */
function ReadImageOptions(found: {
	resolution: HTMLSelectElement | null;
	background: HTMLSelectElement | null;
}): ImageOptions {
	const scale = Number(found.resolution?.value);
	return {
		scale: Number.isFinite(scale) && scale >= 1 ? scale : 1,
		background:
			found.background?.value === "transparent" ? "transparent" : "page"
	};
}

/**
 * Copies the canvas of the chart to a canvas of its own, on the background of the page unless the user wants a
 * transparent one. The canvas of the chart is transparent, so on a dark background of an image viewer the dark text
 * of the light theme would be unreadable.
 */
function CopyCanvas(
	source: HTMLCanvasElement,
	background: ImageOptions["background"]
): HTMLCanvasElement | null {
	const canvas = document.createElement("canvas");
	canvas.width = source.width;
	canvas.height = source.height;
	const context = canvas.getContext("2d");
	if (!context) {
		return null;
	}
	if (background === "page") {
		const color = getComputedStyle(document.documentElement)
			.getPropertyValue("--bs-body-bg")
			.trim();
		context.fillStyle =
			color || (GetCurrentTheme() === "dark" ? "#212529" : "#ffffff");
		context.fillRect(0, 0, canvas.width, canvas.height);
	}
	context.drawImage(source, 0, 0);
	return canvas;
}

/**
 * Downloads the chart as a PNG image. For a larger image the chart is drawn again at a higher pixel ratio, so
 * the lines and the text are sharp and not enlarged, and then drawn as before.
 *
 * @param chart - The chart that is shown.
 * @param title - The title of the chart, for the name of the file.
 * @param options - The size and the background of the image.
 */
export function DownloadChartImage(
	chart: AnyChart,
	title: string,
	options: ImageOptions = { scale: 1, background: "page" }
): void {
	const screenRatio = chart.currentDevicePixelRatio;
	const ratio = ImagePixelRatio(
		options.scale,
		screenRatio,
		chart.width,
		chart.height
	);
	const isLarger = ratio !== screenRatio;
	if (isLarger) {
		chart.options.devicePixelRatio = ratio;
		chart.resize();
	}
	let canvas: HTMLCanvasElement | null;
	try {
		canvas = CopyCanvas(chart.canvas, options.background);
	} finally {
		if (isLarger) {
			chart.options.devicePixelRatio = screenRatio;
			chart.resize();
		}
	}
	canvas?.toBlob((blob) => {
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
		if (chart) DownloadChartImage(chart, getTitle(), ReadImageOptions(found));
	});
}
