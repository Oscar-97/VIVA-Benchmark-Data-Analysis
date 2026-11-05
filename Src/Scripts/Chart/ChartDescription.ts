/**
 * How a chart is called, by its kind.
 */
const KIND_NAMES: Record<string, string> = {
	line: "Line chart",
	bar: "Bar chart",
	bubble: "Bubble chart",
	radar: "Radar chart"
};

/**
 * The most data sets that the description names.
 */
const MAX_LABELS = 12;

/**
 * A property of a value that is an object, and undefined for anything else.
 */
function Property(value: unknown, key: string): unknown {
	return typeof value === "object" && value !== null
		? (value as Record<string, unknown>)[key]
		: undefined;
}

/**
 * The title of an axis, if the scale has one. The scales of the chart are of several kinds, and the radial
 * scale of a radar chart has no title, so nothing is assumed about them.
 */
function AxisTitle(scales: unknown, axis: string): string | null {
	const text = Property(Property(Property(scales, axis), "title"), "text");
	const joined = Array.isArray(text) ? text.join(" ") : text;
	return typeof joined === "string" && joined !== "" ? joined : null;
}

/**
 * A text for a screen reader: a chart on a canvas has no content of its own. It tells the kind of chart,
 * its title, what the axes show and which data sets it has.
 *
 * @param type - The kind of chart.
 * @param title - The title of the chart.
 * @param labels - The names of the data sets.
 * @param scales - The scales of the chart.
 */
export function DescribeChart(
	type: string,
	title: string,
	labels: readonly string[],
	scales?: unknown
): string {
	const parts = [`${KIND_NAMES[type] ?? "Chart"}: ${title}.`];
	const x = AxisTitle(scales, "x");
	const y = AxisTitle(scales, "y");
	if (x) {
		parts.push(`X axis: ${x}.`);
	}
	if (y) {
		parts.push(`Y axis: ${y}.`);
	}
	if (labels.length > 0) {
		const listed = labels.slice(0, MAX_LABELS).join(", ");
		const more =
			labels.length > MAX_LABELS
				? `, and ${labels.length - MAX_LABELS} more`
				: "";
		parts.push(`Data sets: ${listed}${more}.`);
	}
	parts.push("The values are in the table that Show as table opens.");
	return parts.join(" ");
}
