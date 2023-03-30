import { data } from "jquery";
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
function PickColor(): string {
  const Hex = Math.floor(Math.random() * 16777215).toString(16);
  const Color = "#" + Hex;
  return Color;
}

/**
 * Testing some chart creation.
 * @param ResultsData
 */
export function CreateChart(ResultsData: any[]): void {
  const groupedData = {};
  ResultsData.forEach((item) => {
    if (!groupedData[item.SolverName]) {
      groupedData[item.SolverName] = [];
    }
    const timeValue =
      item["Time[s]"] !== "" ? parseFloat(item["Time[s]"]) : null;
    groupedData[item.SolverName].push(timeValue);
  });

  // Calculate average time for each group
  const averageDataArray = Object.keys(groupedData).map((solverName) => {
    const filteredGroupData = groupedData[solverName].filter(
      (item) => item !== null
    );
    const total = filteredGroupData.reduce((acc, curr) => acc + curr, 0);
    const average =
      filteredGroupData.length > 0 ? total / filteredGroupData.length : null;
    return { SolverName: solverName, AverageTime: average };
  });

  // Create array of objects for chart data
  const chartDataArray = averageDataArray.map((item) => {
    return { x: item.SolverName, y: item.AverageTime };
  });

  // Create array of labels for chart x-axis
  const labelsArray = averageDataArray.map((item) => item.SolverName);

  // Create chart using array of objects
  // @ts-ignore
  const chart = new Chart(document.getElementById("myChart"), {
    type: "bar",
    data: {
      datasets: [
        {
          label: "Average Time Taken",
          data: chartDataArray,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            type: "category",
            labels: labelsArray,
            scaleLabel: {
              display: true,
              labelString: "Solver Name",
            },
          },
        ],
        yAxes: [
          {
            type: "logarithmic", // Use logarithmic scale
            ticks: {
              min: 0.001, // Set minimum value to 0.001 instead of 0
              callback: function (value, index, values) {
                return value.toLocaleString(); // Format tick labels with commas
              },
            },
            scaleLabel: {
              display: true,
              labelString: "Average Time",
            },
          },
        ],
      },
    },
  });
}

/**
 * Template for updating scales.
 */
function UpdateChartScales() {
  // Get the input values
  const xmin = xMinInput.value;
  const xmax = xMaxInput.value;
  const ymin = yMinInput.value;
  const ymax = yMaxInput.value;

  // Update the x and y axis scales
  // @ts-ignore
  chart.options.scales.xAxes[0].ticks.min = parseFloat(xmin);
  // @ts-ignore
  chart.options.scales.xAxes[0].ticks.max = parseFloat(xmax);
  // @ts-ignore
  chart.options.scales.yAxes[0].ticks.min = parseFloat(ymin);
  // @ts-ignore
  chart.options.scales.yAxes[0].ticks.max = parseFloat(ymax);

  // Update the chart
  // @ts-ignore
  chart.update();
}
