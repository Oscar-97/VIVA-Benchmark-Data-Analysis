import { describe, expect, it, jest } from "@jest/globals";
import {
	GetThemePreference,
	ParseThemePreference,
	ResolveTheme
} from "../Src/Scripts/Theme";
import { AdaptColorToTheme } from "../Src/Scripts/Chart/CreateChart";

jest.mock("chart.js", () => ({
	Chart: { register: jest.fn(), defaults: {} }
}));
jest.mock("chartjs-plugin-zoom", () => ({}));
jest.mock("chartjs-plugin-annotation", () => ({}));

function SetGlobal(name: string, value: unknown): void {
	Object.defineProperty(globalThis, name, { value, configurable: true });
}

describe("theme preference", () => {
	it("accepts light and dark and treats anything else as system", () => {
		expect(ParseThemePreference("light")).toBe("light");
		expect(ParseThemePreference("dark")).toBe("dark");
		expect(ParseThemePreference("blue")).toBe("system");
		expect(ParseThemePreference(null)).toBe("system");
	});

	it("follows the system only when nothing is chosen", () => {
		expect(ResolveTheme("system", true)).toBe("dark");
		expect(ResolveTheme("system", false)).toBe("light");
		expect(ResolveTheme("light", true)).toBe("light");
		expect(ResolveTheme("dark", false)).toBe("dark");
	});

	it("reads the stored value and survives a blocked storage", () => {
		SetGlobal("localStorage", { getItem: () => "dark" });
		expect(GetThemePreference()).toBe("dark");
		SetGlobal("localStorage", {
			getItem: () => {
				throw new Error("blocked");
			}
		});
		expect(GetThemePreference()).toBe("system");
	});
});

describe("chart colors", () => {
	it("lightens very dark colors on the dark theme only", () => {
		expect(AdaptColorToTheme("#0a0a0a", "light")).toBe("#0a0a0a");
		expect(AdaptColorToTheme("#0a0a0a", "dark")).not.toBe("#0a0a0a");
		expect(AdaptColorToTheme("#d5fa87", "dark")).toBe("#d5fa87");
		expect(AdaptColorToTheme("rgb(1,2,3)", "dark")).toBe("rgb(1,2,3)");
	});

	it("keeps the alpha of the color", () => {
		expect(String(AdaptColorToTheme("#000000AA", "dark")).endsWith("AA")).toBe(
			true
		);
	});
});
