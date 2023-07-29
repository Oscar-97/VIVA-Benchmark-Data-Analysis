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
 * Adds result categories to each object in the traceData array.
 *
 * @param traceData - Array of objects containing the data to be processed.
 *
 * @remarks
 * This function modifies the passed `traceData` array by adding calculated properties to each object.
 * Each object in the `traceData` array is expected to have certain properties like "Dir", "Obj",
 * "Obj Est", and "TermStatus". The function uses these existing properties to calculate new ones.
 * If an object in the `traceData` array already has a property that the function tries to add,
 * the existing property will not be overwritten.
 *
 * The specific calculations performed by this function and the functions it calls are not described here.
 * Please refer to the documentation of those functions for details.
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
