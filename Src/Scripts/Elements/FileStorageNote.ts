import { elements } from "./Elements";

/**
 * Whether the browser keeps the storage of every page that is opened from a file apart. Firefox gives each
 * file its own origin (privacy.file_unique_origin), so the data that is loaded or saved on one page is not
 * available on the others. Chromium gives all files one origin, so the pages share their data.
 * The browser cannot be asked directly, and its origin does not tell: Chromium reports "null" for a file as well.
 *
 * @param protocol - The protocol of the page, "file:" when it is opened from a file.
 * @param userAgent - The user agent of the browser.
 */
export function IsStorageSeparatedPerFile(
	protocol: string,
	userAgent: string
): boolean {
	return protocol === "file:" && /Firefox\//.test(userAgent);
}

/**
 * Shows the note in the explanation of how to load data that tells that the data of a page that is opened from
 * a file is not available on the other pages, and what to do about it. The note stays hidden otherwise.
 */
export function ShowFileStorageNote(): void {
	elements.fileStorageNote.hidden = !IsStorageSeparatedPerFile(
		window.location.protocol,
		navigator.userAgent
	);
}
