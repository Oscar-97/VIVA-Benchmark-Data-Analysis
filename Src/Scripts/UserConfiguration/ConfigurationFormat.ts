import { DEFAULT_HEADERS } from "../Constants/TraceHeaders";
import { UserData } from "../Interfaces/Interfaces";

/**
 * The version of the configuration that is written. Version 1 has no version field, and its `dataSet` is a list of
 * the lines of a trace file as text. In version 2 every row is an object with the names of the columns as keys.
 */
export const CONFIGURATION_VERSION = 2;

/**
 * A row of the data set of a configuration: the name of a column and its value.
 */
export type ConfigurationRow = Record<string, string | number | boolean>;

/**
 * A value of a trace file for a row of the configuration: a number or a boolean when writing it gives the same
 * text back, and else the text, so no value changes on the way through a configuration.
 */
function ToValue(cell: string): string | number | boolean {
	if (cell === "true") {
		return true;
	}
	if (cell === "false") {
		return false;
	}
	const number = Number(cell);
	return cell !== "" && Number.isFinite(number) && String(number) === cell
		? number
		: cell;
}

/**
 * The names of the columns of a trace file: the ones in the header lines, which start with an asterisk, or else
 * the default ones.
 */
function ReadHeaders(lines: readonly string[]): string[] {
	if (!lines[0]?.startsWith("*")) {
		return DEFAULT_HEADERS;
	}
	const headers: string[] = [];
	for (const line of lines) {
		if (!line.startsWith("*")) {
			break;
		}
		for (const header of line.slice(1).split(",")) {
			if (header.trim() !== "") {
				headers.push(header.trim());
			}
		}
	}
	return headers;
}

/**
 * Makes the rows of a configuration from the lines of a trace file. A line that has fewer cells than there are
 * columns has no value for the other columns, and the cells after the last column are left out, as when the file
 * is read.
 *
 * @param lines - The lines of a trace file, with or without header lines.
 */
export function LinesToRows(lines: readonly string[]): ConfigurationRow[] {
	const headers = ReadHeaders(lines);
	const rows: ConfigurationRow[] = [];
	for (const line of lines) {
		const cells = line.split(",");
		if (line.startsWith("*") || cells.every((cell) => cell.trim() === "")) {
			continue;
		}
		const row: ConfigurationRow = {};
		headers.forEach((header, index) => {
			const cell = cells[index];
			if (cell !== undefined) {
				row[header] = ToValue(cell);
			}
		});
		rows.push(row);
	}
	return rows;
}

/**
 * Makes the lines of a trace file from the rows of a configuration: a header line with the names of the columns in
 * the order in which they first appear, and a line for every row. A column that a row does not have is empty.
 *
 * @param rows - The rows of the configuration.
 */
export function RowsToLines(rows: readonly ConfigurationRow[]): string[] {
	const columns = new Set<string>();
	for (const row of rows) {
		for (const column of Object.keys(row)) {
			columns.add(column);
		}
	}
	if (columns.size === 0) {
		return [];
	}
	const names = [...columns];
	return [
		`* ${names.join(",")}`,
		...rows.map((row) => names.map((name) => String(row[name] ?? "")).join(","))
	];
}

function IsRow(value: unknown): value is ConfigurationRow {
	return (
		typeof value === "object" &&
		value !== null &&
		!Array.isArray(value) &&
		Object.values(value).every((cell) =>
			["string", "number", "boolean"].includes(typeof cell)
		)
	);
}

/**
 * Reads the `dataSet` of a configuration as the lines of a trace file. It is either the lines as text (version 1)
 * or the rows as objects (version 2), not a mix of them.
 *
 * @param dataSet - The `dataSet` of the configuration.
 * @returns The lines, or undefined when the `dataSet` is of neither kind.
 */
export function ReadDataSet(dataSet: unknown): string[] | undefined {
	if (!Array.isArray(dataSet)) {
		return undefined;
	}
	if (dataSet.every((entry) => typeof entry === "string")) {
		return dataSet;
	}
	return dataSet.every(IsRow) ? RowsToLines(dataSet) : undefined;
}

/**
 * Whether this version of the application can read a configuration of the version. A configuration without a
 * version is one of version 1.
 */
export function IsSupportedVersion(version: unknown): boolean {
	return (
		version === undefined ||
		(typeof version === "number" &&
			Number.isInteger(version) &&
			version >= 1 &&
			version <= CONFIGURATION_VERSION)
	);
}

/**
 * Gives a configuration the current format: the version, and the rows as objects. A configuration of the current
 * format is returned as it is.
 *
 * @param configuration - A configuration of any supported version.
 * @returns The configuration in the current format, or undefined when it cannot be read.
 */
export function UpgradeConfiguration(
	configuration: UserData
): UserData | undefined {
	const lines = ReadDataSet(configuration.dataSet);
	if (!lines || !IsSupportedVersion(configuration.version)) {
		return undefined;
	}
	return {
		...configuration,
		version: CONFIGURATION_VERSION,
		dataSet: LinesToRows(lines)
	};
}
