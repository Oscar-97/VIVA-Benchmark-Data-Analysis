import { elements } from "./Elements";

/**
 * The most file names that are listed in the status, the others are counted.
 */
const MAX_LISTED_FILES = 4;

const UNITS = ["B", "kB", "MB", "GB"];

/**
 * The size of a file as text, for example "1.5 MB".
 */
export function FormatFileSize(bytes: number): string {
	let size = bytes;
	let unit = 0;
	while (size >= 1000 && unit < UNITS.length - 1) {
		size /= 1000;
		unit++;
	}
	const digits = unit === 0 || size >= 10 ? 0 : 1;
	return `${size.toFixed(digits)} ${UNITS[unit]}`;
}

/**
 * Describes the selected files: how many, how large and the first names.
 */
export function DescribeFiles(files: readonly File[]): string {
	const names = files.slice(0, MAX_LISTED_FILES).map((file) => file.name);
	const others = files.length - names.length;
	if (others > 0) {
		names.push(`and ${others} more`);
	}
	const total = files.reduce((sum, file) => sum + file.size, 0);
	const noun = files.length === 1 ? "file" : "files";
	return `${files.length} ${noun} (${FormatFileSize(total)}): ${names.join(", ")}`;
}

/**
 * Shows a line of text below the buttons, and a spinner while the application is busy.
 * The text is set as text, as it contains file names.
 */
export function ShowLoadStatus(message: string, busy: boolean): void {
	const status = elements.loadStatus;
	status.setAttribute("aria-busy", String(busy));
	const content: (Node | string)[] = [];
	if (busy) {
		const spinner = document.createElement("span");
		spinner.className = "spinner-border spinner-border-sm me-2";
		spinner.setAttribute("aria-hidden", "true");
		content.push(spinner);
	}
	content.push(message);
	status.replaceChildren(...content);
}

/**
 * Removes the line of text.
 */
export function ClearLoadStatus(): void {
	elements.loadStatus.setAttribute("aria-busy", "false");
	elements.loadStatus.replaceChildren();
}
