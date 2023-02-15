/**
 * Click on the upload data button to start the process.
 */
import {
  FileInput,
  InstanceDataInput,
  ImportDataButton,
  SelectAllButton,
  FilterSelectionButton,
  ViewAllResultsButton,
  ViewPlotsButton,
} from "../Elements/Elements";
import { DisplayAlertNotification } from "../Elements/DisplayAlertNotification";

export function ImportDataEvents(Message: string, FileExtensionType: string): void {
  /**
   * Remove existing Solvers and datatable after uploading a new result file.
   * Set the file upload value to empty.
   */
  try {
    console.clear();
    document.querySelectorAll(".form-check").forEach((solver) => {
      solver.remove();
    });
    document.getElementById("dataTableGenerated_wrapper").remove();
    document.getElementById("dataTableGenerated").remove();
    FileInput.value = "";
  } catch (err) {
    console.log(err);
  }

  /**
   * Change the statuses of the buttons after uploading the data.
   */

  if (document.title == "Report") {
    ViewAllResultsButton.disabled = false;
  } else if (document.title == "Plots") {
    ViewPlotsButton.disabled = false;
  }

  if (FileExtensionType === "txt") {
    SelectAllButton.disabled = false;
    FilterSelectionButton.disabled = true;
    ImportDataButton.disabled = true;
    InstanceDataInput.disabled = false;
  } else if (FileExtensionType === "trc" || FileExtensionType === "json") {
    SelectAllButton.disabled = true;
    FilterSelectionButton.disabled = true;
    ImportDataButton.disabled = true;
    InstanceDataInput.disabled = false;
  }

  // Display alert with message.
  DisplayAlertNotification(Message);
}
