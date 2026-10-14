import { Keys } from "../Constants/Keys";
import { PageTitles } from "../Constants/PageTitles";
import { elements } from "../Elements/Elements";

export async function ActivateDemoMode(): Promise<void> {
	const module = await import(
		/* webpackChunkName: "demodata" */ "../Datasets/DemoData"
	);
	if (elements.demoDataSelector.value === "Demo_1") {
		localStorage.setItem(
			Keys.USER_CONFIGURATION,
			JSON.stringify(module.DEMO_DATA)
		);
		localStorage.setItem(Keys.DEMO_DATA, "demo1");
	} else if (elements.demoDataSelector.value === "Demo_2") {
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
