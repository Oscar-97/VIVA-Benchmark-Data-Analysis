import { Keys } from "./Constants/Keys";

export type ThemePreference = "light" | "dark" | "system";
export type Theme = "light" | "dark";

/**
 * Name of the event that is dispatched on `window` after the theme has changed.
 */
export const THEME_CHANGE_EVENT = "themechange";

const DARK_QUERY = "(prefers-color-scheme: dark)";
const THEME_COLORS: Record<Theme, string> = {
	light: "#ffffff",
	dark: "#212529"
};

/**
 * Turns a stored value into a preference. Anything unknown means "system".
 * @param value - The value from the local storage.
 */
export function ParseThemePreference(value: string | null): ThemePreference {
	return value === "light" || value === "dark" ? value : "system";
}

/**
 * Decides which theme to show.
 * @param preference - The preference of the user.
 * @param systemDark - If the operating system asks for a dark theme.
 */
export function ResolveTheme(
	preference: ThemePreference,
	systemDark: boolean
): Theme {
	if (preference === "system") {
		return systemDark ? "dark" : "light";
	}
	return preference;
}

/**
 * Reads the preference from the local storage.
 * The storage can be blocked, which means "system".
 */
export function GetThemePreference(): ThemePreference {
	try {
		return ParseThemePreference(localStorage.getItem(Keys.THEME));
	} catch {
		return "system";
	}
}

function IsSystemDark(): boolean {
	return window.matchMedia(DARK_QUERY).matches;
}

/**
 * The theme that is shown now.
 */
export function GetCurrentTheme(): Theme {
	return document.documentElement.dataset["bsTheme"] === "dark"
		? "dark"
		: "light";
}

/**
 * Sets the theme on the page, updates the toggle button and tells the listeners.
 * @param theme - The theme to show.
 */
export function ApplyTheme(theme: Theme): void {
	const changed = GetCurrentTheme() !== theme;
	document.documentElement.dataset["bsTheme"] = theme;
	document
		.querySelector('meta[name="theme-color"]')
		?.setAttribute("content", THEME_COLORS[theme]);
	UpdateToggleButton(theme);
	if (changed) {
		window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
	}
}

function UpdateToggleButton(theme: Theme): void {
	const button = document.getElementById("themeToggleButton");
	if (!button) {
		return;
	}
	const toDark = theme === "light";
	button.setAttribute(
		"aria-label",
		toDark ? "Switch to dark theme" : "Switch to light theme"
	);
	button.setAttribute("aria-pressed", String(theme === "dark"));
	const icon = button.querySelector("i");
	icon?.classList.toggle("bi-moon-stars", toDark);
	icon?.classList.toggle("bi-sun", !toDark);
}

/**
 * Switches between the light and the dark theme and remembers the choice.
 */
export function ToggleTheme(): void {
	const next: Theme = GetCurrentTheme() === "dark" ? "light" : "dark";
	try {
		localStorage.setItem(Keys.THEME, next);
	} catch {
		// The choice is only kept until the page is closed.
	}
	ApplyTheme(next);
}

/**
 * Shows the stored theme (the inline script in the head has normally done that already),
 * follows the operating system while nothing is stored and registers the toggle button.
 */
export function InitializeTheme(): void {
	ApplyTheme(ResolveTheme(GetThemePreference(), IsSystemDark()));

	window.matchMedia(DARK_QUERY).addEventListener("change", () => {
		if (GetThemePreference() === "system") {
			ApplyTheme(ResolveTheme("system", IsSystemDark()));
		}
	});

	document
		.getElementById("themeToggleButton")
		?.addEventListener("click", ToggleTheme);
}
