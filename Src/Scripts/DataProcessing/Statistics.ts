import { StatisticsColumns } from "../Interfaces/Interfaces";

/**
 * The statistics of a list of numbers. These functions give the same results as the ones of mathjs
 * that the application used before (checked against mathjs in Tests/Statistics.test.ts), without its size.
 * They need at least one value; the callers check that.
 */

/**
 * The sum of the values.
 */
export function Sum(values: readonly number[]): number {
	let sum = 0;
	for (const value of values) {
		sum += value;
	}
	return sum;
}

/**
 * The average of the values.
 */
export function Mean(values: readonly number[]): number {
	return Sum(values) / values.length;
}

/**
 * The smallest value.
 */
export function Min(values: readonly number[]): number {
	let smallest = Infinity;
	for (const value of values) {
		if (value < smallest) {
			smallest = value;
		}
	}
	return smallest;
}

/**
 * The largest value.
 */
export function Max(values: readonly number[]): number {
	let largest = -Infinity;
	for (const value of values) {
		if (value > largest) {
			largest = value;
		}
	}
	return largest;
}

/**
 * The standard deviation of a sample (divided by n - 1, as it is done for a part of all possible values).
 * It is 0 for a single value.
 */
export function StandardDeviation(values: readonly number[]): number {
	if (values.length === 1) {
		return 0;
	}
	const mean = Mean(values);
	let sumOfSquares = 0;
	for (const value of values) {
		const difference = value - mean;
		sumOfSquares += difference * difference;
	}
	return Math.sqrt(sumOfSquares / (values.length - 1));
}

/**
 * The value below which a part of the values lies, with linear interpolation between the two
 * values around the position.
 *
 * @param values - The values, in any order.
 * @param probability - The part, between 0 and 1: 0.5 is the median.
 */
export function Quantile(
	values: readonly number[],
	probability: number
): number {
	const sorted = [...values].sort((a, b) => a - b);
	const index = probability * (sorted.length - 1);
	const fraction = index % 1;
	if (fraction === 0) {
		return sorted[index] ?? NaN;
	}
	const left = sorted[Math.floor(index)] ?? NaN;
	const right = sorted[Math.floor(index) + 1] ?? NaN;
	return left * (1 - fraction) + right * fraction;
}

/**
 * Rounds a number to a number of significant digits, half up, on the digits of its shortest
 * decimal notation: 1.2345675 gives 1.234568 for 7 digits. (toPrecision rounds the binary value
 * that is behind it, which can give 1.234567.) This is how the tables have always shown the statistics.
 */
export function RoundToSignificant(value: number, digits: number): number {
	if (!Number.isFinite(value)) {
		return value;
	}
	if (value === 0) {
		return 0;
	}
	// The digits of the shortest notation, without the dot: 1.2345675 is "12345675" with exponent 0.
	const [mantissa = "", exponentText = "0"] = Math.abs(value)
		.toExponential()
		.split("e");
	const written = mantissa.replace(".", "");
	if (written.length <= digits) {
		return value;
	}

	let kept = Number(written.slice(0, digits));
	let exponent = Number(exponentText);
	if (Number(written.charAt(digits)) >= 5) {
		kept++;
		if (kept === 10 ** digits) {
			// 9.9999995 became 10.00000
			kept /= 10;
			exponent++;
		}
	}
	const rounded = Number(`${kept}e${exponent - digits + 1}`);
	return value < 0 ? -rounded : rounded;
}
/**
 * The number of significant digits in the statistics that the tables show.
 */
const STATISTICS_DIGITS = 7;

/**
 * Calculates the statistics of the values, rounded to 7 significant digits as the tables show them.
 *
 * @param values - At least one value.
 * @param options - `sum: true` adds the sum, after the standard deviation.
 */
export function SummarizeValues(
	values: readonly number[],
	options: { sum?: boolean } = {}
): StatisticsColumns {
	const round = (value: number): number =>
		RoundToSignificant(value, STATISTICS_DIGITS);

	return {
		avgValue: round(Mean(values)),
		minValue: round(Min(values)),
		maxValue: round(Max(values)),
		stdValue: round(StandardDeviation(values)),
		...(options.sum ? { sumValue: round(Sum(values)) } : {}),
		p10Value: round(Quantile(values, 0.1)),
		p25Value: round(Quantile(values, 0.25)),
		p50Value: round(Quantile(values, 0.5)),
		p75Value: round(Quantile(values, 0.75)),
		p90Value: round(Quantile(values, 0.9))
	};
}
