const downloadButton = { href: "", download: "" };
const customDownloadButton = { href: "", download: "" };

jest.mock("../Src/Scripts/Elements/Elements", () => ({
	elements: {
		get downloadConfigurationButton(): object {
			return downloadButton;
		},
		get downloadCustomConfigurationButton(): object {
			return customDownloadButton;
		}
	}
}));

jest.mock("../Src/Scripts/Elements/Events/DisplayAlertNotification", () => ({
	DisplayAlertNotification: jest.fn(),
	DisplayWarningNotification: jest.fn(),
	DisplayErrorNotification: jest.fn()
}));

import { Keys } from "../Src/Scripts/Constants/Keys";
import { UserConfigurationMessages } from "../Src/Scripts/Constants/Messages";
import {
	DisplayAlertNotification,
	DisplayErrorNotification,
	DisplayWarningNotification
} from "../Src/Scripts/Elements/Events/DisplayAlertNotification";
import {
	CreateUserConfiguration,
	DeleteUserConfiguration,
	DownloadCustomizedUserConfiguration,
	DownloadUserConfiguration,
	userData
} from "../Src/Scripts/UserConfiguration/UserConfiguration";

function CreateStorage(failWith?: { name: string }): Storage {
	const items = new Map<string, string>();
	return {
		getItem: (key: string): string | null => items.get(key) ?? null,
		setItem: (key: string, value: string): void => {
			if (failWith) {
				throw failWith;
			}
			items.set(key, value);
		},
		removeItem: (key: string): void => {
			if (failWith) {
				throw failWith;
			}
			items.delete(key);
		},
		clear: (): void => items.clear(),
		key: (): string | null => null,
		length: 0
	};
}

function UseStorage(storage: Storage): void {
	Object.defineProperty(globalThis, "localStorage", {
		value: storage,
		configurable: true
	});
}

const createObjectURL = jest.fn((): string => "blob:test");

beforeEach(() => {
	jest.clearAllMocks();
	downloadButton.href = "";
	downloadButton.download = "";
	customDownloadButton.href = "";
	customDownloadButton.download = "";
	UseStorage(CreateStorage());
	Object.defineProperty(globalThis, "window", {
		value: { URL: { createObjectURL } },
		configurable: true
	});
});

describe("CreateUserConfiguration", () => {
	it("stores the configuration and tells the user", () => {
		CreateUserConfiguration(["a", "b"], "trc", 1500, 0.02);
		expect(
			JSON.parse(localStorage.getItem(Keys.USER_CONFIGURATION) ?? "")
		).toEqual({
			dataSet: ["a", "b"],
			dataFileType: "trc",
			defaultTime: 1500,
			gapLimit: 0.02
		});
		expect(DisplayAlertNotification).toHaveBeenCalledWith(
			UserConfigurationMessages.STORE_SUCCESS
		);
	});

	it("leaves out the default time and the gap limit when they are not given", () => {
		CreateUserConfiguration(["a"], "trc");
		const stored = JSON.parse(
			localStorage.getItem(Keys.USER_CONFIGURATION) ?? ""
		);
		expect(stored).toEqual({ dataSet: ["a"], dataFileType: "trc" });
	});

	it.each([
		["QuotaExceededError", UserConfigurationMessages.QUOTA_EXCEEDED],
		["SecurityError", UserConfigurationMessages.SECURITY_ERROR],
		["InvalidAccessError", UserConfigurationMessages.INVALID_ACCESS]
	])("reports a %s of the storage", (name, message) => {
		UseStorage(CreateStorage({ name }));
		CreateUserConfiguration(["a"], "trc");
		expect(DisplayErrorNotification).toHaveBeenCalledWith(message);
	});

	it("reports any other error of the storage with its text", () => {
		UseStorage(CreateStorage({ name: "Strange" }));
		CreateUserConfiguration(["a"], "trc");
		expect(DisplayErrorNotification).toHaveBeenCalledWith(
			expect.stringContaining("Error occured")
		);
	});
});

describe("DeleteUserConfiguration", () => {
	it("removes the configuration and the demo data", () => {
		localStorage.setItem(Keys.USER_CONFIGURATION, "{}");
		localStorage.setItem(Keys.DEMO_DATA, "{}");
		DeleteUserConfiguration();
		expect(localStorage.getItem(Keys.USER_CONFIGURATION)).toBeNull();
		expect(localStorage.getItem(Keys.DEMO_DATA)).toBeNull();
		expect(DisplayWarningNotification).toHaveBeenCalledWith(
			UserConfigurationMessages.DELETED_CONFIG
		);
	});

	it("reports an error of the storage", () => {
		UseStorage(CreateStorage({ name: "SecurityError" }));
		DeleteUserConfiguration();
		expect(DisplayErrorNotification).toHaveBeenCalledWith(
			UserConfigurationMessages.SECURITY_ERROR
		);
	});
});

describe("DownloadUserConfiguration", () => {
	it("points the download button at the stored configuration", () => {
		localStorage.setItem(
			Keys.USER_CONFIGURATION,
			JSON.stringify({ dataSet: ["a"], dataFileType: "trc" })
		);
		DownloadUserConfiguration();
		expect(downloadButton.href).toBe("blob:test");
		expect(downloadButton.download).toBe("UserConfiguration.json");
		expect(DisplayErrorNotification).not.toHaveBeenCalled();
	});

	it("reports that there is no stored configuration", () => {
		DownloadUserConfiguration();
		expect(downloadButton.href).toBe("");
		expect(DisplayErrorNotification).toHaveBeenCalledWith(
			UserConfigurationMessages.NO_STORED_CONFIG
		);
	});
});

describe("DownloadCustomizedUserConfiguration", () => {
	it("downloads the given data as a JSON configuration", () => {
		DownloadCustomizedUserConfiguration(["x", "y"], 900, 0.5);
		expect(customDownloadButton.href).toBe("blob:test");
		expect(customDownloadButton.download).toBe("UserConfiguration.json");
		expect(userData).toMatchObject({
			dataSet: ["x", "y"],
			dataFileType: "json",
			defaultTime: 900,
			gapLimit: 0.5
		});
	});
});
