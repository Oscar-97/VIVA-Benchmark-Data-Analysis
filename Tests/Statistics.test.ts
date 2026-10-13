import * as math from "mathjs";
import {
	Max,
	Mean,
	Min,
	Quantile,
	RoundToSignificant,
	StandardDeviation,
	Sum,
	SummarizeValues
} from "../Src/Scripts/DataProcessing/Statistics";

/**
 * A seeded random number generator (mulberry32), so a failure can be repeated.
 */
function CreateRandom(seed: number): () => number {
	let state = seed;
	return (): number => {
		state = (state + 0x6d2b79f5) | 0;
		let t = Math.imul(state ^ (state >>> 15), 1 | state);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

type ValueKind = (
	random: () => number,
	sign: number,
	exponent: number
) => number;

/**
 * The kinds of numbers that occur in benchmark results, or that are hard for rounding.
 */
const valueKinds: Record<string, ValueKind> = {
	// like iterations and nodes
	wholeNumber: (random, sign) => sign * Math.floor(random() * 100000),
	// like times
	twoDecimals: (random) => Math.round(random() * 1000000) / 100,
	manyDigits: (random, sign, exponent) => sign * random() * 10 ** exponent,
	// exactly 8 significant digits, ending in 5: a tie when rounding to 7 digits
	tie: (random, sign, exponent) =>
		sign * Number(`${Math.floor(random() * 9000000 + 1000000)}5e${exponent}`),
	// 9s that carry over when rounded
	carry: (_random, sign, exponent) => sign * Number(`9.9999995e${exponent}`),
	// large and small values in one array
	extreme: (random, sign) =>
		sign * (random() < 0.5 ? 1e15 : 1e-12) * (1 + random()),
	// a value that is often the same
	repeated: (random) => [0, 1, 2.5, 10][Math.floor(random() * 4)] ?? 0,
	// like the gaps
	gap: (random) => Math.round(random() * 10000) / 10000
};

/**
 * A random number of one of the kinds above.
 *
 * @param realistic - Leaves out the extremes (1e15 next to 1e-12): the values of benchmarks lie
 * in a range where mathjs, which compares numbers with a tolerance, still sorts them correctly.
 */
function RandomValue(random: () => number, realistic: boolean): number {
	const names = Object.keys(valueKinds).filter(
		(name) => !(realistic && name === "extreme")
	);
	const name = names[Math.floor(random() * names.length)] ?? "";
	const sign = random() < 0.25 ? -1 : 1;
	const exponent = realistic
		? Math.floor(random() * 10) - 3
		: Math.floor(random() * 16) - 8;
	return valueKinds[name]?.(random, sign, exponent) ?? 0;
}
function RandomArrays(
	random: () => number,
	count: number,
	realistic: boolean
): number[][] {
	return Array.from({ length: count }, () => {
		const length = 1 + Math.floor(random() * (random() < 0.2 ? 6 : 200));
		return Array.from({ length }, () => RandomValue(random, realistic));
	});
}

const same = (a: number, b: number): boolean =>
	a === b || (Number.isNaN(a) && Number.isNaN(b));

/**
 * Equal up to the tolerance with which mathjs compares numbers (1e-12), a little wider.
 */
const close = (a: number, b: number): boolean =>
	same(a, b) || Math.abs(a - b) <= 1e-11 * Math.max(Math.abs(a), Math.abs(b));

/**
 * What the application used before: mathjs, with the result written with 7 digits and read again.
 */
const rounded = (value: number): number =>
	Number(math.format(value, { precision: 7 }));

const ascending = (a: number, b: number): number => a - b;

describe("Statistics compared with mathjs", () => {
	const random = CreateRandom(20260101);
	// Arrays with all kinds of values, and arrays with the values that benchmarks have.
	const arrays = RandomArrays(random, 3000, false);
	const realisticArrays = RandomArrays(random, 3000, true);

	/**
	 * Collects the first arrays where the two results differ, to show them in the failure.
	 */
	function Differences(
		input: number[][],
		mine: (values: number[]) => number,
		theirs: (values: number[]) => number,
		equal: (a: number, b: number) => boolean = same
	): string[] {
		const found: string[] = [];
		for (const values of input) {
			const a = mine(values);
			const b = theirs(values);
			if (!equal(a, b) && found.length < 3) {
				found.push(
					`${a} instead of ${b} for [${values.slice(0, 6).join(", ")}…]`
				);
			}
		}
		return found;
	}

	it("should sum like mathjs", () => {
		expect(Differences(arrays, Sum, (v) => math.sum(v))).toEqual([]);
	});

	it("should average like mathjs", () => {
		expect(Differences(arrays, Mean, (v) => math.mean(v))).toEqual([]);
	});

	it("should find the smallest and the largest value like mathjs", () => {
		expect(Differences(arrays, Min, (v) => math.min(v))).toEqual([]);
		expect(Differences(arrays, Max, (v) => math.max(v))).toEqual([]);
	});

	it("should give the standard deviation of a sample like mathjs, also for one value", () => {
		expect(
			Differences(arrays, StandardDeviation, (v) => Number(math.std(v)))
		).toEqual([]);
		expect(StandardDeviation([42])).toBe(0);
	});

	describe.each([0.1, 0.25, 0.5, 0.75, 0.9])("quantile %s", (probability) => {
		it("should interpolate exactly like mathjs, for any values", () => {
			// The sorted option of mathjs does not compare the numbers, which is what is checked here.
			expect(
				Differences(
					arrays,
					(v) => Quantile(v, probability),
					(v) =>
						Number(math.quantileSeq([...v].sort(ascending), probability, true))
				)
			).toEqual([]);
		});

		it("should give the same quantile as mathjs for the values of benchmarks", () => {
			expect(
				Differences(
					realisticArrays,
					(v) => Quantile(v, probability),
					(v) => Number(math.quantileSeq(v, probability)),
					close
				)
			).toEqual([]);
		});
	});

	it("should not need the order of the values, and not change them", () => {
		const values = [5, 1, 4, 2, 3];

		expect(Quantile(values, 0.5)).toBe(3);
		expect(values).toEqual([5, 1, 4, 2, 3]);
	});

	it("should round to 7 significant digits like mathjs does when it writes them", () => {
		const found: string[] = [];
		for (const values of arrays) {
			for (const value of [
				...values,
				Mean(values),
				StandardDeviation(values),
				Sum(values)
			]) {
				if (
					!same(RoundToSignificant(value, 7), rounded(value)) &&
					found.length < 5
				) {
					found.push(
						`${value}: ${RoundToSignificant(value, 7)} instead of ${rounded(value)}`
					);
				}
			}
		}
		expect(found).toEqual([]);
	});

	it("should summarize the values of benchmarks like the statistics tables always did", () => {
		const found: string[] = [];
		for (const values of realisticArrays) {
			const expected = {
				avgValue: rounded(Number(math.mean(values))),
				minValue: rounded(Number(math.min(values))),
				maxValue: rounded(Number(math.max(values))),
				stdValue: rounded(Number(math.std(values))),
				sumValue: rounded(Number(math.sum(values))),
				p10Value: rounded(Number(math.quantileSeq(values, 0.1))),
				p25Value: rounded(Number(math.quantileSeq(values, 0.25))),
				p50Value: rounded(Number(math.quantileSeq(values, 0.5))),
				p75Value: rounded(Number(math.quantileSeq(values, 0.75))),
				p90Value: rounded(Number(math.quantileSeq(values, 0.9)))
			};
			const actual = SummarizeValues(values, { sum: true });
			for (const key of Object.keys(expected) as (keyof typeof expected)[]) {
				if (!same(actual[key] ?? NaN, expected[key]) && found.length < 5) {
					found.push(`${key}: ${actual[key]} instead of ${expected[key]}`);
				}
			}
		}
		expect(found).toEqual([]);
	});
});

describe("RoundToSignificant", () => {
	it("should round half up on the digits that are written", () => {
		expect(RoundToSignificant(1.2345675, 7)).toBe(1.234568);
		expect(RoundToSignificant(1.2345674, 7)).toBe(1.234567);
		expect(RoundToSignificant(1234567.5, 7)).toBe(1234568);
		expect(RoundToSignificant(-1.2345675, 7)).toBe(-1.234568);
	});

	it("should carry over when the digits are all 9", () => {
		expect(RoundToSignificant(9.9999995, 7)).toBe(10);
		expect(RoundToSignificant(999999.95, 7)).toBe(1000000);
	});

	it("should keep numbers that have 7 digits or fewer", () => {
		expect(RoundToSignificant(2.925, 7)).toBe(2.925);
		expect(RoundToSignificant(123, 7)).toBe(123);
		expect(RoundToSignificant(0.000001234, 7)).toBe(0.000001234);
	});

	it("should leave 0, infinity and NaN as they are", () => {
		expect(Object.is(RoundToSignificant(-0, 7), 0)).toBe(true);
		expect(RoundToSignificant(Infinity, 7)).toBe(Infinity);
		expect(RoundToSignificant(-Infinity, 7)).toBe(-Infinity);
		expect(RoundToSignificant(NaN, 7)).toBeNaN();
	});
});

describe("SummarizeValues", () => {
	it("should leave the sum out unless it is asked for, and keep the order of the columns", () => {
		const values = [1, 2, 3, 4, 5];

		expect(Object.keys(SummarizeValues(values))).toEqual([
			"avgValue",
			"minValue",
			"maxValue",
			"stdValue",
			"p10Value",
			"p25Value",
			"p50Value",
			"p75Value",
			"p90Value"
		]);
		expect(Object.keys(SummarizeValues(values, { sum: true }))).toEqual([
			"avgValue",
			"minValue",
			"maxValue",
			"stdValue",
			"sumValue",
			"p10Value",
			"p25Value",
			"p50Value",
			"p75Value",
			"p90Value"
		]);
	});

	it("should calculate a known example", () => {
		expect(SummarizeValues([1, 2, 3], { sum: true })).toEqual({
			avgValue: 2,
			minValue: 1,
			maxValue: 3,
			stdValue: 1,
			sumValue: 6,
			p10Value: 1.2,
			p25Value: 1.5,
			p50Value: 2,
			p75Value: 2.5,
			p90Value: 2.8
		});
	});
});
