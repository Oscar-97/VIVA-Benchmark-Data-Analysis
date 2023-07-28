import {
	CalculateDirection,
	CalculatePrimalBound,
	CalculateDualBound,
	SetTermStatus,
	CalculateDifference,
	CalculateGap,
	CalculateGapPercentage
} from "./CalculateResults";

/**
 * Add and modify keys with new result categories.
 * https://github.com/coin-or/Paver/blob/783a6f5d0d3782a168d0ef529d01bcbda91ea8a4
 * /src/paver/paver.py#L258-L290
 */
export function AddResultCategories(traceData: object[]): void {
	for (const obj of traceData) {
		obj["Dir"] = CalculateDirection(obj["Dir"]);

		obj["PrimalBound Solver"] = CalculatePrimalBound(obj["Obj"], obj["Dir"]);

		obj["DualBound Solver"] = CalculateDualBound(obj["Obj Est"], obj["Dir"]);

		obj["TermStatus"] = SetTermStatus(obj["TermStatus"] as string | number);

		if (!obj.hasOwnProperty("PrimalBound Problem")) {
			obj["PrimalBound Problem"] = CalculatePrimalBound(
				obj["PrimalBound Solver"],
				obj["Dir"]
			);
		}

		if (!obj.hasOwnProperty("DualBound Problem")) {
			obj["DualBound Problem"] = CalculateDualBound(
				obj["DualBound Solver"],
				obj["Dir"]
			);
		}

		obj["Gap Solver"] = CalculateGap(
			obj["PrimalBound Solver"],
			obj["DualBound Solver"],
			obj["Dir"]
		);

		obj["Gap Problem"] = CalculateGap(
			obj["PrimalBound Problem"],
			obj["DualBound Problem"],
			obj["Dir"]
		);

		obj["PrimalGap"] = CalculateDifference(
			obj["PrimalBound Solver"],
			obj["PrimalBound Problem"]
		);

		obj["DualGap"] = CalculateDifference(
			obj["DualBound Solver"],
			obj["DualBound Problem"]
		);

		obj["Gap[%] Solver"] = CalculateGapPercentage(
			obj["PrimalBound Solver"],
			obj["DualBound Solver"],
			obj["Dir"]
		);
	}
}
