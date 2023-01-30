/**
 * Click on the upload data button to start the process.
 */
import { AlertNotification, FileInput, ImportDataButton, SelectAllButton, ViewAllResultsButton, ViewPlotsButton } from '../Elements/Elements';

export function ImportDataEvents(message: string) {

    /**
     * Remove existing Solvers and datatable after uploading a new result file.
     * Set the file upload value to empty.
     */
    try {
        console.clear();
        document.querySelectorAll('.form-check').forEach(solver => { solver.remove(); });
        document.getElementById('dataTableGenerated_wrapper').remove();
        document.getElementById('dataTableGenerated').remove();
        FileInput.value = '';
    }
    catch(err) { 
        console.log(err);
    }

    /**
     * Change the statuses of the buttons after uploading the data.
     */
    SelectAllButton.disabled = false;
    if (document.title == "Report") {
        ViewAllResultsButton.disabled = false;
    } else if (document.title == "Plots") {
        ViewPlotsButton.disabled = false;
    }
    ImportDataButton.disabled = true;

    /**
     * Show a simple success alert for 3 seconds.
     */
    AlertNotification.style.display = "block";
    AlertNotification.innerText = message;

    setTimeout(() => {
    AlertNotification.style.display = "none";
    }, 3000);

}