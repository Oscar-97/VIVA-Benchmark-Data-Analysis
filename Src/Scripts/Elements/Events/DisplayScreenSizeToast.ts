import { Keys } from "../../Constants/Keys";

/**
 * Checks the screen size and displays a toast if the screen size is too small.
 */
function CheckScreenSize(): void {
	if (
		window.innerWidth < 992 &&
		!sessionStorage.getItem(Keys.ALERTED_SCREEN_SIZE)
	) {
		document.getElementById("desktopToast").classList.remove("hide");
		document.getElementById("desktopToast").classList.add("show");
		sessionStorage.setItem(Keys.ALERTED_SCREEN_SIZE, "true");
	}
}

/**
 * Initializes the screen size toast and event listener, checking the screen size on resize.
 */
export function InitializeScreenSizeToast(): void {
	CheckScreenSize();
	window.addEventListener("resize", CheckScreenSize);
}
