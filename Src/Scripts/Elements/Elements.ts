/**
 * Looks up an element by its id.
 *
 * @param id - The id of the element.
 * @returns The element, or null if the page does not have it.
 */
export function FindElement<T extends HTMLElement>(id: string): T | null {
	return document.getElementById(id) as T | null;
}

/**
 * Gets an element by its id.
 *
 * @param id - The id of the element.
 * @throws Error if the page does not have the element.
 */
function GetElement<T extends HTMLElement>(id: string): T {
	const element = FindElement<T>(id);
	if (!element) {
		throw new Error(`The element #${id} was not found on this page.`);
	}
	return element;
}

/**
 * The elements of the pages.
 *
 * They are looked up when they are used, not when the module is imported. This way the elements that
 * are created later (like the modals and the tables) can be found as well. An element that is
 * missing on the page fails with an error that names it, except for the ones that are typed as possibly null,
 * which are only present on some pages.
 */
export const elements = {
	/**
	 * `fileInput` is a reference to the HTMLInputElement with the ID "fileInput".
	 * @type {HTMLInputElement}
	 */
	get fileInput(): HTMLInputElement {
		return GetElement<HTMLInputElement>("fileInput");
	},

	/**
	 * `librarySelector` is a reference to the HTMLSelectElement with the ID "librarySelector".
	 * @type {HTMLSelectElement}
	 */
	get librarySelector(): HTMLSelectElement {
		return GetElement<HTMLSelectElement>("librarySelector");
	},

	/**
	 * `importDataButton` is a reference to the HTMLButtonElement with the ID "importDataButton".
	 * @type {HTMLButtonElement}
	 */
	get importDataButton(): HTMLButtonElement {
		return GetElement<HTMLButtonElement>("importDataButton");
	},

	/**
	 * `alertNotification` is a reference to the HTMLDivElement with the ID "alertNotification".
	 * @type {HTMLDivElement}
	 */
	get alertNotification(): HTMLDivElement {
		return GetElement<HTMLDivElement>("alertNotification");
	},

	/**
	 * `alertIcon` is a reference to the HTMLElement with the id "alertIcon".
	 * @type {HTMLElement}
	 */
	get alertIcon(): HTMLElement {
		return GetElement<HTMLElement>("alertIcon");
	},

	/**
	 * `alertMessage` is a reference to the HTMLSpanElement with the ID "alertMessage".
	 * @type {HTMLSpanElement}
	 */
	get alertMessage(): HTMLSpanElement {
		return GetElement<HTMLSpanElement>("alertMessage");
	},

	/**
	 * `closeAlertButton` is a reference to the HTMLButtonElement with the ID "closeAlertButton".'
	 * @type {HTMLButtonElement}
	 */
	get closeAlertButton(): HTMLButtonElement {
		return GetElement<HTMLButtonElement>("closeAlertButton");
	},

	/**
	 * `viewTableButton` is a reference to the HTMLButtonElement with the ID "viewTableButton".
	 * @type {HTMLButtonElement}
	 */
	get viewTableButton(): HTMLButtonElement {
		return GetElement<HTMLButtonElement>("viewTableButton");
	},

	/**
	 * `showSelectedRowsButton` is a reference to the HTMLButtonElement with the ID "showSelectedRowsButton".
	 * @type {HTMLButtonElement}
	 */
	get showSelectedRowsButton(): HTMLButtonElement {
		return GetElement<HTMLButtonElement>("showSelectedRowsButton");
	},

	/**
	 * `saveLocalStorageButton` is a reference to the HTMLButtonElement with the ID "saveLocalStorageButton".
	 * @type {HTMLButtonElement}
	 */
	get saveLocalStorageButton(): HTMLButtonElement {
		return GetElement<HTMLButtonElement>("saveLocalStorageButton");
	},

	/**
	 * `downloadConfigurationButton` is a reference to the HTMLAnchorElement with the ID "downloadConfigurationButton".
	 * @type {HTMLAnchorElement}
	 */
	get downloadConfigurationButton(): HTMLAnchorElement {
		return GetElement<HTMLAnchorElement>("downloadConfigurationButton");
	},

	/**
	 * `downloadConfigurationButtonLayer` is a reference to the HTMLButtonElement with the ID "downloadConfigurationButtonLayer".
	 * @type {HTMLButtonElement}
	 */
	get downloadConfigurationButtonLayer(): HTMLButtonElement {
		return GetElement<HTMLButtonElement>("downloadConfigurationButtonLayer");
	},

	/**
	 * `configurationSettingsButton` is a reference to the HTMLButtonElement with the ID "configurationSettingsButton".
	 * @type {HTMLButtonElement}
	 */
	get configurationSettingsButton(): HTMLButtonElement {
		return GetElement<HTMLButtonElement>("configurationSettingsButton");
	},

	/**
	 * `downloadCustomConfigurationButton` is a reference to the HTMLAnchorElement with the ID "downloadCustomConfigurationButton".
	 * @type {HTMLAnchorElement}
	 */
	get downloadCustomConfigurationButton(): HTMLAnchorElement | null {
		return FindElement<HTMLAnchorElement>("downloadCustomConfigurationButton");
	},

	/**
	 * `downloadCustomConfigurationButtonLayer` is a reference to the HTMLButtonElement with the ID "downloadCustomConfigurationButtonLayer".
	 * @type {HTMLButtonElement}
	 */
	get downloadCustomConfigurationButtonLayer(): HTMLButtonElement {
		return GetElement<HTMLButtonElement>(
			"downloadCustomConfigurationButtonLayer"
		);
	},

	/**
	 * `deleteLocalStorageButton` is a reference to the HTMLButtonElement with the ID "deleteLocalStorageButton".
	 * @type {HTMLButtonElement}
	 */
	get deleteLocalStorageButton(): HTMLButtonElement {
		return GetElement<HTMLButtonElement>("deleteLocalStorageButton");
	},

	/**
	 * `deleteDataModal` is a reference to the HTMLDivElement with the ID "deleteDataModal".
	 */
	get deleteDataModal(): HTMLDivElement {
		return GetElement<HTMLDivElement>("deleteDataModal");
	},

	/**
	 * `deleteButtonInModal` is a reference to the HTMLButtonElement with the ID "deleteButtonInModal".
	 */
	get deleteButtonInModal(): HTMLButtonElement {
		return GetElement<HTMLButtonElement>("deleteButtonInModal");
	},

	/**
	 * `clearDataTableModal` is a reference to the HTMLDivElement with the ID "clearDataTableModal".
	 */
	get clearDataTableModal(): HTMLDivElement {
		return GetElement<HTMLDivElement>("clearDataTableModal");
	},

	/**
	 * `clearTableButtonInModal` is a reference to the HTMLButtonElement with the ID "clearTableButtonInModal".
	 */
	get clearTableButtonInModal(): HTMLButtonElement {
		return GetElement<HTMLButtonElement>("clearTableButtonInModal");
	},

	/**
	 * `clearDataTableButton` is a reference to the HTMLButtonElement with the ID "clearDataTableButton".
	 * @type {HTMLButtonElement}
	 */
	get clearDataTableButton(): HTMLButtonElement {
		return GetElement<HTMLButtonElement>("clearTableButton");
	},

	/**
	 * `loaderContainer` is a reference to the HTMLDivElement with the ID "loaderContainer".
	 * @type {HTMLDivElement}
	 */
	get loaderContainer(): HTMLDivElement {
		return GetElement<HTMLDivElement>("loaderContainer");
	},

	/**
	 * `dataTable` is a reference to the HTMLDivElement with the ID "dataTable".
	 * @type {HTMLDivElement}
	 */
	get dataTable(): HTMLDivElement {
		return GetElement<HTMLDivElement>("dataTable");
	},

	/**
	 * `dataTableGenerated` is a reference to the HTMLTableElement with the ID "dataTableGenerated".
	 * @type {HTMLTableElement}
	 */
	get dataTableGenerated(): HTMLElement | null {
		return FindElement<HTMLElement>("dataTableGenerated");
	},

	/**
	 * `dataTableGeneratedWrapper` is a reference to the HTMLDivElement with the ID "dataTableGenerated_wrapper".
	 * @type {HTMLDivElement}
	 */
	get dataTableGeneratedWrapper(): HTMLElement | null {
		return FindElement<HTMLElement>("dataTableGenerated_wrapper");
	},

	/**
	 * `statisticsTableDiv` is a reference to the HTMLDivElement with the ID "statisticsTable".
	 * @type {HTMLDivElement}
	 */
	get statisticsTableDiv(): HTMLDivElement {
		return GetElement<HTMLDivElement>("statisticsTable");
	},

	/**
	 * `instanceAttributesTableDiv` is a reference to the HTMLDivElement with the ID "instanceAttributesTable".
	 * @type {HTMLDivElement}
	 */
	get instanceAttributesTableDiv(): HTMLDivElement {
		return GetElement<HTMLDivElement>("instanceAttributesTable");
	},

	/**
	 * `solveAttributesTableDiv` is a reference to the HTMLDivElement with the ID "solveAttributesTable".
	 * @type {HTMLDivElement}
	 */
	get solveAttributesTableDiv(): HTMLDivElement {
		return GetElement<HTMLDivElement>("solveAttributesTable");
	},

	/**
	 * `comparisonTableDiv` is a reference to the HTMLDivElement with the ID "comparisonTable".
	 * @type {HTMLDivElement}
	 */
	get comparisonTableDiv(): HTMLDivElement {
		return GetElement<HTMLDivElement>("comparisonTable");
	},

	/**
	 * `chartCanvas` is a reference to the HTMLCanvasElement with the UD "myChart".
	 * @type {HTMLCanvasElement}
	 */
	get chartCanvas(): HTMLCanvasElement {
		return GetElement<HTMLCanvasElement>("myChart");
	},

	/**
	 * `viewPlotsButton` is a reference to the HTMLButtonElement with the ID "viewPlotsButton".
	 * @type {HTMLButtonElement}
	 */
	get viewPlotsButton(): HTMLButtonElement {
		return GetElement<HTMLButtonElement>("viewPlotsButton");
	},

	/**
	 * `compareSolversButton` is a reference to the HTMLButtonElement with the ID "compareSolversButton".
	 * @type {HTMLButtonElement}
	 */
	get compareSolversButton(): HTMLButtonElement {
		return GetElement<HTMLButtonElement>("compareSolversButton");
	},

	/**
	 * `downloadChartDataButton` is a reference to the HTMLAnchorElement with the ID "downloadChartDataButton".
	 * @type {HTMLAnchorElement}
	 */
	get downloadChartDataButton(): HTMLAnchorElement {
		return GetElement<HTMLAnchorElement>("downloadChartDataButton");
	},

	/**
	 * `downloadChartDataButtonLayer` is a reference to the HTMLButtonElement with the ID "downloadChartDataButtonLayer".
	 * @type {HTMLButtonElement}
	 */
	get downloadChartDataButtonLayer(): HTMLButtonElement {
		return GetElement<HTMLButtonElement>("downloadChartDataButtonLayer");
	},

	/**
	 * `demoModeButton` is a reference to the HTMLButtonElement with the ID "demoModeButton".
	 * @type {HTMLButtonElement}
	 */
	get demoDataButton(): HTMLButtonElement {
		return GetElement<HTMLButtonElement>("demoModeButton");
	},

	/**
	 * `demoDataSelector` is a reference to the HTMLSelectElement with the ID "demoDataSelector".
	 * @type {HTMLSelectElement}
	 */
	get demoDataSelector(): HTMLSelectElement {
		return GetElement<HTMLSelectElement>("demoDataSelector");
	},

	/**
	 * `releaseVersionTag` is a reference to the HTMLSpanElement with the ID "releaseVersionTagSpan".
	 * @type {HTMLSpanElement}
	 */
	get releaseVersionTag(): HTMLSpanElement {
		return GetElement<HTMLSpanElement>("releaseVersionTagSpan");
	},

	/**
	 * `solverSelector` is a reference to the HTMLSelectElement with the ID "solverSelector".
	 * @type {HTMLSelectElement}
	 */
	get solverSelector(): HTMLSelectElement | null {
		return FindElement<HTMLSelectElement>("solverSelector");
	},

	/**
	 * `performanceProfileSelector` is a reference to the HTMLSelectElement with the ID "performanceProfileSelector".
	 */
	get performanceProfileSelector(): HTMLSelectElement {
		return GetElement<HTMLSelectElement>("performanceProfileSelector");
	},

	/**
	 * `defaultTimeInput` is a reference the HTMLInputElement with the ID "defaultTimeInput".
	 */
	get defaultTimeInput(): HTMLInputElement | null {
		return FindElement<HTMLInputElement>("defaultTimeInput");
	},

	/**
	 * `gapLimitInput` is a reference the HTMLInputElement with the ID "gapLimitInput".
	 */
	get gapLimitInput(): HTMLInputElement | null {
		return FindElement<HTMLInputElement>("gapLimitInput");
	},

	/**
	 * `defaultTimeDirectInput` is a reference the HTMLInputElement with the ID "defaultTimeDirectInput".
	 */
	get defaultTimeDirectInput(): HTMLInputElement {
		return GetElement<HTMLInputElement>("defaultTimeDirectInput");
	},

	/**
	 * `gapLimitDirectInput` is a reference the HTMLInputElement with the ID "gapLimitDirectInput".
	 */
	get gapLimitDirectInput(): HTMLInputElement {
		return GetElement<HTMLInputElement>("gapLimitDirectInput");
	},

	/**
	 * `gapTypeSelector` is a reference to the HTMLSelectElement with the ID "gapTypeSelector".
	 * @type {HTMLSelectElement}
	 */
	get gapTypeSelector(): HTMLSelectElement {
		return GetElement<HTMLSelectElement>("gapTypeSelector");
	},

	/**
	 * `terminationTypeSelector` is a reference to the HTMLSelectElement with the ID "terminationTypeSelector".
	 * @type {HTMLSelectElement}
	 */
	get terminationTypeSelector(): HTMLSelectElement {
		return GetElement<HTMLSelectElement>("terminationTypeSelector");
	},

	/**
	 * `categorySelector` is a reference to the HTMLSelectElement with the ID "categorySelector".
	 */
	get categorySelector(): HTMLSelectElement {
		return GetElement<HTMLSelectElement>("categorySelector");
	},

	/**
	 * `filterTypeSelector` is a reference to the HTMLSelectElement with the ID "filterTypeSelector".
	 */
	get filterTypeSelector(): HTMLSelectElement {
		return GetElement<HTMLSelectElement>("filterTypeSelector");
	},

	/**
	 * `statusSelector` is a reference to the HTMLSelectElement with the ID "statusSelector".
	 */
	get statusSelector(): HTMLSelectElement {
		return GetElement<HTMLSelectElement>("statusSelector");
	},

	/**
	 * `chartTypeSelector` is a reference to the HTMLSelectElement with the ID "chartTypeSelector".
	 */
	get chartTypeSelector(): HTMLSelectElement {
		return GetElement<HTMLSelectElement>("chartTypeSelector");
	},

	/**
	 * 'solverComparisonModal' is a reference to the HTMLDivElement with the ID "solverComparisonModal".
	 * @type {HTMLDivElement}
	 */
	get solverComparisonModal(): HTMLDivElement {
		return GetElement<HTMLDivElement>("solverComparisonModal");
	},

	/**
	 * 'solverComparisonModalLabel' is a reference to the HTMLHeadingElement with the ID "solverComparisonModalLabel".
	 * @type {HTMLHeadingElement}
	 */
	get solverComparisonModalLabel(): HTMLHeadingElement {
		return GetElement<HTMLHeadingElement>("solverComparisonModalLabel");
	},

	/**
	 * 'solverComparisonModalBody' is a reference to the HTMLDivElement with the ID "solverComparisonModalBody".
	 * @type {HTMLDivElement}
	 */
	get solverComparisonModalBody(): HTMLDivElement {
		return GetElement<HTMLDivElement>("solverComparisonModalBody");
	}
};
