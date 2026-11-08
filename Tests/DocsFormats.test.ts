jest.mock("../Src/Scripts/Elements/Events/DisplayAlertNotification", () => ({
	DisplayAlertNotification: jest.fn()
}));

import * as fs from "fs";
import * as path from "path";
import { MergeData } from "../Src/Scripts/DataProcessing/MergeData";
import {
	GetBestKnownBounds,
	GetInstanceInformation
} from "../Src/Scripts/DataProcessing/ReadMetaData";
import { ExtractTraceData } from "../Src/Scripts/DataProcessing/FilterData";
import { CategoriesObj } from "../Src/Scripts/Interfaces/Interfaces";

const readme = fs.readFileSync(
	path.join(__dirname, "..", "Src", "Docs", "README.md"),
	"utf8"
);

/**
 * The lines of the code block of the given language in the section of the documentation.
 */
function ExampleLines(section: string, language: string): string[] {
	const from = readme.indexOf(section);
	const match = new RegExp("```" + language + "\\r?\\n([\\s\\S]*?)```").exec(
		readme.slice(from)
	);
	return (match?.[1] ?? "").split(/\r?\n/).filter((line) => line !== "");
}

describe("the .csv example of the documentation", () => {
	const lines = ExampleLines("### 2.3 .csv", "csv");

	it("should be read as instance information, with the bounds renamed", () => {
		expect(GetInstanceInformation(lines)).toEqual([
			{
				name: "alan",
				application: "Portfolio Optimization",
				nvars: "8",
				ncons: "7",
				PrimalBoundProblem: "2.925",
				DualBoundProblem: "2.925"
			},
			{
				name: "alkyl",
				application: "Alkylation",
				nvars: "14",
				ncons: "7",
				PrimalBoundProblem: "-1.764999646",
				DualBoundProblem: "-1.765001273"
			}
		]);
	});

	it("should join the results by the name of the instance, and leave the other instances empty", () => {
		const results = ExtractTraceData([
			"* InputFileName,SolverName",
			"alan,shot",
			"other,shot"
		]);

		const merged = MergeData(
			results,
			GetInstanceInformation(lines) as CategoriesObj[]
		);

		expect(merged[0]).toMatchObject({
			InputFileName: "alan",
			application: "Portfolio Optimization"
		});
		expect(merged[1]).toMatchObject({
			InputFileName: "other",
			application: null
		});
	});
});

describe("the .solu example of the documentation", () => {
	const lines = ExampleLines("### 2.4 .solu", "text");

	it("should give the bounds that the documentation names", () => {
		expect(GetBestKnownBounds(lines)).toEqual([
			{ InputFileName: "4stufen", PrimalBoundProblem: "1.163297e+5" },
			{ InputFileName: "4stufen", DualBoundProblem: "1.093096e+5" },
			{
				InputFileName: "alan",
				PrimalBoundProblem: "2.925000e+0",
				DualBoundProblem: "2.925000e+0"
			},
			{
				InputFileName: "infeasible_example",
				PrimalBoundProblem: Infinity,
				DualBoundProblem: Infinity
			}
		]);
	});

	it("should give an instance on two lines both of its bounds", () => {
		const merged = MergeData(
			ExtractTraceData(["* InputFileName,SolverName", "4stufen,shot"]),
			GetBestKnownBounds(lines) as CategoriesObj[]
		);

		expect(merged[0]).toMatchObject({
			PrimalBoundProblem: "1.163297e+5",
			DualBoundProblem: "1.093096e+5"
		});
	});

	it("should have a bound of the .solu file replace the one of the .csv file", () => {
		const results = ExtractTraceData([
			"* InputFileName,SolverName",
			"alan,shot"
		]);
		const withInstances = MergeData(
			results,
			GetInstanceInformation([
				"name;primalbound;dualbound",
				"alan;1;2"
			]) as CategoriesObj[]
		);

		const merged = MergeData(
			withInstances,
			GetBestKnownBounds(["=best= alan 5"]) as CategoriesObj[]
		);

		// Only the primal bound is in the .solu file, the dual bound stays as the .csv file has it.
		expect(merged[0]).toMatchObject({
			PrimalBoundProblem: "5.000000e+0",
			DualBoundProblem: "2"
		});
	});
});
