import { CreateChart } from "./CreateChart";
import { SelectAllButton } from "../Elements/Elements";

export function InitializePlots(
  ResultsData: any[]
): void {

  /**
   * @param CreateChart Display the data in a plot when clicking on the view plots button.
   */
  CreateChart(ResultsData);
  SelectAllButton.disabled = false;
}
