import {
  xMaxInput,
  xMinInput,
  yMaxInput,
  yMinInput,
} from "../Elements/Elements";

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
 * Testing some chart creation.
 * @param ResultsData
 */
export function CreateChart(Type, Data, Label, Title): void {
  // Create chart using array of objects
  // @ts-ignore
  const chart = new Chart(document.getElementById("myChart"), {
    type: Type,
    data: {
      labels: [Label],
      datasets: Data,
    },
    options: {
      responsive: true,
      plugins: {
        // Add label plugin
        title: {
          display: true,
          text: Title,
        },
      },
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          const datasetIndex = tooltipItem.datasetIndex;
          const dataIndex = tooltipItem.index;
          const dataset = data.datasets[datasetIndex];
          const dataPoint = dataset.data[dataIndex];
          const xLabel = data.labels[dataIndex];
          const yLabel = dataPoint;
          const InputFileName =
            Data[datasetIndex].data[dataIndex].InputFileName;
          return `x: ${xLabel}, y: ${yLabel}\nInputFileName: ${InputFileName}`;
        },
      },
    },
  });
}

/**
 * Template for updating scales.
 */
// function UpdateChartScales() {
//   // Get the input values
//   const xmin = xMinInput.value;
//   const xmax = xMaxInput.value;
//   const ymin = yMinInput.value;
//   const ymax = yMaxInput.value;

//   // Update the x and y axis scales
//   // @ts-ignore
//   chart.options.scales.xAxes[0].ticks.min = parseFloat(xmin);
//   // @ts-ignore
//   chart.options.scales.xAxes[0].ticks.max = parseFloat(xmax);
//   // @ts-ignore
//   chart.options.scales.yAxes[0].ticks.min = parseFloat(ymin);
//   // @ts-ignore
//   chart.options.scales.yAxes[0].ticks.max = parseFloat(ymax);

//   // Update the chart
//   // @ts-ignore
//   chart.update();
// }
