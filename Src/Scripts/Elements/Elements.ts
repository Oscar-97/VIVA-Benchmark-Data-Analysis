/**
 * `fileInput` is a reference to the HTMLInputElement with the ID "fileInput".
 * @type {HTMLInputElement}
 */
export const fileInput: HTMLInputElement = document.getElementById(
	"fileInput"
) as HTMLInputElement;

/**
 * `importDataButton` is a reference to the HTMLButtonElement with the ID "importDataButton".
 * @type {HTMLButtonElement}
 */
export const importDataButton: HTMLButtonElement = document.getElementById(
	"importDataButton"
) as HTMLButtonElement;

/**
 * `alertNotification` is a reference to the HTMLDivElement with the ID "alertNotification".
 * @type {HTMLDivElement}
 */
export const alertNotification: HTMLDivElement = document.getElementById(
	"alertNotification"
) as HTMLDivElement;

/**
 * `alertIcon` is a reference to the HTMLElement with the id "alertIcon".
 */
export const alertIcon: HTMLElement = document.getElementById(
	"alertIcon"
) as HTMLElement;

/**
 * `alertMessage` is a reference to the HTMLSpanElement with the ID "alertMessage".
 */
export const alertMessage: HTMLSpanElement = document.getElementById(
	"alertMessage"
) as HTMLSpanElement;

/**
 * `closeAlertButton` is a reference to the HTMLButtonElement with the ID "closeAlertButton".
 */
export const closeAlertButton: HTMLButtonElement = document.getElementById(
	"closeAlertButton"
) as HTMLButtonElement;

/**
 * `viewTableButton` is a reference to the HTMLButtonElement with the ID "viewTableButton".
 * @type {HTMLButtonElement}
 */
export const viewTableButton: HTMLButtonElement = document.getElementById(
	"viewTableButton"
) as HTMLButtonElement;

/**
 * `filterSelectionButton` is a reference to the HTMLButtonElement with the ID "filterSelectionButton".
 * @type {HTMLButtonElement}
 */
export const filterSelectionButton: HTMLButtonElement = document.getElementById(
	"filterSelectionButton"
) as HTMLButtonElement;

/**
 * `saveLocalStorageButton` is a reference to the HTMLButtonElement with the ID "saveLocalStorageButton".
 * @type {HTMLButtonElement}
 */
export const saveLocalStorageButton: HTMLButtonElement =
	document.getElementById("saveLocalStorageButton") as HTMLButtonElement;

/**
 * `downloadConfigurationButton` is a reference to the HTMLAnchorElement with the ID "downloadConfigurationButton".
 * @type {HTMLAnchorElement}
 */
export const downloadConfigurationButton: HTMLAnchorElement =
	document.getElementById("downloadConfigurationButton") as HTMLAnchorElement;

/**
 * `downloadConfigurationButtonLayer` is a reference to the HTMLButtonElement with the ID "downloadConfigurationButtonLayer".
 * @type {HTMLButtonElement}
 */
export const downloadConfigurationButtonLayer: HTMLButtonElement =
	document.getElementById(
		"downloadConfigurationButtonLayer"
	) as HTMLButtonElement;

/**
 * `deleteLocalStorageButton` is a reference to the HTMLButtonElement with the ID "deleteLocalStorageButton".
 * @type {HTMLButtonElement}
 */
export const deleteLocalStorageButton: HTMLButtonElement =
	document.getElementById("deleteLocalStorageButton") as HTMLButtonElement;

/**
 * `clearTableButton` is a reference to the HTMLButtonElement with the ID "clearTableButton".
 * @type {HTMLButtonElement}
 */
export const clearTableButton: HTMLButtonElement = document.getElementById(
	"clearTableButton"
) as HTMLButtonElement;

/**
 * `loaderContainer` is a reference to the HTMLDivElement with the ID "loaderContainer".
 * @type {HTMLDivElement}
 */
export const loaderContainer: HTMLDivElement = document.getElementById(
	"loaderContainer"
) as HTMLDivElement;

/**
 * `dataTable` is a reference to the HTMLDivElement with the ID "dataTable".
 * @type {HTMLDivElement}
 */
export const dataTable: HTMLDivElement = document.getElementById(
	"dataTable"
) as HTMLDivElement;

/**
 * `viewPlotsButton` is a reference to the HTMLButtonElement with the ID "viewPlotsButton".
 * @type {HTMLButtonElement}
 */
export const viewPlotsButton: HTMLButtonElement = document.getElementById(
	"viewPlotsButton"
) as HTMLButtonElement;

/**
 * SVG alert icon: Check Circle.
 */
export const checkCircleFill = `
<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="16" height="16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
</svg>`;

/**
 * SVG alert icon: Exclamation Triangle.
 */
export const exclamationTriangleFill = `
<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="16" height="16">
  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
</svg>`;
