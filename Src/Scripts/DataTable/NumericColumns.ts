/**
 * The sort values of a number that has no value of its own to sort by: infinity is the largest and the smallest
 * number there is, and a missing number or NaN is put with the smallest ones.
 */
const LARGEST = Number.MAX_VALUE;
const SMALLEST = -Number.MAX_VALUE;

/**
 * The number that a value is: a number, or a text that is written as one, such as "1.510000e+2" or "-Infinity", as the
 * values of a column are numbers and texts that were not turned into numbers. NaN is a number here. A missing value,
 * and any other text or kind of value, is not a number.
 *
 * @returns The number, or undefined when the value is not one.
 */
function AsNumber(value: unknown): number | undefined {
	if (typeof value === "number") {
		return value;
	}
	if (typeof value !== "string") {
		return undefined;
	}
	const text = value.trim();
	if (text === "NaN") {
		return NaN;
	}
	const number = text === "" ? NaN : Number(text);
	return Number.isNaN(number) ? undefined : number;
}

/**
 * The columns of a table whose values are all numbers, so the table can show them to the right and sort them as
 * numbers. DataTables does not take a value of 1.510000e+2 for a number, and sorts it as text.
 *
 * A column is numeric when it has at least one number and no value that is not one. A missing value (undefined or
 * null) does not count.
 *
 * @param rows - The rows of the table.
 * @param keys - The columns of the table.
 * @returns The keys of the numeric columns.
 */
export function FindNumericColumns(
	rows: readonly object[],
	keys: readonly string[]
): Set<string> {
	const numeric = new Set<string>();
	for (const key of keys) {
		let hasNumber = false;
		let isNumeric = true;
		for (const row of rows) {
			const value = (row as Record<string, unknown>)[key];
			if (value === undefined || value === null) {
				continue;
			}
			if (AsNumber(value) === undefined) {
				isNumeric = false;
				break;
			}
			hasNumber = true;
		}
		if (hasNumber && isNumeric) {
			numeric.add(key);
		}
	}
	return numeric;
}

/**
 * The number that a cell of a numeric column is sorted by. It is always a finite number, as the sorting of
 * DataTables does not order infinity and NaN.
 *
 * @param value - The value of the cell: a number, a text that is written as one, or missing.
 */
export function GetSortValue(value: unknown): number {
	const number = AsNumber(value);
	if (number === undefined || Number.isNaN(number) || number === -Infinity) {
		return SMALLEST;
	}
	return number === Infinity ? LARGEST : number;
}
