const fakeTable = {
	rows: jest.fn(),
	columns: jest.fn()
};

jest.mock("datatables.net-bs5", () => ({
	__esModule: true,
	default: jest.fn(() => fakeTable)
}));

jest.mock("jquery", () => {
	const jquery = (target: unknown): unknown => {
		return { text: (): string => (target as { text: string }).text };
	};
	return { __esModule: true, default: jquery };
});

import {
	GetFilteredRows,
	GetSelectedRows
} from "../Src/Scripts/DataTable/GetDataFromTable";

interface FakeCell {
	textContent: string | null;
}

interface FakeRow {
	querySelectorAll: (selector: string) => FakeCell[];
}

function Cells(...texts: (string | null)[]): FakeCell[] {
	return texts.map((textContent) => ({ textContent }));
}

function Row(...texts: (string | null)[]): FakeRow {
	return { querySelectorAll: () => Cells(...texts) };
}

function StubDocument(headers: FakeCell[], rows: FakeRow[]): void {
	Object.defineProperty(globalThis, "document", {
		value: {
			querySelectorAll: (selector: string): (FakeCell | FakeRow)[] => {
				if (selector === ".thead-dark th") return headers;
				if (selector === ".row-selected-problems") return rows;
				return [];
			}
		},
		configurable: true,
		writable: true
	});
}

describe("GetSelectedRows", () => {
	it("should key the cells of each selected row by the table headers", () => {
		StubDocument(Cells("Problem", "SolverName"), [
			Row("alan", "SCIP"),
			Row("ex1223", "BARON")
		]);

		expect(GetSelectedRows()).toEqual([
			{ Problem: "alan", SolverName: "SCIP" },
			{ Problem: "ex1223", SolverName: "BARON" }
		]);
	});

	it("should return no rows when none is selected", () => {
		StubDocument(Cells("Problem"), []);

		expect(GetSelectedRows()).toEqual([]);
	});

	it("should use an empty key for a cell without a header, and an empty text for a cell without text", () => {
		StubDocument(Cells("Problem"), [Row("alan", "extra"), Row(null)]);

		expect(GetSelectedRows()).toEqual([
			{ Problem: "alan", "": "extra" },
			{ Problem: "" }
		]);
	});
});

describe("GetFilteredRows", () => {
	beforeEach(() => {
		fakeTable.rows.mockReset();
		fakeTable.columns.mockReset();
	});

	function StubTable(headers: string[], data: unknown[][]): void {
		fakeTable.rows.mockReturnValue({
			data: (): { toArray: () => unknown[][] } => ({
				toArray: (): unknown[][] => data
			})
		});
		fakeTable.columns.mockReturnValue({
			header: (): { toArray: () => { text: string }[] } => ({
				toArray: (): { text: string }[] => headers.map((text) => ({ text }))
			})
		});
	}

	it("should return the rows that match the search, keyed by the internal names of the columns", () => {
		StubTable(
			["Problem", "SolverName", "ProblemPrimalBound"],
			[
				["alan", "SCIP", 2.925],
				["ex1223", "BARON", 4.5]
			]
		);

		expect(GetFilteredRows()).toEqual([
			{ InputFileName: "alan", SolverName: "SCIP", PrimalBoundProblem: 2.925 },
			{
				InputFileName: "ex1223",
				SolverName: "BARON",
				PrimalBoundProblem: 4.5
			}
		]);
		expect(fakeTable.rows).toHaveBeenCalledWith({ search: "applied" });
	});

	it("should keep the name of a column that has no internal name", () => {
		StubTable(["Custom"], [["x"]]);

		expect(GetFilteredRows()).toEqual([{ Custom: "x" }]);
	});

	it("should return no rows for an empty table", () => {
		StubTable(["Problem"], []);

		expect(GetFilteredRows()).toEqual([]);
	});
});
