import { ApplyPalette, PaletteColor } from "../Src/Scripts/Chart/Palette";

describe("PaletteColor", () => {
	it("should give the colors in a fixed order", () => {
		expect(PaletteColor(0, "light")).toBe("#2a78d6");
		expect(PaletteColor(1, "light")).toBe("#eb6834");
		expect(PaletteColor(7, "light")).toBe("#e34948");
	});

	it("should give the same hues in the dark theme, stepped for the dark surface", () => {
		expect(PaletteColor(0, "dark")).toBe("#3987e5");
		expect(PaletteColor(7, "dark")).toBe("#e66767");
	});

	it("should start again after the eighth color", () => {
		expect(PaletteColor(8, "light")).toBe(PaletteColor(0, "light"));
		expect(PaletteColor(17, "dark")).toBe(PaletteColor(1, "dark"));
	});

	it("should use the light colors for a theme that it does not know", () => {
		expect(PaletteColor(2, "other")).toBe(PaletteColor(2, "light"));
	});

	it("should give every color of a theme once", () => {
		for (const theme of ["light", "dark"]) {
			const colors = Array.from({ length: 8 }, (_, index) =>
				PaletteColor(index, theme)
			);
			expect(new Set(colors).size).toBe(8);
		}
	});
});

interface Plain {
	borderColor?: unknown;
	backgroundColor?: unknown;
	borderDash?: unknown;
	pointStyle?: unknown;
}

describe("ApplyPalette", () => {
	it("should color the line of a data set, and its area with some transparency", () => {
		const colored = ApplyPalette({ label: "scip" }, 1, "line", "light");

		expect(colored).toEqual({
			label: "scip",
			borderColor: "#eb6834",
			backgroundColor: "#eb683480",
			pointStyle: "triangle",
			borderDash: [8, 4]
		});
	});

	it("should fill the bars with the color", () => {
		const colored = ApplyPalette({ label: "scip" }, 0, "bar", "dark");

		expect(colored).toEqual({
			label: "scip",
			borderColor: "#3987e5",
			backgroundColor: "#3987e5"
		});
	});

	it("should leave a data set with a color of its own as it is", () => {
		const own = { label: "Failed", backgroundColor: "#f5a2a3" };
		const onlyBorder = { label: "x", borderColor: "#123456" };

		expect(ApplyPalette(own, 0, "bar", "light")).toBe(own);
		expect(ApplyPalette(onlyBorder, 0, "line", "light")).toBe(onlyBorder);
	});

	it("should not change the data set that it is given", () => {
		const dataset = { label: "shot" };

		ApplyPalette(dataset, 3, "line", "light");

		expect(dataset).toEqual({ label: "shot" });
	});

	it("should dash the lines by their place: solid, long dashes, short dashes", () => {
		expect(
			ApplyPalette<Plain>({}, 0, "line", "light").borderDash
		).toBeUndefined();
		expect(ApplyPalette<Plain>({}, 1, "line", "light").borderDash).toEqual([
			8, 4
		]);
		expect(ApplyPalette<Plain>({}, 2, "line", "light").borderDash).toEqual([
			2, 3
		]);
		expect(
			ApplyPalette<Plain>({}, 3, "radar", "light").borderDash
		).toBeUndefined();
	});

	it("should give the points a shape by the place of the data set", () => {
		const styles = Array.from(
			{ length: 5 },
			(_, index) => ApplyPalette<Plain>({}, index, "line", "light").pointStyle
		);

		expect(styles).toEqual(["circle", "triangle", "rect", "rectRot", "star"]);
		expect(ApplyPalette<Plain>({}, 5, "line", "light").pointStyle).toBe(
			"circle"
		);
		expect(ApplyPalette<Plain>({}, 2, "bubble", "dark").pointStyle).toBe(
			"rect"
		);
		expect(ApplyPalette<Plain>({}, 1, "radar", "dark").pointStyle).toBe(
			"triangle"
		);
	});

	it("should tell the data sets apart without the color for the first 120 of them", () => {
		const looks = new Set<string>();
		for (let index = 0; index < 120; index++) {
			const set = ApplyPalette<Plain>({}, index, "line", "light");
			looks.add(
				[set.borderColor, set.pointStyle, JSON.stringify(set.borderDash)].join(
					"|"
				)
			);
		}

		expect(looks.size).toBe(120);
	});

	it("should give neither a dash nor a point style to bars", () => {
		const bar = ApplyPalette<Plain>({}, 8, "bar", "light");

		expect(bar.borderDash).toBeUndefined();
		expect(bar.pointStyle).toBeUndefined();
	});

	it("should give a bubble a shape, but no dash", () => {
		const bubble = ApplyPalette<Plain>({}, 8, "bubble", "light");

		expect(bubble.borderDash).toBeUndefined();
		expect(bubble.pointStyle).toBeDefined();
	});
});
