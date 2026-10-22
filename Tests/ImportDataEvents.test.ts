interface FakeButton {
	disabled: boolean;
}

function Button(disabled: boolean): FakeButton {
	return { disabled };
}

const remove = jest.fn();
const fakeElements = {
	librarySelector: Button(false),
	viewTableButton: Button(true),
	showSelectedRowsButton: Button(false),
	importDataButton: Button(false),
	deleteLocalStorageButton: Button(true),
	compareSolversButton: Button(true),
	saveLocalStorageButton: Button(false),
	viewPlotsButton: Button(true),
	demoDataSelector: { value: "" },
	dataTableGeneratedWrapper: { remove } as { remove: () => void } | null,
	dataTableGenerated: { remove } as { remove: () => void } | null
};

jest.mock("../Src/Scripts/Elements/Elements", () => ({
	elements: fakeElements
}));
jest.mock("../Src/Scripts/Elements/EmptyState", () => ({
	SetEmptyStateVisible: jest.fn()
}));
jest.mock("../Src/Scripts/Elements/LoadStatus", () => ({
	ClearLoadStatus: jest.fn()
}));
jest.mock("../Src/Scripts/Elements/Events/DisplayAlertNotification", () => ({
	DisplayAlertNotification: jest.fn()
}));

import {
	FillSolverSelectorList,
	ImportDataEvents
} from "../Src/Scripts/Elements/Events/ImportDataEvents";
import { DisplayAlertNotification } from "../Src/Scripts/Elements/Events/DisplayAlertNotification";
import { SetEmptyStateVisible } from "../Src/Scripts/Elements/EmptyState";
import { ClearLoadStatus } from "../Src/Scripts/Elements/LoadStatus";
import { Keys } from "../Src/Scripts/Constants/Keys";
import { PageTitles } from "../Src/Scripts/Constants/PageTitles";

interface FakeOption {
	value: string;
	textContent: string;
	selected: boolean;
}

let title = "";
let options: FakeOption[] = [];
let solverSelector: object | null = null;
let savedNotification: string | null = null;

function Reset(): void {
	fakeElements.librarySelector.disabled = false;
	fakeElements.viewTableButton.disabled = true;
	fakeElements.showSelectedRowsButton.disabled = false;
	fakeElements.importDataButton.disabled = false;
	fakeElements.deleteLocalStorageButton.disabled = true;
	fakeElements.compareSolversButton.disabled = true;
	fakeElements.saveLocalStorageButton.disabled = false;
	fakeElements.viewPlotsButton.disabled = true;
	fakeElements.demoDataSelector.value = "";
	fakeElements.dataTableGeneratedWrapper = { remove };
	fakeElements.dataTableGenerated = { remove };
	remove.mockReset();
	jest.mocked(DisplayAlertNotification).mockClear();
	jest.mocked(SetEmptyStateVisible).mockClear();
	jest.mocked(ClearLoadStatus).mockClear();
	savedNotification = null;
	options = [];
	solverSelector = {
		innerHTML: "stale",
		appendChild: (option: FakeOption): void => {
			options.push(option);
		}
	};
	Object.defineProperty(globalThis, "document", {
		value: {
			get title(): string {
				return title;
			},
			getElementById: (id: string): object | null =>
				id === "solverSelector" ? solverSelector : null,
			createElement: (): FakeOption => ({
				value: "",
				textContent: "",
				selected: false
			})
		},
		configurable: true,
		writable: true
	});
	Object.defineProperty(globalThis, "sessionStorage", {
		value: {
			getItem: (key: string): string | null =>
				key === Keys.SAVED_STORAGE_NOTIFICATION ? savedNotification : null
		},
		configurable: true,
		writable: true
	});
}

describe("ImportDataEvents", () => {
	beforeEach(Reset);

	it("should lock the library selector, hide the empty state and clear the load status on every page", () => {
		title = PageTitles.SOLUTION_TIME;

		ImportDataEvents("Loaded");

		expect(fakeElements.librarySelector.disabled).toBe(true);
		expect(SetEmptyStateVisible).toHaveBeenCalledWith(false);
		expect(ClearLoadStatus).toHaveBeenCalled();
	});

	it("should show the alert notification unless a saved storage notification is set", () => {
		title = PageTitles.TABLE;
		ImportDataEvents("Loaded");
		expect(DisplayAlertNotification).toHaveBeenCalledWith("Loaded");

		jest.mocked(DisplayAlertNotification).mockClear();
		savedNotification = "shown";
		ImportDataEvents("Loaded");
		expect(DisplayAlertNotification).not.toHaveBeenCalled();
	});

	describe("on the table page", () => {
		beforeEach(() => {
			title = PageTitles.TABLE;
		});

		it("should remove the old table and open the table button", () => {
			ImportDataEvents("Loaded", "trc");

			expect(remove).toHaveBeenCalledTimes(2);
			expect(fakeElements.viewTableButton.disabled).toBe(false);
			expect(fakeElements.showSelectedRowsButton.disabled).toBe(true);
			expect(fakeElements.importDataButton.disabled).toBe(true);
			expect(fakeElements.deleteLocalStorageButton.disabled).toBe(true);
		});

		it("should enable deleting the stored data for a json file", () => {
			ImportDataEvents("Loaded", "json");

			expect(fakeElements.deleteLocalStorageButton.disabled).toBe(false);
		});

		it("should select the demo data that was loaded", () => {
			ImportDataEvents("Loaded", "trc", "demo1");
			expect(fakeElements.demoDataSelector.value).toBe("Demo_1");

			ImportDataEvents("Loaded", "trc", "demo2");
			expect(fakeElements.demoDataSelector.value).toBe("Demo_2");
		});

		it("should leave the demo selector alone for other data", () => {
			ImportDataEvents("Loaded", "trc");

			expect(fakeElements.demoDataSelector.value).toBe("");
		});

		it("should work when there is no table to remove", () => {
			fakeElements.dataTableGeneratedWrapper = null;
			fakeElements.dataTableGenerated = null;

			expect(() => ImportDataEvents("Loaded", "trc")).not.toThrow();
			expect(fakeElements.viewTableButton.disabled).toBe(false);
		});

		it("should keep going when a table cannot be removed", () => {
			const error = jest.spyOn(console, "error").mockImplementation(() => {
				// The error is expected.
			});
			remove.mockImplementation(() => {
				throw new Error("detached");
			});

			expect(() => ImportDataEvents("Loaded", "trc")).not.toThrow();
			expect(error).toHaveBeenCalled();
			expect(fakeElements.viewTableButton.disabled).toBe(false);
			error.mockRestore();
		});
	});

	it("should open the compare button on the compare solvers page", () => {
		title = PageTitles.COMPARE_SOLVERS;

		ImportDataEvents("Loaded", "json");

		expect(fakeElements.compareSolversButton.disabled).toBe(false);
		expect(fakeElements.importDataButton.disabled).toBe(true);
		expect(fakeElements.saveLocalStorageButton.disabled).toBe(true);
		expect(fakeElements.deleteLocalStorageButton.disabled).toBe(false);
	});

	it("should open the plot button on a plot page", () => {
		title = PageTitles.PERFORMANCE_PROFILE;

		ImportDataEvents("Loaded", "trc");

		expect(fakeElements.viewPlotsButton.disabled).toBe(false);
		expect(fakeElements.importDataButton.disabled).toBe(true);
		expect(fakeElements.saveLocalStorageButton.disabled).toBe(true);
		expect(fakeElements.deleteLocalStorageButton.disabled).toBe(true);
	});
});

describe("FillSolverSelectorList", () => {
	beforeEach(Reset);

	it("should list each solver once, in the order of the data, and select the first", () => {
		FillSolverSelectorList([
			{ SolverName: "SCIP" },
			{ SolverName: "BARON" },
			{ SolverName: "SCIP" },
			{ SolverName: "BARON" }
		]);

		expect(options).toEqual([
			{ value: "SCIP", textContent: "SCIP", selected: true },
			{ value: "BARON", textContent: "BARON", selected: false }
		]);
	});

	it("should empty the selector first, and skip rows without a solver", () => {
		FillSolverSelectorList([{ InputFileName: "alan" }, { SolverName: "SCIP" }]);

		expect((solverSelector as { innerHTML: string }).innerHTML).toBe("");
		expect(options.map((option) => option.value)).toEqual(["SCIP"]);
	});

	it("should do nothing without a selector on the page", () => {
		solverSelector = null;

		expect(() =>
			FillSolverSelectorList([{ SolverName: "SCIP" }])
		).not.toThrow();
		expect(options).toEqual([]);
	});
});
