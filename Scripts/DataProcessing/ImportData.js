// https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSRequestNotHttp

/*
Loading a local file

Local files from the same directory and subdirectories were historically treated as being from the same origin. 
This meant that a file and all its resources could be loaded from a local directory or subdirectory during testing, without triggering a CORS error.

Unfortunately this had security implications, as noted in this advisory: CVE-2019-11730. 
Many browsers, including Firefox and Chrome, now treat all local files as having opaque origins (by default). 
As a result, loading a local file with included local resources will now result in CORS errors.

Developers who need to perform local testing should now set up a local server. 
As all files are served from the same scheme and domain (localhost) they all have the same origin, and do not trigger cross-origin errors. 
*/

export function ImportData(filePath) {
    // TEMP, using XMLHttpRequest. 
    // Replace at a later stage where user can upload the file from their directory.
    let rawData = new XMLHttpRequest();
    rawData.open("GET", filePath, false);
    rawData.onreadystatechange = function () {
        if(rawData.readyState === 4)
        {
            if(rawData.status === 200 || rawData.status == 0)
            {
              console.log("Loaded data.")
            }
        }
    }
    rawData.send(null);
    let returnData = rawData.responseText.split("\n");
    return returnData;
}