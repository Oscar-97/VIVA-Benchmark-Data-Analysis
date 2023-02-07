import { FileInput, ImportDataButton } from "../Elements/Elements";
import { DisplayErrorNotification } from "../Elements/DisplayAlertNotification";

export function ReadData(RawData: any[]) {
    ImportDataButton.disabled = false;

    for (let i = 0; i < FileInput.files.length; i++) {
      let Reader = new FileReader();
      let File = FileInput.files[i];
      let FileName = File.name;
      let FileExtension = FileName.split('.').pop();
  
      Reader.addEventListener('load', function () {
        if (FileExtension === "txt" || FileExtension === "trc") {
          // Split the file's text into an array of lines.
          let lines = (<string>Reader.result).split('\r\n');
          // Iterate over the lines array and process each line as needed.
          for (let i = 0; i <= lines.length - 1; i++) {
            let line = lines[i];
            RawData.push(line);
          }
        } else {
          console.log("Invalid file extension. Please use a .txt or .trc file.");
          DisplayErrorNotification("Invalid file extension. Please use a .txt or .trc file.");
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