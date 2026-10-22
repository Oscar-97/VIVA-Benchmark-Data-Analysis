interface FakeOption {
	value: string;
	selected: boolean;
}

const handlers = new Map<unknown, () => void>();
const fakeElements = {
	configurationSettingsButton: { disabled: true },
	downloadConfigurationButton: { id: "downloadConfigurationButton" },
	deleteLocalStorageButton: { disabled: false },
	downloadConfigurationButtonLayer: { disabled: false },
	solverSelector: { value: "SCIP" } as { value: string } | null,
	defaultTimeInput: { value: "" } as { value: string } | null,
	gapLimitInput: { value: "" } as { value: string } | null
};

jest.mock("../Src/Scripts/App/PageListeners", () => ({
	Listen: (target: unknown, _type: string, handler: () => void): void => {
		if (target) handlers.set(target, handler);
	}
}));
jest.mock("../Src/Scripts/Elements/Elements", () => ({
	elements: fakeElements
}));
jest.mock("../Src/Scripts/Elements/Events/ImportDataEvents", () => ({
	FillSolverSelectorList: jest.fn()
}));
jest.mock("../Src/Scripts/DataProcessing/CreateData", () => ({
	ConvertToTraceFile: jest.fn((rows: { SolverName: string }[]): string[] =>
		rows.map((row) => row.SolverName)
	)
}));
jest.mock("../Src/Scripts/UserConfiguration/UserConfiguration", () => ({
	DeleteUserConfiguration: jest.fn(),
	DownloadCustomizedUserConfiguration: jest.fn(),
	DownloadUserConfiguration: jest.fn()
}));

import { HandleCommonButtons } from "../Src/Scripts/Pages/CommonButtons";
import { state } from "../Src/Scripts/App/AppState";
import { Values } from "../Src/Scripts/Constants/Values";
import { ConvertToTraceFile } from "../Src/Scripts/DataProcessing/CreateData";
import { FillSolverSelectorList } from "../Src/Scripts/Elements/Events/ImportDataEvents";
import {
	DeleteUserConfiguration,
	DownloadCustomizedUserConfiguration,
	DownloadUserConfiguration
} from "../Src/Scripts/UserConfiguration/UserConfiguration";
import { TraceData } from "../Src/Scripts/Interfaces/Interfaces";

const traceData: TraceData[] = [
	{ SolverName: "SCIP", InputFileName: "alan" },
	{ SolverName: "BARON", InputFileName: "alan" },
	{ SolverName: "SCIP", InputFileName: "ex1223" }
];

const solverSelector = { options: [] as FakeOption[] };
const deleteButtonInModal = { id: "deleteButtonInModal" };
const downloadCustomConfigButton = { id: "downloadCustomConfigurationButton" };
let hasCustomButton = true;

function Click(target: unknown): void {
	const handler = handlers.get(target);
	if (!handler) throw new Error("No click handler was registered.");
	handler();
}

describe("HandleCommonButtons", () => {
	beforeEach(() => {
		handlers.clear();
		jest.clearAllMocks();
		hasCustomButton = true;
		solverSelector.options = [];
		fakeElements.configurationSettingsButton.disabled = true;
		fakeElements.deleteLocalStorageButton.disabled = false;
		fakeElements.downloadConfigurationButtonLayer.disabled = false;
		fakeElements.solverSelector = { value: "SCIP" };
		fakeElements.defaultTimeInput = { value: "" };
		fakeElements.gapLimitInput = { value: "" };
		state.defaultTime = 0;
		state.gapLimit = 0;
		Object.defineProperty(globalThis, "document", {
			value: {
				getElementById: (id: string): unknown => {
					if (id === "solverSelector") return solverSelector;
					if (id === "deleteButtonInModal") return deleteButtonInModal;
					if (id === "downloadCustomConfigurationButton") {
						return hasCustomButton ? downloadCustomConfigButton : null;
					}
					return null;
				}
			},
			configurable: true,
			writable: true
		});
	});

	it("should fill the solver list and enable the settings button", () => {
		HandleCommonButtons(traceData, []);

		expect(FillSolverSelectorList).toHaveBeenCalledWith(traceData);
		expect(fakeElements.configurationSettingsButton.disabled).toBe(false);
	});

	it("should download the stored configuration", () => {
		HandleCommonButtons(traceData, []);
		Click(fakeElements.downloadConfigurationButton);

		expect(DownloadUserConfiguration).toHaveBeenCalledTimes(1);
	});

	it("should delete the stored data and disable the buttons that need it", () => {
		HandleCommonButtons(traceData, []);
		Click(deleteButtonInModal);

		expect(DeleteUserConfiguration).toHaveBeenCalledTimes(1);
		expect(fakeElements.deleteLocalStorageButton.disabled).toBe(true);
		expect(fakeElements.downloadConfigurationButtonLayer.disabled).toBe(true);
	});

	describe("the customized download", () => {
		it("should only export the selected solvers", () => {
			const selected: string[] = ["BARON"];
			HandleCommonButtons(traceData, selected);
			Click(downloadCustomConfigButton);

			expect(ConvertToTraceFile).toHaveBeenCalledWith([traceData[1]]);
			expect(DownloadCustomizedUserConfiguration).toHaveBeenCalledWith(
				["BARON"],
				Values.DEFAULT_TIME,
				Values.DEFAULT_GAP_LIMIT
			);
		});

		it("should follow the solvers that the user selects in the list", () => {
			HandleCommonButtons(traceData, ["SCIP"]);
			solverSelector.options = [
				{ value: "SCIP", selected: false },
				{ value: "BARON", selected: true }
			];
			Click(solverSelector);
			Click(downloadCustomConfigButton);

			expect(ConvertToTraceFile).toHaveBeenCalledWith([traceData[1]]);
		});

		it("should use the first solver of the list when none is selected", () => {
			HandleCommonButtons(traceData, []);
			Click(downloadCustomConfigButton);

			expect(ConvertToTraceFile).toHaveBeenCalledWith([
				traceData[0],
				traceData[2]
			]);
		});

		it("should use an empty solver name when there is no selector", () => {
			fakeElements.solverSelector = null;
			HandleCommonButtons(traceData, []);
			Click(downloadCustomConfigButton);

			expect(ConvertToTraceFile).toHaveBeenCalledWith([]);
		});

		it("should read the default time and the gap limit from the inputs", () => {
			fakeElements.defaultTimeInput = { value: "250" };
			fakeElements.gapLimitInput = { value: "0.5" };
			HandleCommonButtons(traceData, ["SCIP"]);
			Click(downloadCustomConfigButton);

			expect(state.defaultTime).toBe(250);
			expect(state.gapLimit).toBe(0.5);
			expect(DownloadCustomizedUserConfiguration).toHaveBeenCalledWith(
				["SCIP", "SCIP"],
				250,
				0.5
			);
		});

		it.each(["", "0", "abc"])(
			"should fall back to the defaults for the input %p",
			(value) => {
				fakeElements.defaultTimeInput = { value };
				fakeElements.gapLimitInput = { value };
				HandleCommonButtons(traceData, ["SCIP"]);
				Click(downloadCustomConfigButton);

				expect(state.defaultTime).toBe(Values.DEFAULT_TIME);
				expect(state.gapLimit).toBe(Values.DEFAULT_GAP_LIMIT);
			}
		);

		it("should fall back to the defaults when the inputs do not exist", () => {
			fakeElements.defaultTimeInput = null;
			fakeElements.gapLimitInput = null;
			HandleCommonButtons(traceData, ["SCIP"]);
			Click(downloadCustomConfigButton);

			expect(state.defaultTime).toBe(Values.DEFAULT_TIME);
			expect(state.gapLimit).toBe(Values.DEFAULT_GAP_LIMIT);
		});

		it("should not register a handler on a page without the button", () => {
			hasCustomButton = false;
			HandleCommonButtons(traceData, []);

			expect(handlers.has(downloadCustomConfigButton)).toBe(false);
		});
	});
});
