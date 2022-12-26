export function TableDownloadCSV() {
  /**
   * @param DownloadableFile CSV file containing the table data.
   */
  const DownloadCSVButton = document.getElementById("downloadCSVButton") as HTMLAnchorElement;
  const Table = document.querySelector('#dataTableGenerated') as HTMLTableElement;
  const Data = Array.from(Table.rows)
    .map((row) => Array.from(row.cells)
      .map((cell) => cell.innerText)
      .join(','));
  const csv = Data.join('\n');
  const DownloadableFile = new Blob([csv], { type: 'text/csv' });

  DownloadCSVButton.href = window.URL.createObjectURL(DownloadableFile);
  DownloadCSVButton.download = 'benchmark-table.csv';
  console.log("Clicked download.")
}