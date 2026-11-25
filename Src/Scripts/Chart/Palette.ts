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
 * The dashes of the lines: solid, long dashes, short dashes. Colors are not the only way to tell the data sets
 * apart, so every data set has a dash and a point style by its place, and not only the ones after the ninth.
 * The numbers of dashes (3), point styles (5) and colors (8) have no common factor, so the combination
 * repeats only after 120 data sets.
 */
const DASHES: readonly (readonly number[])[] = [[], [8, 4], [2, 3]];

/**
 * The shapes of the points of the data sets, in the order in which they are given out.
 */
const POINT_STYLES: readonly string[] = [
	"circle",
	"triangle",
	"rect",
	"rectRot",
	"star"
];

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
	pointStyle?: unknown;
}

/**
 * Gives a data set the shape of its points and the dash of its line by its place in the chart, so it can be told
 * apart without its color. Bars have neither.
 */
function ApplyShape(dataset: Colorable, index: number, type: string): void {
	const hasPoints = type === "line" || type === "radar" || type === "bubble";
	const hasLine = type === "line" || type === "radar";
	if (hasPoints) {
		dataset.pointStyle = POINT_STYLES[index % POINT_STYLES.length] ?? "circle";
	}
	const dash = DASHES[index % DASHES.length] ?? [];
	if (hasLine && dash.length > 0) {
		dataset.borderDash = [...dash];
	}
}

/**
 * Gives a data set a color from the palette, by its place in the chart. A data set that has a color of its own,
 * like the statuses of the termination chart, is left as it is.
 *
 * @param dataset - The data set.
 * @param index - The place of the data set in the chart.
 * @param type - The kind of chart. Bars are filled, the other kinds have a line with a lighter area, and the points
 * and the lines of the data sets differ in their shape and dash as well as in their color.
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
	ApplyShape(colored, index, type);
	return colored as T;
}
