import { downloadCSVButton } from "../Elements/Elements";

export function TableDownloadCSV(): void {
	/**
	 * @param DownloadableFile CSV file containing the table data.
	 */
	const table = document.getElementById(
		"dataTableGenerated"
	) as HTMLTableElement;
	const data = Array.from(table.rows).map((row) =>
		Array.from(row.cells)
			.map((cell) => cell.innerText)
			.join(",")
	);
	const csv = data.join("\n");
	const downloadableFile = new Blob([csv], { type: "text/csv" });

	downloadCSVButton.href = window.URL.createObjectURL(downloadableFile);
	downloadCSVButton.download = "benchmark-table.csv";
}
