import { Keys } from "../Constants/Keys";
import { StoredConfiguration } from "../Interfaces/Interfaces";
import { ToStoredConfiguration } from "./StoredConfiguration";

/**
 * The data of the session: the data that was loaded in this tab, and a short description of it.
 * It is kept in the session storage, so every page of the application in the tab shows the same data.
 */
export interface SessionData extends StoredConfiguration {
	label: string;
}

/**
 * Keeps the loaded data for the other pages of the application.
 *
 * @param dataSet - The data as the lines of a trace file.
 * @param label - A short description of the data.
 * @param defaultTime - The time limit of the data, if it has one.
 * @param gapLimit - The gap limit of the data, if it has one.
 * @returns Whether the data was kept. The storage can be full or not available.
 */
export function StoreSessionData(
	dataSet: string[],
	label: string,
	defaultTime?: number,
	gapLimit?: number
): boolean {
	try {
		sessionStorage.setItem(
			Keys.SESSION_DATA,
			JSON.stringify({
				dataSet,
				dataFileType: "json",
				defaultTime,
				gapLimit,
				label
			})
		);
		return true;
	} catch (error) {
		console.warn("Could not keep the data for the other pages: ", error);
		return false;
	}
}

/**
 * Gets the data that was kept for this session.
 *
 * @returns The data, or undefined if there is none or it is not valid.
 */
export function GetSessionData(): SessionData | undefined {
	try {
		const stored = sessionStorage.getItem(Keys.SESSION_DATA);
		if (!stored) {
			return undefined;
		}
		const parsed = JSON.parse(stored);
		const config = ToStoredConfiguration(parsed);
		if (!config) {
			return undefined;
		}
		return {
			...config,
			label: typeof parsed.label === "string" ? parsed.label : ""
		};
	} catch {
		return undefined;
	}
}

/**
 * Removes the data that was kept for this session.
 */
export function ClearSessionData(): void {
	try {
		sessionStorage.removeItem(Keys.SESSION_DATA);
	} catch {
		// Without a session storage there is nothing that was kept.
	}
}
