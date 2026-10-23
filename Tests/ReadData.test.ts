const fileInput: { files: File[] } = { files: [] };
const importDataButton = { disabled: false };
const librarySelector = { disabled: true };

jest.mock("../Src/Scripts/Elements/Elements", () => ({
	elements: {
		get fileInput(): typeof fileInput {
			return fileInput;
		},
		get importDataButton(): typeof importDataButton {
			return importDataButton;
		},
		get librarySelector(): typeof librarySelector {
			return librarySelector;
		}
	}
}));

jest.mock("../Src/Scripts/Elements/Events/DisplayAlertNotification", () => ({
	DisplayAlertNotification: jest.fn(),
	DisplayWarningNotification: jest.fn(),
	DisplayErrorNotification: jest.fn()
}));

import { Keys } from "../Src/Scripts/Constants/Keys";
import { ErrorMessages } from "../Src/Scripts/Constants/Messages";
import { ReadData } from "../Src/Scripts/DataProcessing/ReadData";
import { DisplayErrorNotification } from "../Src/Scripts/Elements/Events/DisplayAlertNotification";

function UseStorage(): Map<string, string> {
	const items = new Map<string, string>();
	Object.defineProperty(globalThis, "localStorage", {
		value: {
			getItem: (key: string): string | null => items.get(key) ?? null,
			setItem: (key: string, value: string): void => {
				items.set(key, value);
			},
			removeItem: (key: string): void => {
				items.delete(key);
			}
		},
		configurable: true
	});
	return items;
}

async function Read(...files: File[]): ReturnType<typeof ReadData> {
	fileInput.files = files;
	return ReadData([], [], []);
}

describe("ReadData", () => {
	let stored: Map<string, string>;

	beforeEach(() => {
		jest.clearAllMocks();
		jest.spyOn(console, "error").mockImplementation(() => {});
		stored = UseStorage();
		importDataButton.disabled = false;
		librarySelector.disabled = true;
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("should collect the lines of a trace file and open the import", async () => {
		const result = await Read(new File([" a \r\nb"], "run.trc"));

		expect(result.UnprocessedData).toEqual(["a", "b"]);
		expect(importDataButton.disabled).toBe(false);
		expect(librarySelector.disabled).toBe(false);
	});

	it("should store a valid configuration file", async () => {
		const content = JSON.stringify({ dataSet: ["x"], dataFileType: "trc" });

		await Read(new File([content], "UserConfiguration.json"));

		expect(stored.get(Keys.USER_CONFIGURATION)).toContain('"dataSet":["x"]');
		expect(DisplayErrorNotification).not.toHaveBeenCalled();
		expect(importDataButton.disabled).toBe(false);
	});

	it("should name a file that is not valid JSON, and keep the import closed", async () => {
		await Read(new File(["{ not json"], "broken.json"));

		expect(DisplayErrorNotification).toHaveBeenCalledWith(
			`broken.json: ${ErrorMessages.INVALID_JSON}`
		);
		expect(stored.has(Keys.USER_CONFIGURATION)).toBe(false);
		expect(importDataButton.disabled).toBe(true);
	});

	it.each([
		"null",
		"[]",
		'{"dataSet": []}',
		'{"dataSet": "x", "dataFileType": "trc"}',
		'{"dataSet": [1, 2], "dataFileType": "trc"}',
		'{"dataSet": ["x"], "dataFileType": 5}'
	])("should reject the JSON %s as a configuration", async (content) => {
		await Read(new File([content], "other.json"));

		expect(DisplayErrorNotification).toHaveBeenCalledWith(
			`other.json: ${ErrorMessages.INVALID_DATA_STRUCTURE}`
		);
		expect(stored.has(Keys.USER_CONFIGURATION)).toBe(false);
		expect(importDataButton.disabled).toBe(true);
	});

	it("should name the file that cannot be read, and keep the import closed", async () => {
		const unreadable = new File(["a"], "gone.trc");
		jest.spyOn(unreadable, "text").mockRejectedValue(new Error("denied"));

		await expect(Read(new File(["b"], "ok.trc"), unreadable)).rejects.toThrow(
			"The file gone.trc could not be read."
		);

		expect(importDataButton.disabled).toBe(true);
		expect(librarySelector.disabled).toBe(false);
	});
});
