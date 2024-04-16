import { TraceData } from "../Interfaces/Interfaces";
import {
	CalculateDirection,
	CalculatePrimalBound,
	CalculateDualBound,
	SetModelStatus,
	SetSolverStatus,
	CalculateGap
} from "./CalculateResults";

/**
 * This function adds result categories to each object in the traceData array.
 *
 * @param {object[]} traceData - Array of objects containing the data to be processed.
 *
 * @remarks
 * It modifies the passed `traceData` array by adding calculated properties to each object.
 * Each object in the `traceData` array is expected to have certain properties like "Direction", "ObjectiveValue", and
 * "ObjectiveValueEstimate". The function uses these existing properties to calculate new ones.
 *
 * The specific calculations performed by this function and the functions it calls are not described here.
 * Please refer to the documentation of those functions for details.
 */
export function AddResultCategories(traceData: TraceData[]): void {
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

		obj["ModelStatus"] = SetModelStatus(obj["ModelStatus"] as string | number);

		obj["SolverStatus"] = SetSolverStatus(
			obj["SolverStatus"] as string | number
		);

		if (!("PrimalBoundProblem" in obj) || !obj["PrimalBoundProblem"]) {
			obj["PrimalBoundProblem"] = CalculatePrimalBound(
				obj["PrimalBoundSolver"],
				obj["Direction"]
			);
		}

		if (!("DualBoundProblem" in obj) || !obj["DualBoundProblem"]) {
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
			obj["PrimalBoundProblem"] as number,
			obj["DualBoundProblem"] as number,
			obj["Direction"]
		);

		obj["PrimalGap"] = CalculateGap(
			obj["PrimalBoundSolver"],
			obj["PrimalBoundProblem"] as number,
			obj["Direction"]
		);

		obj["DualGap"] = CalculateGap(
			obj["DualBoundSolver"],
			obj["DualBoundProblem"] as number,
			obj["Direction"]
		);
	}
}
