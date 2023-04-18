import { ViewPlotsButton } from "../Elements/Elements";
import {
  AnalyzeDataByCategory,
  ExtractAllSolverTimes,
} from "../DataProcessing/CalculateResults";
import { PickColor, CreateChart } from "./CreateChart";
import { StatisticsTable } from "../DataTable/DataTableBase";

/**
 * Plot by result category
 * @param TrcData Current TrcData.
 * @param Type Type of plot.
 * @param Category Name of the category.
 * @param Label Label for the plot.
 * @param Title Title for the plot.
 */
export function PlotDataByCategory(
  TrcData: object[],
  Type: string,
  Category: string,
  Label: string,
  Title: string
): void {
  ViewPlotsButton.disabled = false;
  ViewPlotsButton.addEventListener("click", () => {
    const data = AnalyzeDataByCategory(TrcData, Category);
    console.log("Data for category", Category, ": ", data);

    const type = Type;
    const colors = [PickColor(), PickColor(), PickColor()];
    const chartData = Object.entries(data).map(([key, value], index) => ({
      label: key,
      data: [value.average],
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length],
    }));

    console.log("Data for chart", Label, ": ", chartData);
    CreateChart(type, chartData, Label, Title);
    StatisticsTable(data, Title);
  });
}

/**
 * Plot all the solver times without any failed results.
 */
export function PlotAllSolverTimes(TrcData: object[]): void {
  ViewPlotsButton.disabled = false;
  ViewPlotsButton.addEventListener("click", () => {
    const SolverTimes = ExtractAllSolverTimes(TrcData);
    const Data = (Object.entries(SolverTimes) as [string, number[]][]).map(
      ([key, values]) => ({
        label: key,
        data: values.map((val, index) => ({ x: index, y: val })),
      })
    );

    console.log("Data structure: ", Data);
    CreateChart("scatter", Data, "", "Solver times");
  });
}
