import Chart from "chart.js/auto";
let myChart = null;

/**
 * Generates an array of random hex color codes.
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
 * Creates a new Chart.js chart. If a chart already exists, it is destroyed before a new one is created.
 *
 * @param type - The type of chart to create (e.g., 'line', 'bar', 'pie').
 * @param data - The data for the chart, which should be an array of objects.
 * @param label - The label/s for the data.
 * @param title - The title of the chart.
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
	scaleOptions = null
): void {
	/**
	 * Destroy the chart if it already exist.
	 */
	if (myChart) {
		myChart.destroy();
	}

	const chartCanvas = document.getElementById("myChart") as HTMLCanvasElement;
	myChart = new Chart(chartCanvas, {
		type: type,
		data: {
			labels: typeof label === "string" ? [label] : label,
			datasets: data
		},
		options: {
			responsive: true,
			scales: scaleOptions,
			plugins: {
				title: {
					display: true,
					text: title
				}
			},
			tooltips: {
				callbacks: {
					label: function (tooltipItem, data): string {
						const datasetIndex = tooltipItem.datasetIndex;
						const dataIndex = tooltipItem.index;
						const dataset = data.datasets[datasetIndex];
						const dataPoint = dataset.data[dataIndex];
						const xLabel = data.labels[dataIndex];
						const yLabel = dataPoint;
						const inputFileName =
							data[datasetIndex].data[dataIndex].InputFileName;
						return `x: ${xLabel}, y: ${yLabel}\nInputFileName: ${inputFileName}`;
					}
				}
			}
		}
	});
}
