import { ErrorMessages } from "../Constants/Messages";
import { ExtractTraceData } from "./FilterData";

/**
 * The kinds of files that the application can read.
 */
export type FileKind =
	| "trace"
	| "instances"
	| "bounds"
	| "configuration"
	| "unsupported";

/**
 * A file that the user chose, with what the application takes it for.
 */
export interface SelectedFile {
	name: string;
	kind: FileKind;
	/** What the file is used as, for example "Trace file". */
	label: string;
}

/**
 * The files that the user chose, and what stops them from being uploaded.
 */
export interface FileSelection {
	files: SelectedFile[];
	problems: string[];
}

const KINDS: Record<string, { kind: FileKind; label: string }> = {
	trc: { kind: "trace", label: "Trace file" },
	csv: { kind: "instances", label: "Instance information" },
	solu: { kind: "bounds", label: "Best-known bounds" },
	json: { kind: "configuration", label: "Saved configuration" }
};

/**
 * How many bytes of a trace file are read to find the name of the solver.
 */
const SAMPLE_BYTES = 20000;

/**
 * How many rows of a trace file are read to find the name of the solver.
 */
const SAMPLE_ROWS = 3;

function ExtensionOf(name: string): string {
	return name.split(".").pop() ?? "";
}

/**
 * Tells what the application takes the chosen files for, and what is wrong with the choice.
 * The rules are the ones that the upload applies, so a choice without problems can be uploaded.
 *
 * @param files - The files that the user chose.
 */
export function DescribeSelection(files: readonly File[]): FileSelection {
	const problems: string[] = [];
	const counts: Record<string, number> = {};
	const selected: SelectedFile[] = files.map((file) => {
		const extension = ExtensionOf(file.name);
		const known = KINDS[extension];
		if (!known) {
			problems.push(`${file.name}: ${ErrorMessages.INVALID_EXTENSION}`);
			return {
				name: file.name,
				kind: "unsupported",
				label: "Not supported"
			};
		}
		counts[extension] = (counts[extension] ?? 0) + 1;
		return { name: file.name, ...known };
	});

	problems.push(...FindCombinationProblems(counts, files.length));
	return { files: selected, problems };
}

/**
 * Finds what is wrong with the combination of the chosen files, given how many there are of each extension.
 */
function FindCombinationProblems(
	counts: Record<string, number>,
	total: number
): string[] {
	const problems: string[] = [];
	function Count(extension: string): number {
		return counts[extension] ?? 0;
	}
	for (const extension of ["csv", "solu", "json"]) {
		if (Count(extension) > 1) {
			problems.push(`Cannot upload multiple .${extension} files.`);
		}
	}

	const hasTrace = Count("trc") > 0;
	const hasConfiguration = Count("json") > 0;
	if (hasTrace && hasConfiguration) {
		problems.push(ErrorMessages.BOTH_EXTENSIONS);
	} else if (!hasTrace && !hasConfiguration && total > 0) {
		problems.push(ErrorMessages.NEITHER_EXTENSIONS);
	}
	return problems;
}

/**
 * Reads the name of the solver from the first rows of a trace file.
 *
 * @param file - The trace file.
 * @returns The name of the solver, or undefined if the file has no rows that can be read.
 */
export async function ReadSolverName(file: File): Promise<string | undefined> {
	try {
		const text = await file.slice(0, SAMPLE_BYTES).text();
		const sample: string[] = [];
		let rows = 0;
		for (const line of text.split(/\r?\n/)) {
			const trimmed = line.trim();
			if (trimmed === "") {
				continue;
			}
			sample.push(trimmed);
			if (!trimmed.startsWith("*") && ++rows >= SAMPLE_ROWS) {
				break;
			}
		}
		return ExtractTraceData(sample)[0]?.SolverName || undefined;
	} catch {
		return undefined;
	}
}
