import { releaseVersionTag } from "./Elements";

/**
 * Fetches the release version from Github and sets it in the release tag element.
 * Initially, it first checks if it has already been fetched by checkign the session storage.
 * If it has already been fetched, it retrieves the value from local storage.
 */
export function ReleaseVersionTag(): void {
	if (!sessionStorage.getItem("releaseVersionFetched")) {
		async function FetchLatestRelease(): Promise<string> {
			const response = await fetch(
				"https://api.github.com/repos/Oscar-97/VIVA-Benchmark-Data-Analysis/releases/latest"
			);
			const data = await response.json();
			return data.tag_name;
		}

		FetchLatestRelease().then((version) => {
			if (version === null || version === undefined) {
				version = "Releases";
			}
			releaseVersionTag.innerHTML = `<i class="bi bi-git"></i> ${version}`;
			localStorage.setItem("releaseVersion", version);
			sessionStorage.setItem("releaseVersionFetched", "true");
		});
	} else {
		let releaseVersion = localStorage.getItem("releaseVersion");

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
