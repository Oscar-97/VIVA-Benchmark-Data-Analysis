/**
 * `fileInput` is a reference to the HTMLInputElement with the ID "fileInput".
 * @type {HTMLInputElement}
 */
export const fileInput: HTMLInputElement = document.getElementById(
	"fileInput"
) as HTMLInputElement;

/**
 * `librarySelector` is a reference to the HTMLSelectElement with the ID "librarySelector".
 * @type {HTMLSelectElement}
 */
export const librarySelector: HTMLSelectElement = document.getElementById(
	"librarySelector"
) as HTMLSelectElement;

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
 * @type {HTMLElement}
 */
export const alertIcon: HTMLElement = document.getElementById(
	"alertIcon"
) as HTMLElement;

/**
 * `alertMessage` is a reference to the HTMLSpanElement with the ID "alertMessage".
 * @type {HTMLSpanElement}
 */
export const alertMessage: HTMLSpanElement = document.getElementById(
	"alertMessage"
) as HTMLSpanElement;

/**
 * `closeAlertButton` is a reference to the HTMLButtonElement with the ID "closeAlertButton".'
 * @type {HTMLButtonElement}
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
 * `showSelectedRowsButton` is a reference to the HTMLButtonElement with the ID "showSelectedRowsButton".
 * @type {HTMLButtonElement}
 */
export const showSelectedRowsButton: HTMLButtonElement =
	document.getElementById("showSelectedRowsButton") as HTMLButtonElement;

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
 * `configurationSettingsButton` is a reference to the HTMLButtonElement with the ID "configurationSettingsButton".
 * @type {HTMLButtonElement}
 */
export const configurationSettingsButton: HTMLButtonElement =
	document.getElementById("configurationSettingsButton") as HTMLButtonElement;

/**
 * `downloadCustomConfigurationButton` is a reference to the HTMLButtonElement with the ID "downloadCustomConfigurationButton".
 * @type {HTMLAnchorElement}
 */
export let downloadCustomConfigurationButton: HTMLAnchorElement | null = null;
document.addEventListener("DOMContentLoaded", () => {
	downloadCustomConfigurationButton = document.getElementById(
		"downloadCustomConfigurationButton"
	) as HTMLAnchorElement | null;
});

/**
 * `downloadCustomConfigurationButtonLayer` is a reference to the HTMLButtonElement with the ID "downloadCustomConfigurationButtonLayer".
 * @type {HTMLButtonElement}
 */
export const downloadCustomConfigurationButtonLayer: HTMLButtonElement =
	document.getElementById(
		"downloadCustomConfigurationButton"
	) as HTMLButtonElement;

/**
 * `deleteLocalStorageButton` is a reference to the HTMLButtonElement with the ID "deleteLocalStorageButton".
 * @type {HTMLButtonElement}
 */
export const deleteLocalStorageButton: HTMLButtonElement =
	document.getElementById("deleteLocalStorageButton") as HTMLButtonElement;

/**
 * `deleteDataModal` is a reference to the HTMLDivElement with the ID "deleteDataModal".
 */
export const deleteDataModal: HTMLDivElement = document.getElementById(
	"deleteDataModal"
) as HTMLDivElement;

/**
 * `deleteButtonInModal` is a reference to the HTMLButtonElement with the ID "deleteButtonInModal".
 */
export const deleteButtonInModal: HTMLButtonElement = document.getElementById(
	"deleteButtonInModal"
) as HTMLButtonElement;

/**
 * `clearDataTableModal` is a reference to the HTMLDivElement with the ID "clearDataTableModal".
 */
export const clearDataTableModal: HTMLDivElement = document.getElementById(
	"clearDataTableModal"
) as HTMLDivElement;

/**
 * `clearTableButtonInModal` is a reference to the HTMLButtonElement with the ID "clearTableButtonInModal".
 */
export const clearTableButtonInModal: HTMLButtonElement =
	document.getElementById("clearTableButtonInModal") as HTMLButtonElement;

/**
 * `clearDataTableButton` is a reference to the HTMLButtonElement with the ID "clearDataTableButton".
 * @type {HTMLButtonElement}
 */
export const clearDataTableButton: HTMLButtonElement = document.getElementById(
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
 * `dataTableGenerated` is a reference to the HTMLTableElement with the ID "dataTableGenerated".
 * @type {HTMLTableElement}
 */
export const dataTableGenerated = document.getElementById("dataTableGenerated");

/**
 * `dataTableGeneratedWrapper` is a reference to the HTMLDivElement with the ID "dataTableGenerated_wrapper".
 * @type {HTMLDivElement}
 */
export const dataTableGeneratedWrapper = document.getElementById(
	"dataTableGenerated_wrapper"
);

/**
 * `statisticsTableDiv` is a reference to the HTMLDivElement with the ID "statisticsTable".
 * @type {HTMLDivElement}
 */
export const statisticsTableDiv: HTMLDivElement = document.getElementById(
	"statisticsTable"
) as HTMLDivElement;

/**
 * `instanceAttributesTableDiv` is a reference to the HTMLDivElement with the ID "instanceAttributesTable".
 * @type {HTMLDivElement}
 */
export const instanceAttributesTableDiv: HTMLDivElement =
	document.getElementById("instanceAttributesTable") as HTMLDivElement;

/**
 * `solveAttributesTableDiv` is a reference to the HTMLDivElement with the ID "solveAttributesTable".
 * @type {HTMLDivElement}
 */
export const solveAttributesTableDiv: HTMLDivElement = document.getElementById(
	"solveAttributesTable"
) as HTMLDivElement;

/**
 * `comparisonTableDiv` is a reference to the HTMLDivElement with the ID "comparisonTable".
 * @type {HTMLDivElement}
 */
export const comparisonTableDiv: HTMLDivElement = document.getElementById(
	"comparisonTable"
) as HTMLDivElement;

/**
 * `chartCanvas` is a reference to the HTMLCanvasElement with the UD "myChart".
 * @type {HTMLCanvasElement}
 */
export const chartCanvas: HTMLCanvasElement = document.getElementById(
	"myChart"
) as HTMLCanvasElement;

/**
 * `viewPlotsButton` is a reference to the HTMLButtonElement with the ID "viewPlotsButton".
 * @type {HTMLButtonElement}
 */
export const viewPlotsButton: HTMLButtonElement = document.getElementById(
	"viewPlotsButton"
) as HTMLButtonElement;

/**
 * `compareSolversButton` is a reference to the HTMLButtonElement with the ID "compareSolversButton".
 * @type {HTMLButtonElement}
 */
export const compareSolversButton: HTMLButtonElement = document.getElementById(
	"compareSolversButton"
) as HTMLButtonElement;

/**
 * `downloadChartDataButton` is a reference to the HTMLAnchorElement with the ID "downloadChartDataButton".
 * @type {HTMLAnchorElement}
 */
export const downloadChartDataButton: HTMLAnchorElement =
	document.getElementById("downloadChartDataButton") as HTMLAnchorElement;

/**
 * `downloadChartDataButtonLayer` is a reference to the HTMLButtonElement with the ID "downloadChartDataButtonLayer".
 * @type {HTMLButtonElement}
 */
export const downloadChartDataButtonLayer: HTMLButtonElement =
	document.getElementById("downloadChartDataButtonLayer") as HTMLButtonElement;

/**
 * `demoModeButton` is a reference to the HTMLButtonElement with the ID "demoModeButton".
 * @type {HTMLButtonElement}
 */
export const demoDataButton: HTMLButtonElement = document.getElementById(
	"demoModeButton"
) as HTMLButtonElement;

/**
 * `demoDataSelector` is a reference to the HTMLSelectElement with the ID "demoDataSelector".
 * @type {HTMLSelectElement}
 */
export const demoDataSelector: HTMLSelectElement = document.getElementById(
	"demoDataSelector"
) as HTMLSelectElement;

/**
 * `releaseVersionTag` is a reference to the HTMLSpanElement with the ID "releaseVersionTagSpan".
 * @type {HTMLSpanElement}
 */
export const releaseVersionTag: HTMLSpanElement = document.getElementById(
	"releaseVersionTagSpan"
) as HTMLSpanElement;

/**
 * `solverSelector` is a reference to the HTMLSelectElement with the ID "solverSelector".
 * @type {HTMLSelectElement}
 */
export let solverSelector: HTMLSelectElement | null = null;
document.addEventListener("DOMContentLoaded", () => {
	solverSelector = document.getElementById(
		"solverSelector"
	) as HTMLSelectElement | null;
});

/**
 * `performanceProfileSelector` is a reference to the HTMLSelectElement with the ID "performanceProfileSelector".
 */
export const performanceProfileSelector: HTMLSelectElement =
	document.getElementById("performanceProfileSelector") as HTMLSelectElement;

/**
 * `defaultTimeInput` is a reference the HTMLInputElement with the ID "defaultTimeInput".
 */
export let defaultTimeInput: HTMLInputElement | null = null;
document.addEventListener("DOMContentLoaded", () => {
	defaultTimeInput = document.getElementById(
		"defaultTimeInput"
	) as HTMLInputElement | null;
});

/**
 * `gapLimitInput` is a reference the HTMLInputElement with the ID "gapLimitInput".
 */
export let gapLimitInput: HTMLInputElement | null = null;
document.addEventListener("DOMContentLoaded", () => {
	gapLimitInput = document.getElementById(
		"gapLimitInput"
	) as HTMLInputElement | null;
});

/**
 * `defaultTimeDirectInput` is a reference the HTMLInputElement with the ID "defaultTimeDirectInput".
 */
export const defaultTimeDirectInput: HTMLInputElement = document.getElementById(
	"defaultTimeDirectInput"
) as HTMLInputElement;

/**
 * `gapLimitDirectInput` is a reference the HTMLInputElement with the ID "gapLimitDirectInput".
 */
export const gapLimitDirectInput: HTMLInputElement = document.getElementById(
	"gapLimitDirectInput"
) as HTMLInputElement;

/**
 * `gapTypeSelector` is a reference to the HTMLSelectElement with the ID "gapTypeSelector".
 * @type {HTMLSelectElement}
 */
export const gapTypeSelector: HTMLSelectElement = document.getElementById(
	"gapTypeSelector"
) as HTMLSelectElement;

/**
 * `terminationTypeSelector` is a reference to the HTMLSelectElement with the ID "terminationTypeSelector".
 * @type {HTMLSelectElement}
 */
export const terminationTypeSelector: HTMLSelectElement =
	document.getElementById("terminationTypeSelector") as HTMLSelectElement;

/**
 * `categorySelector` is a reference to the HTMLSelectElement with the ID "categorySelector".
 */
export const categorySelector: HTMLSelectElement = document.getElementById(
	"categorySelector"
) as HTMLSelectElement;

/**
 * `filterTypeSelector` is a reference to the HTMLSelectElement with the ID "filterTypeSelector".
 */
export const filterTypeSelector: HTMLSelectElement = document.getElementById(
	"filterTypeSelector"
) as HTMLSelectElement;

/**
 * `statusSelector` is a reference to the HTMLSelectElement with the ID "statusSelector".
 */
export const statusSelector: HTMLSelectElement = document.getElementById(
	"statusSelector"
) as HTMLSelectElement;

/**
 * `chartTypeSelector` is a reference to the HTMLSelectElement with the ID "chartTypeSelector".
 */
export const chartTypeSelector: HTMLSelectElement = document.getElementById(
	"chartTypeSelector"
) as HTMLSelectElement;

/**
 * 'solverComparisonModal' is a reference to the HTMLDivElement with the ID "solverComparisonModal".
 * @type {HTMLDivElement}
 */
export const solverComparisonModal: HTMLDivElement = document.getElementById(
	"solverComparisonModal"
) as HTMLDivElement;

/**
 * 'solverComparisonModalLabel' is a reference to the HTMLHeadingElement with the ID "solverComparisonModalLabel".
 * @type {HTMLHeadingElement}
 */
export const solverComparisonModalLabel: HTMLHeadingElement =
	document.getElementById("solverComparisonModalLabel") as HTMLHeadingElement;

/**
 * 'solverComparisonModalBody' is a reference to the HTMLDivElement with the ID "solverComparisonModalBody".
 * @type {HTMLDivElement}
 */
export const solverComparisonModalBody: HTMLDivElement =
	document.getElementById("solverComparisonModalBody") as HTMLDivElement;
