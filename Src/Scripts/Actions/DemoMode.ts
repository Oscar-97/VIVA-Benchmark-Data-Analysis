import { Keys } from "../Constants/Keys";
import { ClearSessionData } from "../UserConfiguration/SessionData";
import { elements } from "../Elements/Elements";
import { ConfirmReplaceData } from "../Elements/Modals/ReplaceDataModal";

/**
 * Whether the browser holds data that the user saved, and not the demo data.
 */
function HasSavedUserData(): boolean {
	try {
		return (
			localStorage.getItem(Keys.USER_CONFIGURATION) !== null &&
			localStorage.getItem(Keys.DEMO_DATA) === null
		);
	} catch {
		return false;
	}
}

/**
 * Starts the demo mode. When the user has saved data, which the demo data replaces, the user is asked first.
 *
 * @param demo - The demo data set, "Demo_1" or "Demo_2".
 */
export function RequestDemoMode(demo: string): void {
	if (HasSavedUserData()) {
		ConfirmReplaceData(() => {
			void ActivateDemoMode(demo);
		});
	} else {
		void ActivateDemoMode(demo);
	}
}

/**
 * Stores the demo data as the configuration and loads the page again, so the data is restored from it.
 *
 * @param name - The demo data set, "Demo_1" or "Demo_2".
 */
export async function ActivateDemoMode(name: string): Promise<void> {
	const module = await import(
		/* webpackChunkName: "demodata" */ "../Datasets/DemoData"
	);
	if (name === "Demo_1") {
		localStorage.setItem(
			Keys.USER_CONFIGURATION,
			JSON.stringify(module.DEMO_DATA)
		);
		localStorage.setItem(Keys.DEMO_DATA, "demo1");
	} else if (name === "Demo_2") {
		localStorage.setItem(
			Keys.USER_CONFIGURATION,
			JSON.stringify(module.DEMO_DATA_2)
		);
		localStorage.setItem(Keys.DEMO_DATA, "demo2");
	}
	ClearSessionData();
	location.reload();
}

/**
 * Shows in the Help menu which demo data is used, which cannot be started again.
 *
 * @param demo - The demo data that is stored, "demo1" or "demo2".
 */
export function NotifyDemoMode(demo: string): void {
	const item =
		demo === "demo1" ? elements.demoMipMenuItem : elements.demoMinlpMenuItem;
	item.classList.add("text-success");
	item.disabled = true;
}
