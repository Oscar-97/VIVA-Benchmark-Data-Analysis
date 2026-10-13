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
let myChart: Chart<keyof ChartTypeRegistry, unknown[], string> | null = null;

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
 * This function generates an array of random hex color codes.
 *
 * @param numberOfColors - The number of random colors to generate.
 * @returns An array of random color hex codes.
 *
 * @example
 * ```typescript
 * // Generate three random colors
 * const colors = PickColor(3);
 * console.log(colors); // ["#6a5acd", "#8b008b", "#cd5c5c"]
 * ```
 */
export function PickColor(numberOfColors: number): string[] {
	const colors: string[] = [];
	for (let i = 0; i < numberOfColors; i++) {
		const hex = Math.floor(Math.random() * 16777215).toString(16);
		const color = "#" + hex;
		colors.push(color);
	}
	return colors;
}

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
	/**
	 * Destroy the chart if it already exist.
	 */
	if (myChart) {
		myChart.destroy();
	}

	myChart = new Chart(elements.chartCanvas, {
		type: type,
		data: {
			labels: typeof label === "string" ? [label] : label,
			datasets: data
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
				...(zoomOptions ? { zoom: zoomOptions } : {}),
				...(annotationOptions ? { annotation: annotationOptions } : {})
			}
		}
	});

	ShowPWANotification(ChartMessages.CHART_SUCCESS_HEADER, {
		body: ChartMessages.CHART_SUCCESS,
		icon: "../CSS/tab_icon.png",
		silent: true
	});
}
