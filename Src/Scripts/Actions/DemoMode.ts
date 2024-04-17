import { Keys } from "../Constants/Keys";
import { PageTitles } from "../Constants/PageTitles";
import { demoDataSelector, demoDataButton } from "../Elements/Elements";

export async function ActivateDemoMode(): Promise<void> {
	const module = await import(
		/* webpackChunkName: "demodata" */ "../Datasets/DemoData"
	);
	if (demoDataSelector.value === "Demo_1") {
		localStorage.setItem(
			Keys.USER_CONFIGURATION,
			JSON.stringify(module.DEMO_DATA)
		);
		localStorage.setItem(Keys.DEMO_DATA, "demo1");
	} else if (demoDataSelector.value === "Demo_2") {
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
		demoDataButton.style.color = "#198754";
		demoDataButton.disabled = true;
		demoDataSelector.disabled = true;
	}
}
