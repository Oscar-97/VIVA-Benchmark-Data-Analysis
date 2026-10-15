import {
	BarController,
	BarElement,
	BubbleController,
	CategoryScale,
	Chart,
	ChartDataset,
	ChartOptions,
	ChartTypeRegistry,
	Colors,
	Filler,
	Legend,
	LinearScale,
	LineController,
	LineElement,
	PointElement,
	RadarController,
	RadialLinearScale,
	SubTitle,
	Title,
	Tooltip
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import annotationPlugin from "chartjs-plugin-annotation";
import { elements } from "../Elements/Elements";
import { ShowPWANotification } from "../PWA/PWA-utils";
import { ChartMessages } from "../Constants/Messages";
import { GetCurrentTheme, THEME_CHANGE_EVENT } from "../Theme";
import { AnyChart, UpdateChartTools, WireChartTools } from "./ChartTools";
import { ApplyPalette } from "./Palette";
let myChart: AnyChart | null = null;

/**
 * The data sets, scale, zoom and annotation options of a chart.
 */
export type ChartDatasets = ChartDataset<keyof ChartTypeRegistry, unknown[]>[];
export type ChartScaleOptions = ChartOptions["scales"];
export type ChartZoomOptions = NonNullable<ChartOptions["plugins"]>["zoom"];
export type ChartAnnotationOptions = NonNullable<
	ChartOptions["plugins"]
>["annotation"];

/**
 * Only what the application draws is registered, not everything that chart.js/auto does:
 * bar, line, bubble and radar charts, with the scales and elements that they use, and the plugins
 * for the colors, the filled areas of a radar chart, the legend, the titles and the tooltips.
 * A chart of another kind needs its controller, scale and elements added here.
 */
Chart.register(
	BarController,
	LineController,
	BubbleController,
	RadarController,
	CategoryScale,
	LinearScale,
	RadialLinearScale,
	BarElement,
	LineElement,
	PointElement,
	Colors,
	Filler,
	Legend,
	SubTitle,
	Title,
	Tooltip
);
Chart.register(zoomPlugin);
Chart.register(annotationPlugin);

/**
 * This function creates a new Chart.js chart. If a chart already exists, it is destroyed before a new one is created.
 *
 * @param {string} type - The type of chart to create (e.g., 'line', 'bar', 'pie').
 * @param {object[]} data - The data for the chart, which should be an array of objects.
 * @param label - The label/s for the data.
 * @param {string} title - The title of the chart.
 * @param scaleOptions - The scape options for the chart.
 * @param zoomOptions - The zoom options for the chart.
 * @param annotationOptions - The annotation options for the chart.
 * @param subtitle - The subtitle of the chart.
 *
 * @example
 * ```typescript
 * // Create a bar chart
 * const data = [
 * 	{
 *		"label": "bbb",
 *		"data": [
 *			16912.75
 *		],
 *		"borderColor": "#33ef4b",
 *		"backgroundColor": "#33ef4b"
 *	 }
 * ];
 * CreateChart('bar', data, 'My Label', 'My Title');
 * ```
 */
export function CreateChart(
	type: keyof ChartTypeRegistry,
	data: ChartDatasets,
	label: string | string[],
	title: string,
	scaleOptions?: ChartScaleOptions,
	zoomOptions?: ChartZoomOptions,
	annotationOptions?: ChartAnnotationOptions,
	subtitle?: string
): void {
	lastChart = {
		type,
		data,
		label,
		title,
		scaleOptions,
		zoomOptions,
		annotationOptions,
		subtitle
	};
	DrawChart(lastChart);

	ShowPWANotification(ChartMessages.CHART_SUCCESS_HEADER, {
		body: ChartMessages.CHART_SUCCESS,
		icon: "../CSS/tab_icon.png",
		silent: true
	});
}

/**
 * Draws the chart with the colors of the current theme.
 * If a chart already exists, it is destroyed before a new one is created.
 */
function DrawChart(chart: ChartArguments, keepView = false): void {
	const {
		type,
		data,
		label,
		title,
		scaleOptions,
		zoomOptions,
		annotationOptions,
		subtitle
	} = chart;

	/**
	 * Destroy the chart if it already exist.
	 */
	const view = keepView && myChart ? CaptureView(myChart) : null;
	if (myChart) {
		myChart.destroy();
	}

	ApplyChartTheme();
	const theme = GetCurrentTheme();
	LabelCanvas(DescribeChart(title, data));

	myChart = new Chart(elements.chartCanvas, {
		type: type,
		data: {
			labels: typeof label === "string" ? [label] : label,
			datasets: data.map((dataset, index) =>
				AdaptDatasetToTheme(ApplyPalette(dataset, index, type, theme))
			)
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			...(scaleOptions ? { scales: scaleOptions } : {}),
			transitions: {
				zoom: {
					animation: {
						duration: 1000,
						easing: "easeOutCubic"
					}
				}
			},
			plugins: {
				legend: LEGEND_OPTIONS,
				title: {
					display: true,
					text: title,
					font: {
						size: 20,
						family: `system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue","Noto Sans","Liberation Sans",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"`
					}
				},
				subtitle: subtitle
					? { display: true, text: subtitle }
					: { display: false },
				...(zoomOptions ? { zoom: WithToolUpdates(zoomOptions) } : {}),
				...(annotationOptions ? { annotation: annotationOptions } : {})
			}
		}
	});

	ConnectTools(myChart, view);
}

/**
 * The legend hides or shows a data set when it is clicked, as it does by default, and then the tools show
 * how many data sets are left.
 */
const LEGEND_OPTIONS: NonNullable<
	NonNullable<ChartOptions["plugins"]>["legend"]
> = {
	onClick: (event, item, legend): void => {
		Chart.defaults.plugins.legend.onClick.call(legend, event, item, legend);
		UpdateChartTools(legend.chart as AnyChart);
	}
};

/**
 * A chart on a canvas has no content of its own, so the canvas is an image with a description.
 */
function LabelCanvas(description: string): void {
	const canvas = elements.chartCanvas;
	canvas.setAttribute("role", "img");
	canvas.setAttribute("aria-label", description);
}

/**
 * Restores the view of the chart that was replaced, if there was one, and brings the tools in line with the chart.
 */
function ConnectTools(chart: AnyChart, view: ChartView | null): void {
	if (view) {
		RestoreView(chart, view);
	}
	WireChartTools(
		() => myChart,
		() => lastChart?.title ?? ""
	);
	UpdateChartTools(chart);
}

/**
 * The view that the user chose: the data sets that are hidden, and the part of the scales that is shown.
 */
interface ChartView {
	hidden: number[];
	scales: { id: string; min: number; max: number }[];
}

function CaptureView(chart: AnyChart): ChartView {
	const hidden = chart.data.datasets
		.map((_, index) => index)
		.filter((index) => !chart.isDatasetVisible(index));
	const scales = chart.isZoomedOrPanned()
		? Object.entries(chart.scales).map(([id, scale]) => ({
				id,
				min: scale.min,
				max: scale.max
			}))
		: [];
	return { hidden, scales };
}

function RestoreView(chart: AnyChart, view: ChartView): void {
	for (const index of view.hidden) {
		chart.setDatasetVisibility(index, false);
	}
	if (view.hidden.length > 0) {
		chart.update("none");
	}
	for (const { id, min, max } of view.scales) {
		chart.zoomScale(id, { min, max }, "none");
	}
}

/**
 * Adds to the zoom options that the tools are updated when the user zooms or pans, so the button that resets the
 * zoom is only available when there is a zoom to reset.
 */
function WithToolUpdates(
	zoomOptions: NonNullable<ChartZoomOptions>
): NonNullable<ChartZoomOptions> {
	return {
		...zoomOptions,
		zoom: {
			...zoomOptions.zoom,
			onZoomComplete: ({ chart }) => UpdateChartTools(chart as AnyChart)
		},
		pan: {
			...zoomOptions.pan,
			onPanComplete: ({ chart }) => UpdateChartTools(chart as AnyChart)
		}
	};
}

/**
 * A text for a screen reader: a chart on a canvas has no content of its own.
 */
function DescribeChart(title: string, data: ChartDatasets): string {
	const labels = data
		.map((dataset) => dataset.label)
		.filter((label): label is string => typeof label === "string");
	const MAX_LABELS = 12;
	const listed = labels.slice(0, MAX_LABELS).join(", ");
	const more =
		labels.length > MAX_LABELS
			? `, and ${labels.length - MAX_LABELS} more`
			: "";
	return labels.length > 0 ? `${title}. Data sets: ${listed}${more}.` : title;
}

/**
 * Chart.js does not read the CSS, so the colors of the text, the grid and the tooltips come
 * from the Bootstrap variables of the current theme and are set as the defaults of every chart.
 */
function ApplyChartTheme(): void {
	const style = getComputedStyle(document.documentElement);
	const bodyColor = style.getPropertyValue("--bs-body-color").trim();
	const borderColor = style.getPropertyValue("--bs-border-color").trim();
	if (bodyColor) {
		Chart.defaults.color = bodyColor;
	}
	if (borderColor) {
		/**
		 * Not `Chart.defaults.borderColor`: that is also the default color of the bars and lines,
		 * and it stops the Colors plugin from picking colors for the data sets.
		 */
		Chart.defaults.scale.grid.color = borderColor;
		Chart.defaults.scales.radialLinear.grid.color = borderColor;
		Chart.defaults.scales.radialLinear.angleLines.color = borderColor;
	}
}

/**
 * Relative luminance of a "#rrggbb" or "#rrggbbaa" color, or null for any other format.
 */
function GetLuminance(color: string): number | null {
	const match = /^#([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(color);
	if (!match?.[1]) {
		return null;
	}
	const [r, g, b] = [0, 2, 4].map(
		(start) => parseInt(match[1]?.slice(start, start + 2) ?? "0", 16) / 255
	);
	return 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (b ?? 0);
}

/**
 * Mixes a "#rrggbb" or "#rrggbbaa" color with white.
 */
function Lighten(color: string, amount: number): string {
	const channels = [1, 3, 5].map((start) => {
		const value = parseInt(color.slice(start, start + 2), 16);
		return Math.round(value + (255 - value) * amount)
			.toString(16)
			.padStart(2, "0");
	});
	return "#" + channels.join("") + color.slice(7);
}

/**
 * Very dark colors (the status colors of the termination chart) disappear on the dark theme,
 * so they are lightened when drawn. The data of the chart is left as it is.
 */
export function AdaptColorToTheme(color: unknown, theme: string): unknown {
	if (theme !== "dark" || typeof color !== "string") {
		return color;
	}
	const luminance = GetLuminance(color);
	return luminance !== null && luminance < 0.2 ? Lighten(color, 0.55) : color;
}

function AdaptDatasetToTheme(
	dataset: ChartDatasets[number]
): ChartDatasets[number] {
	const theme = GetCurrentTheme();
	return {
		...dataset,
		...(dataset.borderColor !== undefined
			? { borderColor: AdaptColorToTheme(dataset.borderColor, theme) }
			: {}),
		...(dataset.backgroundColor !== undefined
			? { backgroundColor: AdaptColorToTheme(dataset.backgroundColor, theme) }
			: {})
	} as ChartDatasets[number];
}

/**
 * The arguments of the last chart, to draw it again when the theme changes.
 */
interface ChartArguments {
	type: keyof ChartTypeRegistry;
	data: ChartDatasets;
	label: string | string[];
	title: string;
	scaleOptions: ChartScaleOptions | undefined;
	zoomOptions: ChartZoomOptions | undefined;
	annotationOptions: ChartAnnotationOptions | undefined;
	subtitle: string | undefined;
}

let lastChart: ChartArguments | null = null;

/**
 * Draws the chart again with the new colors. The zoom and the data sets that are hidden are kept.
 */
if (typeof window !== "undefined") {
	window.addEventListener(THEME_CHANGE_EVENT, () => {
		if (lastChart && myChart) {
			DrawChart(lastChart, true);
		}
	});
}
