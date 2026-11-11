import { FindElement } from "./Elements";

/**
 * The menus of the navigation bar open when the pointer is over them, or when they get the focus, and do not close
 * the Data menu, which is opened with a click. Both would then be open on top of each other.
 * Opening a menu of the navigation bar closes the Data menu.
 *
 * The Data menu is closed with a click on its button, which is the same as the visitor closing it. The Dropdown of
 * Bootstrap is not imported here, as the bundle of Bootstrap has one already, and a second copy would handle every
 * click on a menu a second time.
 */
export function CloseDataMenuOnNavigation(): void {
	const close = (): void => {
		const button = FindElement("dataMenuButton");
		if (button?.getAttribute("aria-expanded") === "true") {
			button.click();
		}
	};
	for (const menu of document.querySelectorAll("#navbarNav .dropdown")) {
		menu.addEventListener("mouseenter", close);
		menu.addEventListener("focusin", close);
	}
}
