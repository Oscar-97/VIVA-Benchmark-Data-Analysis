import {
	DescribeSelection,
	ReadSolverName
} from "../Src/Scripts/DataProcessing/FileSelection";
import { ErrorMessages } from "../Src/Scripts/Constants/Messages";

function FileOf(name: string, content = ""): File {
	return new File([content], name);
}

describe("DescribeSelection", () => {
	it("says what each file is taken for", () => {
		const { files, problems } = DescribeSelection([
			FileOf("shot.trc"),
			FileOf("info.csv"),
			FileOf("bounds.solu")
		]);

		expect(files).toEqual([
			{ name: "shot.trc", kind: "trace", label: "Trace file" },
			{ name: "info.csv", kind: "instances", label: "Instance information" },
			{ name: "bounds.solu", kind: "bounds", label: "Best-known bounds" }
		]);
		expect(problems).toEqual([]);
	});

	it("accepts a saved configuration alone", () => {
		const { files, problems } = DescribeSelection([FileOf("config.json")]);

		expect(files[0]?.kind).toBe("configuration");
		expect(problems).toEqual([]);
	});

	it("names a file that cannot be used", () => {
		const { files, problems } = DescribeSelection([
			FileOf("shot.trc"),
			FileOf("picture.png")
		]);

		expect(files[1]?.kind).toBe("unsupported");
		expect(problems).toEqual([
			`picture.png: ${ErrorMessages.INVALID_EXTENSION}`
		]);
	});

	it("allows one file of the kinds that the upload takes once", () => {
		const { problems } = DescribeSelection([
			FileOf("a.trc"),
			FileOf("b.trc"),
			FileOf("a.csv"),
			FileOf("b.csv"),
			FileOf("a.solu"),
			FileOf("b.solu")
		]);

		expect(problems).toEqual([
			"Cannot upload multiple .csv files.",
			"Cannot upload multiple .solu files."
		]);
	});

	it("does not take two configuration files", () => {
		expect(
			DescribeSelection([FileOf("a.json"), FileOf("b.json")]).problems
		).toEqual(["Cannot upload multiple .json files."]);
	});

	it("does not mix trace files with a configuration", () => {
		expect(
			DescribeSelection([FileOf("a.trc"), FileOf("b.json")]).problems
		).toEqual([ErrorMessages.BOTH_EXTENSIONS]);
	});

	it("needs a trace file or a configuration", () => {
		expect(
			DescribeSelection([FileOf("a.csv"), FileOf("b.solu")]).problems
		).toEqual([ErrorMessages.NEITHER_EXTENSIONS]);
	});

	it("has nothing to say about no files", () => {
		expect(DescribeSelection([])).toEqual({ files: [], problems: [] });
	});
});

describe("ReadSolverName", () => {
	it("reads the solver from a trace file without a header", async () => {
		const trace = FileOf(
			"run.trc",
			"alan,MINLP,shot,NONE,CPLEX,43381.77804,0,8,9,4,24,3,1,8,1,2.925,2.925,0.04,0,0,0,#\r\n"
		);

		expect(await ReadSolverName(trace)).toBe("shot");
	});

	it("reads the solver from a trace file with a header", async () => {
		const trace = FileOf(
			"run.trc",
			"* InputFileName,ModelType,SolverName\nalan,MINLP,scip\n"
		);

		expect(await ReadSolverName(trace)).toBe("scip");
	});

	it("has no solver for an empty file", async () => {
		expect(await ReadSolverName(FileOf("empty.trc"))).toBeUndefined();
	});
});
