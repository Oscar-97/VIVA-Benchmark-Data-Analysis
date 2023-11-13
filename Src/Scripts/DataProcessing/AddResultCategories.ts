import {
	CalculateDirection,
	CalculatePrimalBound,
	CalculateDualBound,
	SetTermStatus,
	SetModelStatus,
	SetSolverStatus,
	CalculateGap
} from "./CalculateResults";

/**
 * Adds result categories to each object in the traceData array.
 *
 * @param traceData - Array of objects containing the data to be processed.
 *
 * @remarks
 * This function modifies the passed `traceData` array by adding calculated properties to each object.
 * Each object in the `traceData` array is expected to have certain properties like "Direction", "ObjectiveValue", and
 * "ObjectiveValueEstimate". The function uses these existing properties to calculate new ones.
 *
 * The specific calculations performed by this function and the functions it calls are not described here.
 * Please refer to the documentation of those functions for details.
 */
export function AddResultCategories(traceData: object[]): void {
	for (const obj of traceData) {
		obj["Direction"] = CalculateDirection(obj["Direction"]);

		obj["PrimalBoundSolver"] = CalculatePrimalBound(
			obj["ObjectiveValue"],
			obj["Direction"]
		);

		obj["DualBoundSolver"] = CalculateDualBound(
			obj["ObjectiveValueEstimate"],
			obj["Direction"]
		);

		obj["TermStatus"] = SetTermStatus(obj["TermStatus"] as string | number);

		obj["ModelStatus"] = SetModelStatus(obj["ModelStatus"] as string | number);

		obj["SolverStatus"] = SetSolverStatus(
			obj["SolverStatus"] as string | number
		);

		if (
			!obj.hasOwnProperty.call("PrimalBoundProblem") ||
			!obj["PrimalBoundProblem"]
		) {
			obj["PrimalBoundProblem"] = CalculatePrimalBound(
				obj["PrimalBoundSolver"],
				obj["Direction"]
			);
		}

		if (
			!obj.hasOwnProperty.call("DualBoundProblem") ||
			!obj["DualBoundProblem"]
		) {
			obj["DualBoundProblem"] = CalculateDualBound(
				obj["DualBoundSolver"],
				obj["Direction"]
			);
		}

		obj["Gap_Solver"] = CalculateGap(
			obj["PrimalBoundSolver"],
			obj["DualBoundSolver"],
			obj["Direction"]
		);

		obj["Gap_Problem"] = CalculateGap(
			obj["PrimalBoundProblem"],
			obj["DualBoundProblem"],
			obj["Direction"]
		);

		obj["PrimalGap"] = CalculateGap(
			obj["PrimalBoundSolver"],
			obj["PrimalBoundProblem"],
			obj["Direction"]
		);

		obj["DualGap"] = CalculateGap(
			obj["DualBoundSolver"],
			obj["DualBoundProblem"],
			obj["Direction"]
		);
	}
}
