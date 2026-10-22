import { elements } from "./Elements";

/**
 * Shows the version of the application in the release tag element, after the git icon.
 * The version is the one in package.json, which webpack writes into the bundle when it is built.
 * It needs no request, so it also works offline and always matches the files that are served.
 */
export function ReleaseVersionTag(): void {
	const icon = document.createElement("i");
	icon.className = "bi bi-git";
	elements.releaseVersionTag.replaceChildren(icon, ` v${__APP_VERSION__}`);
}
