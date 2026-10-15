const hint = { textContent: "", hidden: true };
let findElement: jest.Mock;

jest.mock("../Src/Scripts/Elements/Elements", () => ({
	FindElement: (id: string): unknown => findElement(id)
}));

import {
	DescribeTableHint,
	HideTableHint,
	ShowTableHint
} from "../Src/Scripts/DataTable/TableHint";

describe("DescribeTableHint", () => {
	it("should say which columns are hidden, and where to show them", () => {
		const text = DescribeTableHint(15, 40);

		expect(text).toContain("15 of 40 columns are shown.");
		expect(text).toContain("Settings, then Column Visibility");
	});

	it("should not mention hidden columns when all are shown", () => {
		const text = DescribeTableHint(40, 40);

		expect(text).toContain("All 40 columns are shown.");
		expect(text).not.toContain("Column Visibility");
	});

	it("should explain how rows are selected", () => {
		expect(DescribeTableHint(1, 2)).toContain(
			"Click a row to select it, hold Ctrl or Shift to select several"
		);
	});
});

describe("ShowTableHint and HideTableHint", () => {
	beforeEach(() => {
		hint.textContent = "";
		hint.hidden = true;
		findElement = jest.fn().mockReturnValue(hint);
	});

	it("should show the hint above the table", () => {
		ShowTableHint(15, 40);

		expect(hint.hidden).toBe(false);
		expect(hint.textContent).toContain("15 of 40 columns are shown.");
	});

	it("should hide and empty the hint", () => {
		ShowTableHint(15, 40);

		HideTableHint();

		expect(hint.hidden).toBe(true);
		expect(hint.textContent).toBe("");
	});

	it("should do nothing on a page without the hint", () => {
		findElement.mockReturnValue(null);

		expect(() => {
			ShowTableHint(1, 2);
			HideTableHint();
		}).not.toThrow();
	});
});
