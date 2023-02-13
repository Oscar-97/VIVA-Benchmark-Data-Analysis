import { FileInput, ImportDataButton, InstanceDataInput, ImportInstanceDataButton } from "../Elements/Elements";
import { DisplayErrorNotification } from "../Elements/DisplayAlertNotification";

export function ReadData(RawData: string[]) {
  RawData = [];
  ImportDataButton.disabled = false;

  for (let i = 0; i < FileInput.files.length; i++) {
    let Reader = new FileReader();
    let File = FileInput.files[i];
    let FileName = File.name;
    let FileExtension = FileName.split('.').pop();

    Reader.addEventListener('load', function () {
      if (FileExtension === "txt" || FileExtension === "trc" || FileExtension === "csv") {
        // Split the file's content into an array of lines.
        let lines = (<string>Reader.result).split('\r\n');
        // Iterate over the lines array and process each line as needed.
        for (let i = 0; i <= lines.length - 1; i++) {
          let line = lines[i];
          RawData.push(line);
        }
      } else {
        console.log("Invalid file extension. Please use a .trc or .txt file for results. Use a .csv file for instance data information.");
        DisplayErrorNotification("Invalid file extension. Please use a .trc or .txt file for results. Use a .csv file for instance data information.");
      }
    });

    // Read the file as text.
    Reader.readAsText(File);
  }

  return RawData;
}

export function GetFileType() {
  return FileInput.files[0].name.split('.').pop();
}

export function ReadInstanceInformationData(RawInstanceInfoData: string[]) {
  RawInstanceInfoData = [];
  ImportInstanceDataButton.disabled = false;

  let Reader = new FileReader();
  let File = InstanceDataInput.files[0];

  Reader.addEventListener('load', function () {
    // Split the file's content into an array of lines.
    // Line ending \n for .csv file.
    let lines = (<string>Reader.result).split('\n');
    // Iterate over the lines array and process each line as needed.
    for (let i = 0; i <= lines.length - 1; i++) {
      let line = lines[i];
      RawInstanceInfoData.push(line);
    }
  });

  // Read the file as text.
  Reader.readAsText(File);
  return RawInstanceInfoData;
}