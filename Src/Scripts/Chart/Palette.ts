/**
 * The colors of the data sets that do not bring their own, in the order in which they are given out.
 * The order is fixed, so a solver gets the same color every time, and it is the order that keeps the
 * neighbours apart for readers with a color vision deficiency: do not sort it. The two columns are the same
 * hues, stepped for the light and for the dark surface. Both were checked with the validator of the dataviz
 * skill: the worst CVD difference between neighbours is 9.1 (light) and 8.4 (dark) in OKLab x100, the worst
 * difference for normal vision 19.3, and in the dark theme every color has a contrast of 3:1 or more.
 * Three colors of the light theme (aqua, yellow, magenta) are below 3:1 on white, which is why the legend,
 * and the statistics table below the chart, name every data set as well.
 */
const PALETTE: Record<"light" | "dark", readonly string[]> = {
	light: [
		"#2a78d6",
		"#eb6834",
		"#1baf7a",
		"#eda100",
		"#e87ba4",
		"#008300",
		"#4a3aa7",
		"#e34948"
	],
	dark: [
		"#3987e5",
		"#d95926",
		"#199e70",
		"#c98500",
		"#d55181",
		"#008300",
		"#9085e9",
		"#e66767"
	]
};

/**
 * The dashes of the lines after the colors have been used once. A ninth solver has the color of the first, so
 * it is told apart by the line: solid, long dashes, short dashes.
 */
const DASHES: readonly (readonly number[])[] = [[], [8, 4], [2, 3]];

/**
 * How transparent the area of a mark is, as the two hex digits of an alpha channel.
 */
const FILL_ALPHA = "80";

/**
 * The color of the data set with the given index.
 */
export function PaletteColor(index: number, theme: string): string {
	const colors = PALETTE[theme === "dark" ? "dark" : "light"];
	return colors[index % colors.length] ?? "#2a78d6";
}

/**
 * The part of a data set that the palette reads and sets.
 */
interface Colorable {
	borderColor?: unknown;
	backgroundColor?: unknown;
	borderDash?: unknown;
}

/**
 * Gives a data set a color from the palette, by its place in the chart. A data set that has a color of its own,
 * like the statuses of the termination chart, is left as it is.
 *
 * @param dataset - The data set.
 * @param index - The place of the data set in the chart.
 * @param type - The kind of chart. Bars are filled, the other kinds have a line with a lighter area.
 * @param theme - The theme that the chart is drawn in.
 */
export function ApplyPalette<T extends object>(
	dataset: T,
	index: number,
	type: string,
	theme: string
): T {
	const current: Colorable = dataset;
	if (
		current.borderColor !== undefined ||
		current.backgroundColor !== undefined
	) {
		return dataset;
	}
	const color = PaletteColor(index, theme);
	const colored: Colorable = {
		...dataset,
		borderColor: color,
		backgroundColor: type === "bar" ? color : color + FILL_ALPHA
	};
	const round = Math.floor(index / PALETTE.light.length);
	if (round > 0 && (type === "line" || type === "radar")) {
		colored.borderDash = [...(DASHES[round % DASHES.length] ?? [])];
	}
	return colored as T;
}
