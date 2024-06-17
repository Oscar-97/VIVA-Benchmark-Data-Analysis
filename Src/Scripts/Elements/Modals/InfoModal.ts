import { Values } from "../../Constants/Values";

export function CreateFileFormatInformationModal(): void {
	// Create modal elements
	const modal = document.createElement("div");
	modal.className = "modal fade";
	modal.id = "fileFormatInformationModal";
	modal.tabIndex = -1;
	modal.setAttribute("aria-labelledby", "fileFormatInformationModalLabel");
	modal.setAttribute("aria-hidden", "true");

	const modalDialog = document.createElement("div");
	modalDialog.className = "modal-dialog";

	const modalContent = document.createElement("div");
	modalContent.className = "modal-content";

	const modalHeader = document.createElement("div");
	modalHeader.className = "modal-header";

	const modalTitle = document.createElement("h5");
	modalTitle.className = "modal-title";
	modalTitle.id = "fileFormatInformationModalLabel";
	modalTitle.innerHTML =
		'<i class="bi bi-info-circle"></i> Short Information on variables and headers.';

	const modalCloseButton = document.createElement("button");
	modalCloseButton.type = "button";
	modalCloseButton.className = "btn-close";
	modalCloseButton.setAttribute("data-bs-dismiss", "modal");
	modalCloseButton.setAttribute("aria-label", "Close");

	const modalBody = document.createElement("div");
	modalBody.className = "modal-body";

	const infoModalHeading = document.createElement("h5");
	infoModalHeading.innerHTML = "Result File Formats and Headers";

	const defaultTimeHeading = document.createElement("h5");
	defaultTimeHeading.innerHTML = "Default Time";

	const gapLimitHeading = document.createElement("h5");
	gapLimitHeading.innerHTML = "Gap Limit";

	const p1 = document.createElement("p");
	p1.innerHTML =
		"Please upload either one or more <b>.trc</b> files that include the headers, or if they are headerless, follow this standard header structure as shown here in the collapsible list. Alternatively, a single <b>.json</b> file with the structure mentioned in the documentation can also be used.";

	const p2 = document.createElement("p");
	p2.innerHTML =
		"Optionally, one can also upload a <b>.csv</b> file containing information about instance properties, or a <b>.solu</b> file containing the best known bounds.";

	const p3 = document.createElement("p");
	p3.innerHTML =
		"See the documentation for more information regarding the application.";

	const p4 = document.createElement("p");
	p4.innerHTML = `The default time is a falllback value used if the SolverTime is not available. It is used in the performance profile chart and on the compare solvers page. The default value is ${Values.DEFAULT_TIME}.`;

	const p5 = document.createElement("p");
	p5.innerHTML = `The gap limit percentage is used to limit the selected instances. It is used in the performance profile chart and on the compare solvers page. The default value is ${Values.DEFAULT_GAP_LIMIT}%.`;

	const buttonContainer = document.createElement("div");
	buttonContainer.className = "d-grid gap-2";

	const divider = document.createElement("hr");
	divider.className = "my-1";

	const toggleButton = document.createElement("button");
	toggleButton.className = "btn btn-success mb-1";
	toggleButton.type = "button";
	toggleButton.setAttribute("data-bs-toggle", "collapse");
	toggleButton.setAttribute("data-bs-target", "#expandableList");
	toggleButton.setAttribute("aria-expanded", "false");
	toggleButton.setAttribute("aria-controls", "expandableList");
	toggleButton.innerHTML = '<i class="bi bi-list"></i> List of Headers';

	const collapseDiv = document.createElement("div");
	collapseDiv.className = "collapse";
	collapseDiv.id = "expandableList";

	const listGroup = document.createElement("ul");
	listGroup.className = "list-group mt-2 mb-1";

	const headers = [
		"InputFileName",
		"ModelType",
		"SolverName",
		"NLP",
		"MIP",
		"JulianDate",
		"Direction",
		"NumberOfEquations",
		"NumberOfVariables",
		"NumberOfDiscreteVariables",
		"NumberOfNonZeros",
		"NumberOfNonlinearNonZeros",
		"OptionFile",
		"ModelStatus",
		"TermStatus",
		"ObjectiveValue",
		"ObjectiveValueEstimate",
		"SolverTime",
		"NumberOfIterations",
		"NumberOfDomainViolations",
		"NumberOfNodes",
		"UserComment"
	];

	headers.forEach((header) => {
		const listItem = document.createElement("li");
		listItem.className = "list-group-item";
		listItem.textContent = header;
		listGroup.appendChild(listItem);
	});

	// Append elements
	collapseDiv.appendChild(listGroup);
	buttonContainer.appendChild(toggleButton);

	modalBody.appendChild(infoModalHeading);
	modalBody.appendChild(p1);
	modalBody.appendChild(buttonContainer);
	modalBody.appendChild(collapseDiv);
	modalBody.appendChild(p2);
	modalBody.appendChild(defaultTimeHeading);
	modalBody.appendChild(p4);
	modalBody.appendChild(gapLimitHeading);
	modalBody.appendChild(p5);
	modalBody.appendChild(divider);
	modalBody.appendChild(p3);

	modalHeader.appendChild(modalTitle);
	modalHeader.appendChild(modalCloseButton);

	modalContent.appendChild(modalHeader);
	modalContent.appendChild(modalBody);

	modalDialog.appendChild(modalContent);
	modal.appendChild(modalDialog);

	// Append modal to body
	document.body.appendChild(modal);
}
