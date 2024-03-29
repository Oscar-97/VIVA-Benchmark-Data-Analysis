import { Keys } from "../Constants/Keys";
import { releaseVersionTag } from "./Elements";

/**
 * This function fetches the release version number from Github and sets it in the release tag element.
 * Initially, it first checks if it has already been fetched by checkign the session storage.
 * If it has already been fetched, it retrieves the value from local storage.
 */
export function ReleaseVersionTag(): void {
	async function FetchLatestRelease(): Promise<string> {
		const response = await fetch(
			"https://api.github.com/repos/Oscar-97/VIVA-Benchmark-Data-Analysis/releases/latest"
		);
		const data = await response.json();
		return data.tag_name;
	}

	if (!sessionStorage.getItem(Keys.RELEASE_VERSION_FETCHED)) {
		FetchLatestRelease().then((version) => {
			if (version === null || version === undefined) {
				version = "Releases";
			}
			releaseVersionTag.innerHTML = `<i class="bi bi-git"></i> ${version}`;
			localStorage.setItem(Keys.RELEASE_VERSION, version);
			sessionStorage.setItem(Keys.RELEASE_VERSION_FETCHED, "true");
		});
	} else {
		let releaseVersion = localStorage.getItem(Keys.RELEASE_VERSION);

		if (
			releaseVersion === null ||
			releaseVersion === undefined ||
			releaseVersionTag.innerHTML === `<i class="bi bi-git"></i> null`
		) {
			releaseVersion = "Releases";
		}
		releaseVersionTag.innerHTML = `<i class="bi bi-git"></i> ${releaseVersion}`;
	}
}
