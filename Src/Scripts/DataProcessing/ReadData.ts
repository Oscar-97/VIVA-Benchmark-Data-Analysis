import { FileInput, ImportDataButton } from "../Elements/Elements";

export function ReadData(RawData: any[]) {
    ImportDataButton.disabled = false;
    let Reader = new FileReader();
    Reader.addEventListener('load', function () {
        RawData.length = 0;
        // Split the file's text into an array of lines.
        let lines = (<string>Reader.result).split('\n');
        // Iterate over the lines array and process each line as needed. .
        // Skip the last line, as it is always empty in the benchmark results file.
        for (let i = 0; i < lines.length - 1; i++) {
            let line = lines[i];
            RawData.push(line);
        }
    });
    // Read the file as text.
    Reader.readAsText(FileInput.files[0]);
    return RawData;
}