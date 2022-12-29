/**
 * Click on the upload data button to start the process.
 */
import { FileInput, ImportDataButton, SelectAllButton, ViewSelectionButton, ViewPlotsButton } from '../Elements/Elements';

export function ImportDataEvents() {

    // Remove existing Solvers and the search bar when uploading a new result file.
    try {
        document.querySelectorAll('.form-check').forEach(solver => { solver.remove(); });
        document.getElementById('tableSearch').remove();
        document.getElementById('dataTableGenerated_wrapper').remove();
        FileInput.value = '';
    }
    catch { }

    // Change the statuses of the buttons after uploading the data.
    SelectAllButton.disabled = false;
    if (document.title == "Report") {
        ViewSelectionButton.disabled = false;
    } else if (document.title == "Plots") {
        ViewPlotsButton.disabled = false;
    }
    ImportDataButton.disabled = true;
}