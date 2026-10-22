import { AddResultCategories } from "../Src/Scripts/DataProcessing/AddResultCategories";
import { TraceData } from "../Src/Scripts/Interfaces/Interfaces";
import { At } from "./TestHelpers";

function Row(values: TraceData): TraceData {
	return {
		InputFileName: "a",
		SolverName: "S",
		Direction: "0",
		ModelStatus: "1",
		SolverStatus: "1",
		ObjectiveValue: "10",
		ObjectiveValueEstimate: "10",
		...values
	};
}

describe("AddResultCategories", () => {
	it("does nothing for an empty array", () => {
		const rows: TraceData[] = [];
		AddResultCategories(rows);
		expect(rows).toEqual([]);
	});

	it("translates the direction and the statuses", () => {
		const rows = [Row({}), Row({ Direction: "1", ModelStatus: "4" })];
		AddResultCategories(rows);
		expect(At(rows, 0)["Direction"]).toBe("min");
		expect(At(rows, 0)["ModelStatus"]).toBe("Optimal");
		expect(At(rows, 0)["SolverStatus"]).toBe("Normal Completion");
		expect(At(rows, 1)["Direction"]).toBe("max");
		expect(At(rows, 1)["ModelStatus"]).toBe("Infeasible");
	});

	it("copies the solver bounds and gives a zero gap when they agree", () => {
		const rows = [Row({})];
		AddResultCategories(rows);
		const row = At(rows, 0);
		expect(row["PrimalBoundSolver"]).toBe("1.000000e+1");
		expect(row["DualBoundSolver"]).toBe("1.000000e+1");
		expect(row["Gap_Solver"]).toBe(0);
		expect(row["Fail"]).toBe(false);
	});

	it("falls back to the solver bounds when the problem bounds are missing or empty", () => {
		const rows = [
			Row({}),
			Row({ PrimalBoundProblem: "", DualBoundProblem: "" })
		];
		AddResultCategories(rows);
		for (const row of rows) {
			expect(row["PrimalBoundProblem"]).toBe(row["PrimalBoundSolver"]);
			expect(row["DualBoundProblem"]).toBe(row["DualBoundSolver"]);
		}
	});

	it("keeps the problem bounds that are given", () => {
		const rows = [Row({ PrimalBoundProblem: "12", DualBoundProblem: "8" })];
		AddResultCategories(rows);
		expect(At(rows, 0)["PrimalBoundProblem"]).toBe("12");
		expect(At(rows, 0)["DualBoundProblem"]).toBe("8");
	});

	it("gives a gap of at least zero for a bounded solver gap", () => {
		const rows = [
			Row({ ObjectiveValue: "12", ObjectiveValueEstimate: "8" }),
			Row({ Direction: "1", ObjectiveValue: "8", ObjectiveValueEstimate: "12" })
		];
		AddResultCategories(rows);
		for (const row of rows) {
			expect(Number(row["Gap_Solver"])).toBeGreaterThan(0);
		}
	});

	it("processes every row on its own", () => {
		const rows = [
			Row({ InputFileName: "a" }),
			Row({ InputFileName: "b", Direction: "1" })
		];
		AddResultCategories(rows);
		expect(At(rows, 0)["Direction"]).toBe("min");
		expect(At(rows, 1)["Direction"]).toBe("max");
	});
});
