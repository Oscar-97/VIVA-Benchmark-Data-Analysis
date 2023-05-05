import {
  CalculateDirection,
  CalculatePrimalBound,
  CalculateDualBound,
  SetTermStatus,
  CalculateGap,
  CalculateGapPercentage,
} from "./CalculateResults";

/**
 * Add and modify keys with new result categories.
 * https://github.com/coin-or/Paver/blob/783a6f5d0d3782a168d0ef529d01bcbda91ea8a4
 * /src/paver/paver.py#L258-L290
 */
export function AddResultCategories(TrcData: object[]): void {
  for (const Obj of TrcData) {
    Obj["Dir"] = CalculateDirection(Obj["Dir"]);

    Obj["PrimalBound Solver"] = CalculatePrimalBound(Obj["Obj"], Obj["Dir"]);
    Obj["DualBound Solver"] = CalculateDualBound(Obj["Obj Est"], Obj["Dir"]);

    Obj["TermStatus"] = SetTermStatus(Obj["TermStatus"] as string | number);

    if (!Obj.hasOwnProperty("PrimalBound Problem")) {
      Obj["PrimalBound Problem"] = CalculatePrimalBound(
        Obj["PrimalBound Solver"],
        Obj["Dir"]
      );
    }

    if (!Obj.hasOwnProperty("DualBound Problem")) {
      Obj["DualBound Problem"] = CalculateDualBound(
        Obj["DualBound Solver"],
        Obj["Dir"]
      );
    }

    Obj["Gap"] = CalculateGap(
      Obj["PrimalBound Solver"],
      Obj["DualBound Solver"],
      Obj["Dir"]
    );

    Obj["PrimalGap"] = CalculateGap(
      Obj["PrimalBound Solver"],
      Obj["PrimalBound Problem"],
      Obj["Dir"]
    );

    Obj["DualGap"] = CalculateGap(
      Obj["DualBound Solver"],
      Obj["DualBound Problem"],
      Obj["Dir"]
    );

    Obj["Gap Problem"] = CalculateGap(
      Obj["DualBound Problem"],
      Obj["PrimalBound Problem"],
      Obj["Dir"]
    );

    Obj["Gap[%] Solver"] = CalculateGapPercentage(
      Obj["PrimalBound Solver"],
      Obj["PrimalBound Problem"]
    );
  }
}
