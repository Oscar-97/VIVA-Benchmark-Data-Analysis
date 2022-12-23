export function ImportData(FilePath: string | URL) {
    // Using XMLHttpRequest. 
    // Replace at a later stage where user can upload the file from their directory.
    const RawData = new XMLHttpRequest();
    RawData.open("GET", FilePath, false);
    RawData.onreadystatechange = function () {
        if(RawData.readyState === 4)
        {
            if(RawData.status === 200 || RawData.status == 0)
            {
              console.log("Loaded data.")
            }
        }
    }
    RawData.send(null);
    const ReturnData = RawData.responseText.split("\n");
    return ReturnData;
}