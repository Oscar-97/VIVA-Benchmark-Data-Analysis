import { MergeData } from "../Src/Scripts/DataProcessing/MergeData";
import { TraceData } from "../Src/Scripts/Interfaces/Interfaces";

describe("MergeData", () => {
	const traceData: TraceData[] = [
		{ InputFileName: "alan", SolverName: "SCIP" },
		{ InputFileName: "ex1223", SolverName: "SCIP" }
	];

	it("should merge the matching object by InputFileName", () => {
		const data = [{ InputFileName: "alan", PrimalBoundProblem: 2.925 }];
		const merged = MergeData(traceData, data);

		expect(merged[0]).toEqual({
			InputFileName: "alan",
			SolverName: "SCIP",
			PrimalBoundProblem: 2.925
		});
	});

	it("should merge the matching object by name", () => {
		const data = [{ name: "ex1223", DualBoundProblem: 4.5 }];
		const merged = MergeData(traceData, data);

		expect(merged[1]).toMatchObject({
			InputFileName: "ex1223",
			name: "ex1223",
			DualBoundProblem: 4.5
		});
	});

	it("should fill the properties missing in an unmatched object with null", () => {
		const data = [{ InputFileName: "alan", PrimalBoundProblem: 2.925 }];
		const merged = MergeData(traceData, data);

		expect(merged[1]).toEqual({
			InputFileName: "ex1223",
			SolverName: "SCIP",
			PrimalBoundProblem: null
		});
	});

	it("should keep one result per trace data object and the order", () => {
		const data = [
			{ InputFileName: "ex1223", PrimalBoundProblem: 1 },
			{ InputFileName: "alan", PrimalBoundProblem: 2 }
		];
		const merged = MergeData(traceData, data);

		expect(
			merged.map((row) => {
				return row.InputFileName;
			})
		).toEqual(["alan", "ex1223"]);
	});

	it("should use the first matching object if several match", () => {
		const data = [
			{ InputFileName: "alan", PrimalBoundProblem: 1 },
			{ InputFileName: "alan", PrimalBoundProblem: 2 }
		];

		expect(MergeData(traceData, data)[0]).toMatchObject({
			PrimalBoundProblem: 1
		});
	});

	it("should merge all matching objects, so the primal and the dual bound can be on lines of their own", () => {
		const data = [
			{ InputFileName: "alan", PrimalBoundProblem: 2.925 },
			{ InputFileName: "alan", DualBoundProblem: 2.5 },
			{ InputFileName: "ex1223", PrimalBoundProblem: 4 }
		];
		const merged = MergeData(traceData, data);

		expect(merged[0]).toEqual({
			InputFileName: "alan",
			SolverName: "SCIP",
			PrimalBoundProblem: 2.925,
			DualBoundProblem: 2.5
		});
		expect(merged[1]).toEqual({
			InputFileName: "ex1223",
			SolverName: "SCIP",
			PrimalBoundProblem: 4,
			DualBoundProblem: null
		});
	});

	it("should keep the property of the first of the matching objects that have it", () => {
		const data = [
			{ InputFileName: "alan", PrimalBoundProblem: 1 },
			{ InputFileName: "alan", PrimalBoundProblem: 2, DualBoundProblem: 3 },
			{ name: "alan", DualBoundProblem: 4 }
		];

		expect(MergeData(traceData, data)[0]).toMatchObject({
			PrimalBoundProblem: 1,
			DualBoundProblem: 3
		});
	});

	it("should merge an entry once when it matches by both InputFileName and name", () => {
		const data = [
			{ InputFileName: "alan", name: "alan", PrimalBoundProblem: 2 }
		];

		expect(MergeData(traceData, data)[0]).toEqual({
			InputFileName: "alan",
			SolverName: "SCIP",
			name: "alan",
			PrimalBoundProblem: 2
		});
	});

	it("should return the rows unchanged without data to merge", () => {
		const merged = MergeData(traceData, []);
		expect(merged).toEqual(traceData);
	});

	it("should merge the first matching entry, whether it matches by InputFileName or by name", () => {
		const data = [
			{ name: "alan", PrimalBoundProblem: 1 },
			{ InputFileName: "alan", PrimalBoundProblem: 2 },
			{ InputFileName: "ex1223", PrimalBoundProblem: 3 },
			{ InputFileName: "ex1223", PrimalBoundProblem: 4 }
		];
		const merged = MergeData(traceData, data);

		expect(merged[0]).toMatchObject({ PrimalBoundProblem: 1 });
		expect(merged[1]).toMatchObject({ PrimalBoundProblem: 3 });
	});

	it("should not modify its input", () => {
		const copy = JSON.parse(JSON.stringify(traceData));
		MergeData(traceData, [{ InputFileName: "alan", name: "alan" }]);
		expect(traceData).toEqual(copy);
	});
});
