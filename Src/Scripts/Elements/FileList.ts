import {
	DescribeSelection,
	FileKind,
	ReadSolverName
} from "../DataProcessing/FileSelection";
import { elements } from "./Elements";

const ICONS: Record<FileKind, string> = {
	trace: "bi-file-earmark-text",
	instances: "bi-file-earmark-spreadsheet",
	bounds: "bi-file-earmark-ruled",
	configuration: "bi-file-earmark-code",
	unsupported: "bi-file-earmark-x"
};

/**
 * Makes the entry of a chosen file. The text is set as text, as it comes from file names.
 */
function CreateFileItem(
	name: string,
	kind: FileKind,
	label: string
): { item: HTMLLIElement; detail: HTMLSpanElement } {
	const item = document.createElement("li");
	item.className =
		kind === "unsupported" ? "selected-file text-danger" : "selected-file";

	const icon = document.createElement("i");
	icon.className = `bi ${ICONS[kind]} me-2`;
	icon.setAttribute("aria-hidden", "true");

	const fileName = document.createElement("span");
	fileName.className = "fw-semibold";
	fileName.textContent = name;

	const detail = document.createElement("span");
	detail.className = "text-body-secondary ms-2";
	detail.textContent = label;

	item.append(icon, fileName, detail);
	return { item, detail };
}

/**
 * Lists the chosen files in the explanation of how to load data: what each file is taken for, the solver of
 * a trace file, and what stops the files from being uploaded.
 *
 * @param files - The files that the user chose.
 */
export function ShowFileList(files: readonly File[]): void {
	const container = elements.selectedFiles;
	if (files.length === 0) {
		container.replaceChildren();
		return;
	}

	const selection = DescribeSelection(files);
	const list = document.createElement("ul");
	list.className = "list-unstyled mb-2";

	selection.files.forEach((selected, index) => {
		const { item, detail } = CreateFileItem(
			selected.name,
			selected.kind,
			selected.label
		);
		list.append(item);

		const file = files[index];
		if (selected.kind === "trace" && file) {
			void ReadSolverName(file).then((solver) => {
				if (solver) {
					detail.textContent = `${selected.label}, solver ${solver}`;
				}
			});
		}
	});
	container.replaceChildren(list);

	for (const problem of selection.problems) {
		const message = document.createElement("p");
		message.className = "text-danger mb-1";
		message.textContent = problem;
		container.append(message);
	}
}
