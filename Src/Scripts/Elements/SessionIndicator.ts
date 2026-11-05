import { ClearSessionData } from "../UserConfiguration/SessionData";
import { elements } from "./Elements";

/**
 * Shows in the navigation bar that the data of this session is kept for the other pages. The navigation bar
 * has little room, so the description of the data is the tooltip of the text.
 *
 * @param label - A short description of the data.
 */
export function ShowSessionIndicator(label: string): void {
	const text = elements.sessionIndicatorLabel;
	text.textContent = "Session data";
	if (label) {
		text.title = label;
	} else {
		text.removeAttribute("title");
	}
	elements.sessionIndicator.hidden = false;
}

/**
 * Hides the indicator of the data of this session.
 */
export function HideSessionIndicator(): void {
	elements.sessionIndicator.hidden = true;
}

/**
 * Forgets the data of this session, and hides the indicator.
 */
export function ForgetSessionData(): void {
	ClearSessionData();
	HideSessionIndicator();
}
