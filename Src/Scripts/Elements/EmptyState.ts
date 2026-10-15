import { elements } from "./Elements";

/**
 * Shows the explanation of how to load data while there is no data, and hides it when there is.
 *
 * @param visible - Whether there is nothing loaded yet.
 */
export function SetEmptyStateVisible(visible: boolean): void {
	elements.emptyState.hidden = !visible;
}
