import { FormatNumber } from "../Locale";

/**
 * The settings that a comparison of two solvers was made with.
 */
export interface ComparisonSettings {
	/** The termination status of the runs that are compared, for example "Normal Completion". */
	terminationStatus: string;
	/** The gap that is limited, for example "Primal Gap". */
	gapType: string;
	/** The largest gap, in percent, of a run that is compared. */
	gapLimit: number;
	/** The time, in seconds, that is used for a run without a time. */
	timeLimit: number;
}

/**
 * Says what a comparison was made with, so a table of numbers can be read without looking at the fields above it.
 *
 * @param settings - The settings of the comparison.
 * @returns For example "Normal Completion, Primal Gap <= 0.01 %, time limit 1000 s."
 */
export function DescribeComparisonSettings(
	settings: ComparisonSettings
): string {
	return `${settings.terminationStatus}, ${settings.gapType} <= ${FormatNumber(
		settings.gapLimit
	)} %, time limit ${FormatNumber(settings.timeLimit)} s.`;
}
