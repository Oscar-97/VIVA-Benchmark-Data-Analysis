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
function DrawChart(chart: ChartArguments): void {
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
	if (myChart) {
		myChart.destroy();
	}

	ApplyChartTheme();

	myChart = new Chart(elements.chartCanvas, {
		type: type,
		data: {
			labels: typeof label === "string" ? [label] : label,
			datasets: data.map(AdaptDatasetToTheme)
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
 * Draws the chart again with the new colors. The zoom of the chart is reset.
 */
if (typeof window !== "undefined") {
	window.addEventListener(THEME_CHANGE_EVENT, () => {
		if (lastChart && myChart) {
			DrawChart(lastChart);
		}
	});
}
