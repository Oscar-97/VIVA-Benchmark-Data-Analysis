import {
	ApplyStoredConfiguration,
	ResetAppState,
	state
} from "../Src/Scripts/App/AppState";
import { GetPageKind, PageKind } from "../Src/Scripts/App/CurrentPage";
import { Listen, ResetPageListeners } from "../Src/Scripts/App/PageListeners";
import { PageTitles } from "../Src/Scripts/Constants/PageTitles";

describe("GetPageKind", () => {
	it("should recognize the table page", () => {
		expect(GetPageKind(PageTitles.TABLE)).toBe(PageKind.TABLE);
	});

	it("should recognize the compare solvers page", () => {
		expect(GetPageKind(PageTitles.COMPARE_SOLVERS)).toBe(
			PageKind.COMPARE_SOLVERS
		);
	});

	it("should treat every other page as a plot page", () => {
		expect(GetPageKind(PageTitles.PERFORMANCE_PROFILE)).toBe(PageKind.PLOT);
		expect(GetPageKind(PageTitles.SOLUTION_TIME)).toBe(PageKind.PLOT);
		expect(GetPageKind("An unknown page")).toBe(PageKind.PLOT);
	});
});

describe("ResetAppState", () => {
	it("should reset all values of the shared state", () => {
		state.dataFileType = "trc";
		state.defaultTime = 10;
		state.gapLimit = 0.5;
		state.unprocessedData = ["data"];
		state.unprocessedInstanceInformationData = ["instances"];
		state.unprocessedSolutionData = ["solutions"];
		state.chartData = [{ label: "chart" }];

		ResetAppState();

		expect(state).toEqual({
			dataFileType: "",
			defaultTime: undefined,
			gapLimit: undefined,
			unprocessedData: [],
			unprocessedInstanceInformationData: [],
			unprocessedSolutionData: [],
			chartData: []
		});
	});

	it("should keep the same state object so imported references stay valid", () => {
		const reference = state;
		ResetAppState();
		expect(state).toBe(reference);
	});
});

describe("Page listeners", () => {
	function CreateTarget(): HTMLElement {
		return new EventTarget() as HTMLElement;
	}

	it("should call a registered listener", () => {
		const target = CreateTarget();
		const handler = jest.fn();
		Listen(target, "click", handler);
		target.dispatchEvent(new Event("click"));
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it("should remove all registered listeners when reset", () => {
		const target = CreateTarget();
		const otherTarget = CreateTarget();
		const handler = jest.fn();
		const otherHandler = jest.fn();
		Listen(target, "click", handler);
		Listen(otherTarget, "click", otherHandler);

		ResetPageListeners();
		target.dispatchEvent(new Event("click"));
		otherTarget.dispatchEvent(new Event("click"));

		expect(handler).not.toHaveBeenCalled();
		expect(otherHandler).not.toHaveBeenCalled();
	});

	it("should keep working for listeners registered after a reset", () => {
		const target = CreateTarget();
		const handler = jest.fn();
		ResetPageListeners();
		Listen(target, "click", handler);
		target.dispatchEvent(new Event("click"));
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it("should ignore elements that do not exist", () => {
		expect(() => Listen(null, "click", jest.fn())).not.toThrow();
	});
});

describe("ApplyStoredConfiguration", () => {
	it("should copy a stored configuration to the state", () => {
		ResetAppState();
		ApplyStoredConfiguration({
			dataSet: ["line"],
			dataFileType: "json",
			defaultTime: 500,
			gapLimit: 0.5
		});

		expect(state).toMatchObject({
			unprocessedData: ["line"],
			dataFileType: "json",
			defaultTime: 500,
			gapLimit: 0.5
		});
		ResetAppState();
	});
});
