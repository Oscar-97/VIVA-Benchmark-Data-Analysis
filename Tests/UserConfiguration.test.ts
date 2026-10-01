jest.mock("../Src/Scripts/Elements/Elements", () => ({
	elements: {
		downloadConfigurationButton: {},
		downloadCustomConfigurationButton: {}
	}
}));

jest.mock("../Src/Scripts/Elements/Events/DisplayAlertNotification", () => ({
	DisplayAlertNotification: jest.fn(),
	DisplayWarningNotification: jest.fn(),
	DisplayErrorNotification: jest.fn()
}));

import { Keys } from "../Src/Scripts/Constants/Keys";
import { UserConfigurationMessages } from "../Src/Scripts/Constants/Messages";
import { Values } from "../Src/Scripts/Constants/Values";
import {
	DisplayErrorNotification,
	DisplayWarningNotification
} from "../Src/Scripts/Elements/Events/DisplayAlertNotification";
import { GetUserConfiguration } from "../Src/Scripts/UserConfiguration/UserConfiguration";

function CreateStorage(): Storage {
	const items = new Map<string, string>();
	return {
		getItem: (key: string): string | null => {
			return items.get(key) ?? null;
		},
		setItem: (key: string, value: string): void => {
			items.set(key, value);
		},
		removeItem: (key: string): void => {
			items.delete(key);
		},
		clear: (): void => items.clear(),
		key: (): string | null => null,
		length: 0
	};
}

describe("GetUserConfiguration", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.spyOn(console, "info").mockImplementation(() => {});
		Object.defineProperty(globalThis, "localStorage", {
			value: CreateStorage(),
			configurable: true
		});
		Object.defineProperty(globalThis, "sessionStorage", {
			value: CreateStorage(),
			configurable: true
		});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	function Store(config: object): void {
		localStorage.setItem(Keys.USER_CONFIGURATION, JSON.stringify(config));
	}

	it("should return the stored configuration", () => {
		Store({
			dataSet: ["line 1", "line 2"],
			dataFileType: "json",
			defaultTime: 500,
			gapLimit: 0.5
		});

		expect(GetUserConfiguration()).toEqual({
			dataSet: ["line 1", "line 2"],
			dataFileType: "json",
			defaultTime: 500,
			gapLimit: 0.5
		});
	});

	it("should fill in the default time and gap limit", () => {
		Store({ dataSet: ["line"], dataFileType: "json" });

		expect(GetUserConfiguration()).toMatchObject({
			defaultTime: Values.DEFAULT_TIME,
			gapLimit: Values.DEFAULT_GAP_LIMIT
		});
	});

	it("should convert data that is not a string to a string", () => {
		Store({ dataSet: ["line", { a: 1 }], dataFileType: "json" });

		expect(GetUserConfiguration()?.dataSet).toEqual(["line", '{"a":1}']);
	});

	it("should return undefined and warn once if nothing is stored", () => {
		expect(GetUserConfiguration()).toBeUndefined();
		expect(DisplayWarningNotification).toHaveBeenCalledWith(
			UserConfigurationMessages.NO_STORED_CONFIG
		);

		expect(GetUserConfiguration()).toBeUndefined();
		expect(DisplayWarningNotification).toHaveBeenCalledTimes(1);
	});

	it("should return undefined and report an error if the stored data is not valid", () => {
		localStorage.setItem(Keys.USER_CONFIGURATION, "{not json");

		expect(GetUserConfiguration()).toBeUndefined();
		expect(DisplayErrorNotification).toHaveBeenCalledTimes(1);
	});

	it("should return undefined if the stored data set is empty", () => {
		Store({ dataSet: [], dataFileType: "json" });
		expect(GetUserConfiguration()).toBeUndefined();
	});

	it("should return undefined if the stored configuration has no data set", () => {
		Store({ dataFileType: "json" });
		expect(GetUserConfiguration()).toBeUndefined();

		localStorage.setItem(Keys.USER_CONFIGURATION, "null");
		expect(GetUserConfiguration()).toBeUndefined();
	});
});
