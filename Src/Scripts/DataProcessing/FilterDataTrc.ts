import {
  CalculateDirection,
  CalculatePrimalBound,
  CalculateDualBound,
  SetTermStatus,
  CalculateGap,
  CalculateGapPercentage,
} from "./CalculateResults";

/**
 * Extract the data from the trc file.
 * @param RawData The provided raw data.
 * @returns TrcData Contains the processed trc results.
 */
export function ExtractTrcData(RawData: string[]): object[] {
  const TrcData = [];
  const FirstLine = RawData[0].split(",");

  /**
   * Check if headers are included in the .trc file.
   * If they are found, include them, if not, use the custom headers.
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
      "Obj",
      "Obj Est",
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
       * https://github.com/coin-or/Paver/blob/783a6f5d0d3782a168d0ef529d01bcbda91ea8a4
       * /src/paver/paver.py#L258-L290
       */

      Obj["Dir"] = CalculateDirection(Obj["Dir"]);

      Obj["PrimalBound Solver"] = CalculatePrimalBound(Obj["Obj"], Obj["Dir"]);

      Obj["DualBound Solver"] = CalculateDualBound(Obj["Obj Est"], Obj["Dir"]);

      if ("TermStatus" in Obj) {
        Obj["TermStatus"] = SetTermStatus(Obj["TermStatus"] as string | number);
      }

      Obj["PrimalBound Problem"] = CalculatePrimalBound(
        Obj["PrimalBound Solver"],
        Obj["Dir"]
      );

      Obj["DualBound Problem"] = CalculateDualBound(
        Obj["DualBound Solver"],
        Obj["Dir"]
      );

      Obj["Gap"] = CalculateGap(
        Obj["PrimalBound Solver"],
        Obj["DualBound Solver"]
      );

      Obj["PrimalGap"] = CalculateGap(
        Obj["PrimalBound Solver"],
        Obj["PrimalBound Problem"]
      );

      Obj["DualGap"] = CalculateGap(
        Obj["DualBound Solver"],
        Obj["DualBound Problem"]
      );

      Obj["Gap Problem"] = CalculateGap(
        Obj["DualBound Problem"],
        Obj["PrimalBound Problem"]
      );

      Obj["Gap[%] Solver"] = CalculateGapPercentage(
        Obj["PrimalBound Solver"],
        Obj["PrimalBound Problem"]
      );

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
  TrcData: object[],
  DataCategory: string
): string[] {
  const DataCategoryResults = [];
  for (let i = 0; i < TrcData.length; i++) {
    DataCategoryResults.push(TrcData[i][DataCategory]);
  }
  return DataCategoryResults;
}
