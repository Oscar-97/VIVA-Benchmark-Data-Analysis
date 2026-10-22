const demoDataSelector = { value: "Demo_1" };

jest.mock("../Src/Scripts/Elements/Elements", () => ({
	elements: {
		get demoDataSelector(): typeof demoDataSelector {
			return demoDataSelector;
		}
	}
}));

jest.mock("../Src/Scripts/Elements/Modals/ReplaceDataModal", () => ({
	ConfirmReplaceData: jest.fn()
}));

jest.mock("../Src/Scripts/Datasets/DemoData", () => ({
	DEMO_DATA: { dataSet: ["one"] },
	DEMO_DATA_2: { dataSet: ["two"] }
}));

import {
	ActivateDemoMode,
	RequestDemoMode
} from "../Src/Scripts/Actions/DemoMode";
import { Keys } from "../Src/Scripts/Constants/Keys";
import { ConfirmReplaceData } from "../Src/Scripts/Elements/Modals/ReplaceDataModal";

const reload = jest.fn();
let stored: Map<string, string>;

/**
 * Waits for the demo data, which is loaded when it is needed.
 */
async function Settled(): Promise<void> {
	await new Promise((resolve) => setTimeout(resolve, 0));
}

describe("DemoMode", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		demoDataSelector.value = "Demo_1";
		stored = new Map<string, string>();
		Object.defineProperty(globalThis, "localStorage", {
			value: {
				getItem: (key: string): string | null => stored.get(key) ?? null,
				setItem: (key: string, value: string): void => {
					stored.set(key, value);
				}
			},
			configurable: true
		});
		Object.defineProperty(globalThis, "location", {
			value: { reload },
			configurable: true
		});
	});

	describe("ActivateDemoMode", () => {
		it("should store the first demo data set, and load the page again", async () => {
			await ActivateDemoMode("Demo_1");

			expect(stored.get(Keys.DEMO_DATA)).toBe("demo1");
			expect(stored.get(Keys.USER_CONFIGURATION)).toContain("one");
			expect(reload).toHaveBeenCalledTimes(1);
		});

		it("should store the second demo data set", async () => {
			await ActivateDemoMode("Demo_2");

			expect(stored.get(Keys.DEMO_DATA)).toBe("demo2");
			expect(stored.get(Keys.USER_CONFIGURATION)).toContain("two");
		});

		it("should use the selected demo data set by default", async () => {
			demoDataSelector.value = "Demo_2";

			await ActivateDemoMode();

			expect(stored.get(Keys.DEMO_DATA)).toBe("demo2");
		});
	});

	describe("RequestDemoMode", () => {
		it("should start the demo mode at once when nothing is saved", async () => {
			RequestDemoMode("Demo_1");
			await Settled();

			expect(ConfirmReplaceData).not.toHaveBeenCalled();
			expect(stored.get(Keys.DEMO_DATA)).toBe("demo1");
		});

		it("should start the demo mode at once when only demo data is saved", async () => {
			stored.set(Keys.USER_CONFIGURATION, "{}");
			stored.set(Keys.DEMO_DATA, "demo1");

			RequestDemoMode("Demo_2");
			await Settled();

			expect(ConfirmReplaceData).not.toHaveBeenCalled();
			expect(stored.get(Keys.DEMO_DATA)).toBe("demo2");
		});

		it("should ask before the saved data of the user is replaced, and change nothing until it is confirmed", async () => {
			stored.set(Keys.USER_CONFIGURATION, '{"dataSet":["mine"]}');

			RequestDemoMode("Demo_1");
			await Settled();

			expect(ConfirmReplaceData).toHaveBeenCalledTimes(1);
			expect(stored.get(Keys.USER_CONFIGURATION)).toBe('{"dataSet":["mine"]}');
			expect(reload).not.toHaveBeenCalled();

			const confirm = (ConfirmReplaceData as jest.Mock).mock
				.calls[0]?.[0] as () => void;
			confirm();
			await Settled();

			expect(stored.get(Keys.DEMO_DATA)).toBe("demo1");
			expect(reload).toHaveBeenCalledTimes(1);
		});

		it("should use the selected demo data set when none is given", async () => {
			demoDataSelector.value = "Demo_2";

			RequestDemoMode();
			await Settled();

			expect(stored.get(Keys.DEMO_DATA)).toBe("demo2");
		});
	});
});
