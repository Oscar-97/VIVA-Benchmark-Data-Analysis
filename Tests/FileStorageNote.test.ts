const note = { hidden: true };

jest.mock("../Src/Scripts/Elements/Elements", () => ({
	elements: {
		get fileStorageNote(): object {
			return note;
		}
	}
}));

import {
	IsStorageSeparatedPerFile,
	ShowFileStorageNote
} from "../Src/Scripts/Elements/FileStorageNote";

const FIREFOX =
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0";
const CHROME =
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";

describe("IsStorageSeparatedPerFile", () => {
	it("is true for a file that is opened in Firefox", () => {
		expect(IsStorageSeparatedPerFile("file:", FIREFOX)).toBe(true);
	});

	it("is false for a file in a browser that gives the files one origin", () => {
		expect(IsStorageSeparatedPerFile("file:", CHROME)).toBe(false);
	});

	it("is false for a page from a web server, in any browser", () => {
		expect(IsStorageSeparatedPerFile("https:", FIREFOX)).toBe(false);
		expect(IsStorageSeparatedPerFile("http:", CHROME)).toBe(false);
	});
});

describe("ShowFileStorageNote", () => {
	const original = {
		window: globalThis.window,
		navigator: globalThis.navigator
	};

	function UsePage(protocol: string, userAgent: string): void {
		Object.defineProperty(globalThis, "window", {
			value: { location: { protocol } },
			configurable: true
		});
		Object.defineProperty(globalThis, "navigator", {
			value: { userAgent },
			configurable: true
		});
	}

	afterAll(() => {
		Object.defineProperty(globalThis, "window", {
			value: original.window,
			configurable: true
		});
		Object.defineProperty(globalThis, "navigator", {
			value: original.navigator,
			configurable: true
		});
	});

	it("shows the note when the pages of a file do not share their data", () => {
		UsePage("file:", FIREFOX);
		ShowFileStorageNote();

		expect(note.hidden).toBe(false);
	});

	it("hides the note otherwise", () => {
		UsePage("https:", FIREFOX);
		ShowFileStorageNote();

		expect(note.hidden).toBe(true);
	});
});
