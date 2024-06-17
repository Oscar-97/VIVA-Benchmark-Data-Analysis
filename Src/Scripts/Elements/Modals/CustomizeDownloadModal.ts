export function CreateConfigurationSettingsModal(): void {
	// Create modal elements
	const modal = document.createElement("div");
	modal.className = "modal fade";
	modal.id = "configurationSettingsModal";
	modal.tabIndex = -1;
	modal.setAttribute("aria-labelledby", "configurationSettingsModalLabel");
	modal.setAttribute("aria-hidden", "true");

	const modalDialog = document.createElement("div");
	modalDialog.className = "modal-dialog";

	const modalContent = document.createElement("div");
	modalContent.className = "modal-content";

	const modalHeader = document.createElement("div");
	modalHeader.className = "modal-header";

	const modalTitle = document.createElement("h5");
	modalTitle.className = "modal-title";
	modalTitle.id = "configurationSettingsModalLabel";
	modalTitle.innerHTML =
		'<i class="bi bi-gear-fill"></i> UserConfiguration Settings';

	const modalCloseButton = document.createElement("button");
	modalCloseButton.type = "button";
	modalCloseButton.className = "btn-close";
	modalCloseButton.setAttribute("data-bs-dismiss", "modal");
	modalCloseButton.setAttribute("aria-label", "Close");

	const modalBody = document.createElement("div");
	modalBody.className = "modal-body";

	const p1 = document.createElement("p");
	p1.innerHTML = "Configure the <b>UserConfiguration.js</b> to be downloaded.";

	const iRequired = document.createElement("i");
	iRequired.textContent = "Required";

	const solverDiv = document.createElement("div");
	solverDiv.className = "mb-3";

	const solverLabel = document.createElement("label");
	solverLabel.className = "form-label";
	solverLabel.setAttribute("for", "solverSelector");
	solverLabel.textContent = "Select the solvers to save the instances for.";

	const solverSelect = document.createElement("select");
	solverSelect.className = "form-select";
	solverSelect.multiple = true;
	solverSelect.setAttribute("aria-label", "Select solvers");
	solverSelect.id = "solverSelector";

	solverDiv.appendChild(solverLabel);
	solverDiv.appendChild(solverSelect);

	const iOptional1 = document.createElement("i");
	iOptional1.textContent = "Optional";

	const p2 = document.createElement("p");
	p2.innerHTML = `Set the defaultTime to be used for all results with missing SolverTime or with a failed status. The default fallback value is 1000.
                    <br /><b>NOTE!</b> Only takes effect on the performance profile chart and compare solvers page.`;

	const defaultTimeDiv = document.createElement("div");
	defaultTimeDiv.className = "form-floating mb-3";

	const defaultTimeInput = document.createElement("input");
	defaultTimeInput.type = "number";
	defaultTimeInput.className = "form-control";
	defaultTimeInput.placeholder = "Enter a defaultTime.";
	defaultTimeInput.setAttribute("aria-label", "Input default time");
	defaultTimeInput.setAttribute("min", "1");
	defaultTimeInput.id = "defaultTimeInput";

	const defaultTimeLabel = document.createElement("label");
	defaultTimeLabel.setAttribute("for", "defaultTimeInput");
	defaultTimeLabel.textContent = "defaultTime";

	defaultTimeDiv.appendChild(defaultTimeInput);
	defaultTimeDiv.appendChild(defaultTimeLabel);

	const iOptional2 = document.createElement("i");
	iOptional2.textContent = "Optional";

	const p3 = document.createElement("p");
	p3.innerHTML = `Specify the gapLimit percentage to use for filtering results.
                    <br /><b>NOTE!</b> Only takes effect on the performance profile chart and compare solvers page.`;

	const gapLimitDiv = document.createElement("div");
	gapLimitDiv.className = "form-floating mb-3";

	const gapLimitInput = document.createElement("input");
	gapLimitInput.type = "number";
	gapLimitInput.className = "form-control";
	gapLimitInput.placeholder = "Enter a gapLimit.";
	gapLimitInput.setAttribute("aria-label", "Input gap limit");
	gapLimitInput.setAttribute("min", "0");
	gapLimitInput.setAttribute("step", "0.01");
	gapLimitInput.id = "gapLimitInput";

	const gapLimitLabel = document.createElement("label");
	gapLimitLabel.setAttribute("for", "gapLimitInput");
	gapLimitLabel.textContent = "gapLimit";

	gapLimitDiv.appendChild(gapLimitInput);
	gapLimitDiv.appendChild(gapLimitLabel);

	const modalFooter = document.createElement("div");
	modalFooter.className = "modal-footer";

	const downloadButtonLayer = document.createElement("button");
	downloadButtonLayer.type = "button";
	downloadButtonLayer.className = "btn btn-primary";
	downloadButtonLayer.id = "downloadCustomConfigurationButtonLayer";

	const downloadButton = document.createElement("a");
	downloadButton.id = "downloadCustomConfigurationButton";
	downloadButton.setAttribute("data-toggle", "tooltip");
	downloadButton.setAttribute("data-placement", "top");
	downloadButton.setAttribute(
		"title",
		"Download a customized user configuration."
	);
	downloadButton.innerHTML = '<i class="bi bi-download"></i> Download Data';

	downloadButtonLayer.appendChild(downloadButton);

	// Append elements
	modalFooter.appendChild(downloadButtonLayer);

	modalBody.appendChild(p1);
	modalBody.appendChild(iRequired);
	modalBody.appendChild(solverDiv);
	modalBody.appendChild(iOptional1);
	modalBody.appendChild(p2);
	modalBody.appendChild(defaultTimeDiv);
	modalBody.appendChild(iOptional2);
	modalBody.appendChild(p3);
	modalBody.appendChild(gapLimitDiv);
	modalBody.appendChild(modalFooter);

	modalHeader.appendChild(modalTitle);
	modalHeader.appendChild(modalCloseButton);

	modalContent.appendChild(modalHeader);
	modalContent.appendChild(modalBody);

	modalDialog.appendChild(modalContent);
	modal.appendChild(modalDialog);

	// Append modal to body
	document.body.appendChild(modal);
}
