import { FileInput, ImportDataButton } from "../Elements/Elements";

export function ReadData(RawData: any[]) {
    ImportDataButton.disabled = false;
    let Reader = new FileReader();
    let File = FileInput.files[0];
    let FileName = File.name;
    let FileExtension = FileName.split('.').pop();
    Reader.addEventListener('load', function () {
        RawData.length = 0;
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
            return;
        }

    });
    // Read the file as text.
    Reader.readAsText(FileInput.files[0]);
    return RawData;
}

export function GetFileType() {
    return FileInput.files[0].name.split('.').pop();
}