import {
  xMaxInput,
  xMinInput,
  yMaxInput,
  yMinInput,
} from "../Elements/Elements";

export function CreateChart(
  Solvers: string | any[],
  ResultsData: string | any[],
  ComparisonArray: any[]
): void {
  let myChart: Chart | null = null;
  const ctx = document.getElementById("myChart") as HTMLCanvasElement;
  /**
   * If canvas exist -> update it.
   */
  // if (ctx.width != 300) {
  //     console.log("Canvas already exist. Updating axes values.");

  //     const xMax = parseInt(xMaxInput.value)
  //     const xMin = parseInt(xMinInput.value)
  //     const yMax = parseInt(yMaxInput.value)
  //     const yMin = parseInt(yMinInput.value)

  //     myChart.options.scales = {
  //         // @ts-ignore
  //         x: [{
  //             min: xMin,
  //             max: xMax
  //         }],
  //         y: [{
  //             min: yMin,
  //             max: yMax
  //         }]
  //     };
  //     myChart.update();

  // } else {
  /**
   * Create the X and Y data for Chart.js.
   * @param LoopCount
   * @returns X and Y data.
   */
  function CreateXAndYData(LoopCount: number): string[] {
    const TempData = [];
    const TempData2 = [];
    const IndexOfPrimGap = LoopCount * 8 + 10;
    for (var i = 0; i < ResultsData.length; i++) {
      TempData.push(ResultsData[i][IndexOfPrimGap]);
    }
    for (var i = 0; i < ResultsData.length; i++) {
      TempData2.push({ x: TempData[i], y: i });
    }
    return TempData2;
  }

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
   * Fetch data for the selected solvers.
   */
  const SelectedSolvers = [];
  for (let i = 0; i < Solvers.length; i++) {
    console.log("Status: ", ComparisonArray[i]);
    // Only run if the solvers are used.
    if (ComparisonArray[i] === "Used") {
      console.log("Creating dataset for: ", Solvers[i]);
      // Push the label and the data to the dataset.
      SelectedSolvers.push({
        label: Solvers[i],
        data: CreateXAndYData(i),
        backgroundColor: PickColor(),
      });
    }
  }
  console.log("Dataset content: ", SelectedSolvers);

  /**
   * @param CreatedDataset Dataset to be used in the chart.
   */
  const CreatedDataset = {
    datasets: SelectedSolvers,
  };

  // @ts-ignore
  myChart = new Chart(ctx, {
    type: "scatter",
    data: CreatedDataset,
    options: {
      plugins: {
        title: {
          display: true,
          text: "Absolute performance profile (PrimalGap)",
        },
      },
      scales: {
        // @ts-ignore
        x: {
          type: "linear",
          position: "bottom",
          gridLines: {
            display: true,
          },
          title: {
            display: true,
            text: "PrimalGap",
          },
          ticks: {
            min: parseInt(xMinInput.value),
            max: parseInt(xMaxInput.value),
          },
        },
        y: {
          type: "linear",
          position: "left",
          gridLines: {
            display: true,
          },
          title: {
            display: true,
            text: "Number of instances.",
          },
          ticks: {
            min: parseInt(yMinInput.value),
            max: parseInt(yMaxInput.value),
          },
        },
      },
    },
  });
}
//}

// export function UpdateChartScales(myChart, xMax, xMin, yMax, yMin) {
//     myChart.options.scales = {
//         x: {
//             min: xMin,
//             max: xMax,
//         },
//         y: {
//             min: yMin,
//             max: yMax,
//         }
//     };
//     myChart.update();
// }
