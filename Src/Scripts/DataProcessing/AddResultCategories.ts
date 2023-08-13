import {
	CalculateDirection,
	CalculatePrimalBound,
	CalculateDualBound,
	SetTermStatus,
	CalculateDifference,
	CalculateGap,
	CalculateGapDifference
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

		obj["PrimalBoundSolver"] = CalculatePrimalBound(obj["Obj"], obj["Dir"]);

		obj["DualBoundSolver"] = CalculateDualBound(obj["Obj_Est"], obj["Dir"]);

		obj["TermStatus"] = SetTermStatus(obj["TermStatus"] as string | number);

		if (!obj.hasOwnProperty("PrimalBoundProblem")) {
			obj["PrimalBoundProblem"] = CalculatePrimalBound(
				obj["PrimalBoundSolver"],
				obj["Dir"]
			);
		}

		if (!obj.hasOwnProperty("DualBoundProblem")) {
			obj["DualBoundProblem"] = CalculateDualBound(
				obj["DualBoundSolver"],
				obj["Dir"]
			);
		}

		obj["Gap_Solver"] = CalculateGap(
			obj["PrimalBoundSolver"],
			obj["DualBoundSolver"],
			obj["Dir"]
		);

		obj["Gap_Problem"] = CalculateGap(
			obj["PrimalBoundProblem"],
			obj["DualBoundProblem"],
			obj["Dir"]
		);

		obj["PrimalGap"] = CalculateDifference(
			obj["PrimalBoundSolver"],
			obj["PrimalBoundProblem"]
		);

		obj["DualGap"] = CalculateDifference(
			obj["DualBoundSolver"],
			obj["DualBoundProblem"]
		);

		obj["Gap[%]"] = CalculateGapDifference(obj["PrimalGap"], obj["DualGap"]);
	}
}
