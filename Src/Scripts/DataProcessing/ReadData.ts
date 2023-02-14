import {
  FileInput,
  ImportDataButton,
  InstanceDataInput,
  ImportInstanceDataButton,
} from "../Elements/Elements";
import { DisplayErrorNotification } from "../Elements/DisplayAlertNotification";

export function ReadData(RawData: string[]): string[] {
  RawData = [];
  ImportDataButton.disabled = false;

  for (let i = 0; i < FileInput.files.length; i++) {
    const Reader = new FileReader();
    const File = FileInput.files[i];
    const FileName = File.name;
    const FileExtension = FileName.split(".").pop();

    Reader.addEventListener("load", function () {
      if (
        FileExtension === "txt" ||
        FileExtension === "trc" ||
        FileExtension === "csv"
      ) {
        // Split the file's content into an array of lines.
        const lines = (<string>Reader.result).split("\r\n");
        // Iterate over the lines array and process each line as needed.
        for (let i = 0; i <= lines.length - 1; i++) {
          const line = lines[i];
          RawData.push(line);
        }
      } else {
        console.log(
          "Invalid file extension. Please use a .trc or .txt file for results. Use a .csv file for instance data information."
        );
        DisplayErrorNotification(
          "Invalid file extension. Please use a .trc or .txt file for results. Use a .csv file for instance data information."
        );
      }
    });

    // Read the file as text.
    Reader.readAsText(File);
  }

  return RawData;
}

export function GetFileType(): string {
  return FileInput.files[0].name.split(".").pop();
}

export function ReadInstanceInformationData(
  RawInstanceInfoData: string[]
): string[] {
  RawInstanceInfoData = [];
  ImportInstanceDataButton.disabled = false;

  const Reader = new FileReader();
  const File = InstanceDataInput.files[0];

  Reader.addEventListener("load", function () {
    // Split the file's content into an array of lines.
    // Line ending \n for .csv file.
    const lines = (<string>Reader.result).split("\n");
    // Iterate over the lines array and process each line as needed.
    for (let i = 0; i <= lines.length - 1; i++) {
      const line = lines[i];
      RawInstanceInfoData.push(line);
    }
  });

  // Read the file as text.
  Reader.readAsText(File);
  return RawInstanceInfoData;
}
