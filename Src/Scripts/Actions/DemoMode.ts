import { Keys } from "../Constants/Keys";
import { PageTitles } from "../Constants/PageTitles";
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
 * @param demo - The demo data set, "Demo_1" or "Demo_2". By default the one that is selected in the navigation bar.
 */
export function RequestDemoMode(demo?: string): void {
	const name = demo ?? elements.demoDataSelector.value;
	if (HasSavedUserData()) {
		ConfirmReplaceData(() => {
			void ActivateDemoMode(name);
		});
	} else {
		void ActivateDemoMode(name);
	}
}

/**
 * Stores the demo data as the configuration and loads the page again, so the data is restored from it.
 *
 * @param demo - The demo data set, "Demo_1" or "Demo_2". By default the one that is selected in the navigation bar.
 */
export async function ActivateDemoMode(demo?: string): Promise<void> {
	const name = demo ?? elements.demoDataSelector.value;
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
	location.reload();
}

export function NotifyDemoMode(): void {
	if (document.title === PageTitles.TABLE) {
		elements.demoDataButton.classList.add("text-success");
		elements.demoDataButton.disabled = true;
		elements.demoDataSelector.disabled = true;
	}
}
