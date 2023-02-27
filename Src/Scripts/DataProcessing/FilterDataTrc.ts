import {
  CalculateDirection,
  CalculatePrimalBound,
  CalculateDualBound,
  SetTermStatus,
} from "./CalculateResults";

/**
 * Extract the data from the trc file.
 * @param RawData The provided raw data.
 * @returns TrcData Contains the processed trc results.
 */
export function ExtractTrcData(RawData: string[]): string[] {
  const TrcData = [];
  const FirstLine = RawData[0].split(",");

  /**
   * Check if headers are included in the .trc file. If they are found, include them, if not, use the custom headers.
   * TODO: Skip custom headers overall.
   */
  if (FirstLine[0].startsWith("*")) {
    console.log("Found headers.");
    /**
     * Remove "* " from InputFileName.
     */
    const Header = FirstLine.map((element: string) =>
      element.replace(/^[\*]/, "").trim()
    );
    console.log("Header: ", Header);

    for (let i = 1; i < RawData.length; i++) {
      const Obj = {};
      const CurrentLine = RawData[i].split(",");
      for (let j = 0; j < Header.length; j++) {
        Obj[Header[j]] = CurrentLine[j];
      }
      TrcData.push(Obj);
    }
  } else if (!FirstLine[0].startsWith("*")) {
    /**
     * Standard order of headers:
     * https://www.gamsworld.org/performance/trace.htm
     */
    const DefaultHeaders = [
      "InputFileName",
      "ModelType",
      "SolverName",
      "NLP",
      "MIP",
      "JulianDate",
      "Dir",
      "Equs",
      "Vars",
      "Disc",
      "NumberOfNonZeros",
      "NumberOfNonlinearNonZeros",
      "OptionFile",
      "ModelStatus",
      "TermStatus",
      "PrimalBoundSolver",
      "DualBoundSolver",
      "Time[s]",
      "NumberOfIterations",
      "NumberOfDomainViolations",
      "Nodes[i]",
      "UserComment",
    ];
    const PreviousRow = {};

    for (let i = 0; i < RawData.length; i++) {
      const CurrentLine = RawData[i].split(",");
      const FileName = CurrentLine[0];
      const SolverName = CurrentLine[2];

      // Check if the combination of filename and solver has been used earlier.
      if (PreviousRow[FileName] === SolverName) {
        continue;
      }
      PreviousRow[FileName] = SolverName;

      const Obj = {};
      for (let j = 0; j < DefaultHeaders.length; j++) {
        Obj[DefaultHeaders[j]] = CurrentLine[j];
      }
      /**
       * Modify keys.
       */
      if ("Dir" in Obj) {
        const CurrentDirValue = Obj.Dir;
        const NewDirValue = CalculateDirection(CurrentDirValue);
        Obj.Dir = NewDirValue;
      }

      if ("PrimalBoundSolver" in Obj) {
        const CurrentPrimalBoundValue = Obj.PrimalBoundSolver;
        const CurrentDirValue = Obj["Dir"];
        const NewPrimalBoundValue = CalculatePrimalBound(
          CurrentPrimalBoundValue,
          CurrentDirValue
        );
        Obj.PrimalBoundSolver = NewPrimalBoundValue;
      }

      if ("DualBoundSolver" in Obj) {
        const CurrentDualBoundValue = Obj.DualBoundSolver;
        const CurrentDirValue = Obj["Dir"];
        const NewDualBoundValue = CalculateDualBound(
          CurrentDualBoundValue,
          CurrentDirValue
        );
        Obj.DualBoundSolver = NewDualBoundValue;
      }

      if ("TermStatus" in Obj) {
        const CurrentTermValue = Obj.TermStatus;
        const NewTermValue = SetTermStatus(CurrentTermValue);
        Obj.TermStatus = NewTermValue;
      }

      /**
       * Create new keys for:
       */

      TrcData.push(Obj);
    }
  }
  return TrcData;
}

/**
 * Get the provided category and the corresponding data.
 * @param TrcData Contains the processed trc results.
 * @param DataCategory The data category to extract values from.
 * @returns DataCategoryResults The category results that will be returned.
 */
export function GetTrcDataCategory(
  TrcData: string[],
  DataCategory: string
): string[] {
  const DataCategoryResults = [];
  for (let i = 0; i < TrcData.length; i++) {
    DataCategoryResults.push(TrcData[i][DataCategory]);
  }
  return DataCategoryResults;
}
