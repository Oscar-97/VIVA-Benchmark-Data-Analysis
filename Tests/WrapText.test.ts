import { WrapText } from "../Src/Scripts/Chart/WrapText";

describe("WrapText", () => {
	it("keeps a text that fits as one line", () => {
		expect(WrapText("A short text.", 40)).toEqual(["A short text."]);
	});

	it("breaks a long text at the spaces", () => {
		expect(WrapText("one two three four five", 10)).toEqual([
			"one two",
			"three four",
			"five"
		]);
	});

	it("keeps a word that is longer than a line whole", () => {
		expect(WrapText("a unbelievably b", 5)).toEqual(["a", "unbelievably", "b"]);
	});

	it("does not keep extra spaces", () => {
		expect(WrapText("  one   two  ", 40)).toEqual(["one two"]);
	});

	it("gives the text for an empty one", () => {
		expect(WrapText("", 10)).toEqual([""]);
	});
});
