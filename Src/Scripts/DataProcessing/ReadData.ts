import { FileInput, ImportDataButton } from "../Elements/Elements";
import { DisplayErrorNotification } from "../Elements/DisplayAlertNotification";

/**
 * User should only be able to upload multiple .trc files, and atleast one of the files needs to be a .txt, .trc or .json file.
 * @returns DataFileType
 */
export function GetDataFileType(): string {
  const Files = FileInput.files;
  const Extensions = [];

  let txtCount = 0;
  let jsonCount = 0;

  for (let i = 0; i < Files.length; i++) {
    const Extension = Files[i].name.split(".").pop();
    if (Extension === "trc") {
      Extensions.push(Extension);
    } else if (Extension === "txt") {
      txtCount++;
      if (txtCount > 1) {
        DisplayErrorNotification("Cannot upload multiple .txt files.");
        throw new Error("Cannot upload multiple .txt files.");
      }
      Extensions.push(Extension);
    } else if (Extension === "json") {
      jsonCount++;
      if (jsonCount > 1) {
        DisplayErrorNotification("Cannot upload multiple .json files.");
        throw new Error("Cannot upload multiple .json files.");
      }
      Extensions.push(Extension);
    }
  }

  if (Extensions.length === 0) {
    DisplayErrorNotification("No .txt, .trc or .json files found.");
    throw new Error("No .txt, .trc or .json files found.");
  }

  return Extensions[0];
}

/**
 * Read the raw data.
 * @param RawData
 * @param RawInstanceInfoData
 * @param RawSoluData
 * @returns
 */
export function ReadData(
  RawData: string[],
  RawInstanceInfoData: string[],
  RawSoluData: string[]
): { RawData: string[]; RawInstanceInfoData: string[]; RawSoluData: string[] } {
  ImportDataButton.disabled = false;

  /**
   * Input multiple files.
   * For instance: trace1.trc, trace2.trc and minlp.solu.
   */
  for (let i = 0; i < FileInput.files.length; i++) {
    const Reader = new FileReader();
    const File = FileInput.files[i];
    const FileName = File.name;
    const FileExtension = FileName.split(".").pop();

    /**
     * Split the file's content into an array of lines and iterate over the lines array and process each line as needed.
     */
    Reader.addEventListener("load", function () {
      if (FileExtension === "json") {
        const JSON_Data = <string>Reader.result;
        localStorage.setItem("UserConfiguration", JSON_Data);
        console.log("Stored uploaded UserConfiguration.");
      } else if (FileExtension === "txt" || FileExtension === "trc") {
        const Lines = (<string>Reader.result)
          .split(/\r?\n/)
          .map((line) => line.trim());
        for (let i = 0; i <= Lines.length - 1; i++) {
          const Line = Lines[i];
          RawData.push(Line);
        }
      } else if (FileExtension === "csv") {
        const Lines = (<string>Reader.result).split("\n");
        for (let i = 0; i <= Lines.length - 1; i++) {
          const Line = Lines[i];
          RawInstanceInfoData.push(Line);
        }
      } else if (FileExtension === "solu") {
        const Lines = (<string>Reader.result).split("\r\n");
        for (let i = 0; i <= Lines.length - 1; i++) {
          const Line = Lines[i];
          RawSoluData.push(Line);
        }
      } else {
        DisplayErrorNotification(
          "Invalid file extension. Please use a .trc or .txt file for results. Use a .csv file for instance data information."
        );
        throw new Error(
          "Invalid file extension. Please use a .trc or .txt file for results. Use a .csv file for instance data information."
        );
      }
    });

    Reader.readAsText(File);
  }

  return { RawData, RawInstanceInfoData, RawSoluData };
}
