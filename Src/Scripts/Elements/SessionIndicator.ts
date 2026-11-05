import { ClearSessionData } from "../UserConfiguration/SessionData";
import { elements } from "./Elements";

/**
 * Shows in the navigation bar that the data of this session is kept for the other pages.
 *
 * @param label - A short description of the data.
 */
export function ShowSessionIndicator(label: string): void {
	elements.sessionIndicatorLabel.textContent = label
		? `Session data: ${label}`
		: "Session data";
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
