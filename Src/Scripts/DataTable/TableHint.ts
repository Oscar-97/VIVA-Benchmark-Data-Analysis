import { FindElement } from "../Elements/Elements";

/**
 * What the user may not find out alone: that columns are hidden, where to show them, and how rows are selected.
 *
 * @param visible - How many columns are shown.
 * @param total - How many columns the table has.
 */
export function DescribeTableHint(visible: number, total: number): string {
	const columns =
		visible < total
			? `${visible} of ${total} columns are shown. Show the others with Settings, then Column Visibility.`
			: `All ${total} columns are shown.`;
	return `${columns} Click a row to select it, hold Ctrl or Shift to select several, then use Show Selected Rows.`;
}

/**
 * Shows the hint above the table, for the number of columns that are shown now.
 * The page has no hint element before a table is displayed, and then nothing happens.
 */
export function ShowTableHint(visible: number, total: number): void {
	const hint = FindElement<HTMLElement>("tableHint");
	if (!hint) {
		return;
	}
	hint.textContent = DescribeTableHint(visible, total);
	hint.hidden = false;
}

/**
 * Hides the hint, as there is no table.
 */
export function HideTableHint(): void {
	const hint = FindElement<HTMLElement>("tableHint");
	if (hint) {
		hint.textContent = "";
		hint.hidden = true;
	}
}
