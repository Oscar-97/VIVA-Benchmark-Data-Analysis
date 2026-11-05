import { Keys } from "../Src/Scripts/Constants/Keys";
import {
	ClearSessionData,
	GetSessionData,
	StoreSessionData
} from "../Src/Scripts/UserConfiguration/SessionData";

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
			items.delete(key);
		},
		clear: (): void => items.clear(),
		key: (): string | null => null,
		length: 0
	};
}

function UseStorage(storage: Storage): void {
	Object.defineProperty(globalThis, "sessionStorage", {
		value: storage,
		configurable: true
	});
}

beforeEach(() => {
	UseStorage(CreateStorage());
	jest.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe("StoreSessionData", () => {
	it("keeps the data with its label, and gives it back with the defaults filled in", () => {
		expect(StoreSessionData(["* a,b", "1,2"], "1 solver", 500)).toBe(true);

		expect(GetSessionData()).toEqual({
			dataSet: ["* a,b", "1,2"],
			dataFileType: "json",
			defaultTime: 500,
			gapLimit: 0.01,
			label: "1 solver"
		});
	});

	it("reports that the data was not kept when the storage is full", () => {
		UseStorage(CreateStorage({ name: "QuotaExceededError" }));

		expect(StoreSessionData(["a"], "label")).toBe(false);
		expect(GetSessionData()).toBeUndefined();
	});
});

describe("GetSessionData", () => {
	it("has nothing when nothing was kept", () => {
		expect(GetSessionData()).toBeUndefined();
	});

	it("ignores data that is not valid", () => {
		sessionStorage.setItem(Keys.SESSION_DATA, "not json");
		expect(GetSessionData()).toBeUndefined();

		sessionStorage.setItem(Keys.SESSION_DATA, '{"dataSet":[]}');
		expect(GetSessionData()).toBeUndefined();
	});

	it("uses an empty label when the data has none", () => {
		sessionStorage.setItem(
			Keys.SESSION_DATA,
			'{"dataSet":["a"],"dataFileType":"json"}'
		);
		expect(GetSessionData()?.label).toBe("");
	});
});

describe("ClearSessionData", () => {
	it("removes the data", () => {
		StoreSessionData(["a"], "label");
		ClearSessionData();
		expect(GetSessionData()).toBeUndefined();
	});
});
