import { DescribeComparisonSettings } from "../Src/Scripts/Pages/ComparisonSettings";

describe("DescribeComparisonSettings", () => {
	it("names the status, the gap with its limit, and the time limit", () => {
		expect(
			DescribeComparisonSettings({
				terminationStatus: "Normal Completion",
				gapType: "Primal Gap",
				gapLimit: 0.01,
				timeLimit: 1000
			})
		).toMatch(
			/^Normal Completion, Primal Gap <= 0[.,]01 %, time limit 1\D?000 s\.$/
		);
	});

	it("writes the numbers as given", () => {
		const text = DescribeComparisonSettings({
			terminationStatus: "Resource Interrupt",
			gapType: "Dual Gap",
			gapLimit: 5,
			timeLimit: 30
		});

		expect(text).toBe("Resource Interrupt, Dual Gap <= 5 %, time limit 30 s.");
	});
});
