import { Keys } from "../Constants/Keys";
import { elements } from "./Elements";

const FALLBACK_TEXT = "Releases";

/**
 * Shows the version in the release tag element, after the git icon.
 * The version is set as text, as it comes from outside of the application.
 */
function ShowVersion(version: string): void {
	const icon = document.createElement("i");
	icon.className = "bi bi-git";
	elements.releaseVersionTag.replaceChildren(icon, ` ${version}`);
}

/**
 * Fetches the tag name of the latest release from Github.
 * Throws when the request fails or the response has no tag name.
 */
async function FetchLatestRelease(): Promise<string> {
	const response = await fetch(
		"https://api.github.com/repos/Oscar-97/VIVA-Benchmark-Data-Analysis/releases/latest"
	);
	if (!response.ok) {
		throw new Error(`Github answered with status ${response.status}.`);
	}
	const data: { tag_name?: unknown } = await response.json();
	if (typeof data.tag_name !== "string") {
		throw new Error("The latest release has no tag name.");
	}
	return data.tag_name;
}

/**
 * This function fetches the release version number from Github and sets it in the release tag element.
 * Initially, it first checks if it has already been fetched by checking the session storage.
 * If it has already been fetched, it retrieves the value from local storage.
 * When the version cannot be fetched, for example offline, the last known version is shown,
 * and the next page load tries again.
 */
export function ReleaseVersionTag(): void {
	const storedVersion = localStorage.getItem(Keys.RELEASE_VERSION);

	if (sessionStorage.getItem(Keys.RELEASE_VERSION_FETCHED)) {
		ShowVersion(storedVersion ?? FALLBACK_TEXT);
		return;
	}

	FetchLatestRelease()
		.then((version) => {
			ShowVersion(version);
			localStorage.setItem(Keys.RELEASE_VERSION, version);
			sessionStorage.setItem(Keys.RELEASE_VERSION_FETCHED, "true");
		})
		.catch((error: unknown) => {
			console.warn("The latest release could not be fetched: ", error);
			ShowVersion(storedVersion ?? FALLBACK_TEXT);
		});
}
