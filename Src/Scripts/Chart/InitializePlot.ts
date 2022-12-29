import { GetCheckedSolvers, GetComparisonArray } from "../Solvers/UsedSolvers";
import { CreateChart } from "./CreateChart";
import { SelectAllButton } from "../Elements/Elements";

export function InitializePlots(Solvers: string | any[], ResultsData: string | any[]) {
    let CheckedSolvers = GetCheckedSolvers();
    let ComparisonArray = GetComparisonArray(CheckedSolvers, Solvers);

    /**
     * @param CreateChart Filter and display the data in plots when clicking on the view plots button.
     */
    CreateChart(Solvers, ResultsData, ComparisonArray);
    SelectAllButton.disabled = false;
}