import { elements } from "./Elements";

const NO_DATA_HINT = "Load data first.";

/**
 * Shows the explanation of how to load data while there is no data, and hides it when there is.
 * The data actions are only offered when there is data. Until then, the buttons of the page are
 * disabled and the container of the buttons explains why.
 *
 * @param visible - Whether there is nothing loaded yet.
 */
export function SetEmptyStateVisible(visible: boolean): void {
	elements.emptyState.hidden = !visible;
	elements.dataMenu.hidden = visible;
	elements.buttonContainer.classList.toggle("no-data", visible);
	if (visible) {
		elements.buttonContainer.title = NO_DATA_HINT;
	} else {
		elements.buttonContainer.removeAttribute("title");
	}
}
