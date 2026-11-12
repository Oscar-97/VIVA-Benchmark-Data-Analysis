import { FormatNumber, GetNumberSeparators } from "../Src/Scripts/Locale";

describe("FormatNumber", () => {
	it("uses the decimal point and the comma of English", () => {
		expect(FormatNumber(0.01, "en-US")).toBe("0.01");
		expect(FormatNumber(6635, "en-US")).toBe("6,635");
	});

	it("uses the decimal comma of Swedish", () => {
		expect(FormatNumber(0.01, "sv-SE")).toBe("0,01");
	});

	it("keeps all the digits of a small number", () => {
		expect(FormatNumber(0.0000123, "en-US")).toBe("0.0000123");
	});
});

describe("GetNumberSeparators", () => {
	it("gives the separators of English", () => {
		expect(GetNumberSeparators("en-US")).toEqual({
			decimal: ".",
			thousands: ","
		});
	});

	it("gives the separators of German", () => {
		expect(GetNumberSeparators("de-DE")).toEqual({
			decimal: ",",
			thousands: "."
		});
	});

	it("gives a decimal comma and a space for Swedish", () => {
		const { decimal, thousands } = GetNumberSeparators("sv-SE");
		expect(decimal).toBe(",");
		expect(thousands.trim()).toBe("");
	});
});
