import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import annotationPlugin from "chartjs-plugin-annotation";
import { chartCanvas } from "../Elements/Elements";
import { ShowPWANotification } from "../PWA/PWA-utils";
import { ChartMessages } from "../Constants/Messages";
let myChart = null;

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
	type,
	data,
	label,
	title,
	scaleOptions = null,
	zoomOptions = null,
	annotationOptions = null,
	subtitle = null
): void {
	/**
	 * Destroy the chart if it already exist.
	 */
	if (myChart) {
		myChart.destroy();
	}

	myChart = new Chart(chartCanvas, {
		type: type,
		data: {
			labels: typeof label === "string" ? [label] : label,
			datasets: data
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			scales: scaleOptions,
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
				subtitle: {
					display: subtitle ? true : false,
					text: subtitle
				},
				zoom: zoomOptions,
				annotation: annotationOptions
			}
		}
	});

	ShowPWANotification(ChartMessages.CHART_SUCCESS_HEADER, {
		body: ChartMessages.CHART_SUCCESS,
		icon: "../CSS/tab_icon.png",
		silent: true
	});
}
