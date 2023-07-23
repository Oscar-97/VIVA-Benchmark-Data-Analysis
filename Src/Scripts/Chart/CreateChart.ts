import Chart from "chart.js/auto";
let myChart = null;

/**
 * Add a random color for the dataset.
 * @param PickColor Color picker for the data.
 * @returns Random different colors for each solver.
 */
export function PickColor(): string {
	const Hex = Math.floor(Math.random() * 16777215).toString(16);
	const Color = "#" + Hex;
	return Color;
}

/**
 * Chart creation with Chart.js
 */
export function CreateChart(Type, Data, Label, Title): void {
	/**
	 * Destroy the chart if it already exist.
	 */
	if (myChart) {
		myChart.destroy();
	}

	// Create chart using array of objects
	const chartCanvas = document.getElementById("myChart") as HTMLCanvasElement;
	myChart = new Chart(chartCanvas, {
		type: Type,
		data: {
			labels: [Label],
			datasets: Data
		},
		options: {
			responsive: true,
			plugins: {
				title: {
					display: true,
					text: Title
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
						const InputFileName =
							Data[datasetIndex].data[dataIndex].InputFileName;
						return `x: ${xLabel}, y: ${yLabel}\nInputFileName: ${InputFileName}`;
					}
				}
			}
		}
	});
}
