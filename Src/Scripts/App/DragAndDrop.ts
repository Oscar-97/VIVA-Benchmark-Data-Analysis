import { elements } from "../Elements/Elements";

/**
 * The class of the body while files are dragged over the page.
 */
const DROP_ACTIVE_CLASS = "drop-active";

/**
 * Whether the drag carries files, and not text or a link.
 */
function HasFiles(event: DragEvent): boolean {
	return Array.from(event.dataTransfer?.types ?? []).includes("Files");
}

/**
 * Lets the user drop files anywhere on the page. The files are put in the file input, exactly as if they
 * were chosen with it, so the checks and the reading of the files are the same.
 * Registered once, as the listeners belong to the document.
 */
export function RegisterDragAndDrop(): void {
	// A drag enters and leaves the elements of the page, so the entries are counted to know when it leaves the page.
	let depth = 0;

	document.addEventListener("dragenter", (event) => {
		if (!HasFiles(event)) return;
		event.preventDefault();
		depth++;
		document.body.classList.add(DROP_ACTIVE_CLASS);
	});

	document.addEventListener("dragover", (event) => {
		if (!HasFiles(event)) return;
		// Without this the browser does not allow a drop, and opens the file instead.
		event.preventDefault();
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = "copy";
		}
	});

	document.addEventListener("dragleave", (event) => {
		if (!HasFiles(event)) return;
		depth = Math.max(0, depth - 1);
		if (depth === 0) {
			document.body.classList.remove(DROP_ACTIVE_CLASS);
		}
	});

	document.addEventListener("drop", (event) => {
		if (!HasFiles(event)) return;
		event.preventDefault();
		depth = 0;
		document.body.classList.remove(DROP_ACTIVE_CLASS);
		const files = event.dataTransfer?.files;
		if (!files || files.length === 0) return;
		elements.fileInput.files = files;
		elements.fileInput.dispatchEvent(new Event("change", { bubbles: true }));
	});
}
