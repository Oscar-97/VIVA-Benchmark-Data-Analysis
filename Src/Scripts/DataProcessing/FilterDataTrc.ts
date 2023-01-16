export function ExtractTrcData(SolvedData: string | any[]) {
    
    const TrcData = [];
    const FirstLine = SolvedData[0].split(",");
    
    // Check if headers are included in the .trc file.
    if (FirstLine[0].startsWith("*")) {
        console.log("Found headers.");
        // Remove "* " from InputFileName.
        const Header = FirstLine.map((element: string) => element.replace(/^[\*]/, "").trim());
        console.log("Header: ", Header);
        
        for (let i = 1; i < SolvedData.length; i++) {
            const Obj = {};
            const currentLine = SolvedData[i].split(",");
            for (let j = 0; j < Header.length; j++) {
                Obj[Header[j]] = currentLine[j];
            }
            TrcData.push(Obj);
        }
    } else if (!FirstLine[0].startsWith("*")) {
        // Need to check if there is a standard order for these.
        const defaultHeaders = ["InputFileName", "ModelType", "SolverName", "Direction", "ModelStatus", "SolverStatus", "ObjectiveValue", "SolverTime"];
        
        for (let i = 0; i < SolvedData.length; i++) {
            const Obj = {};
            const currentLine = SolvedData[i].split(",");
            for (let j = 0; j < defaultHeaders.length; j++) {
                Obj[defaultHeaders[j]] = currentLine[j];
            }
            TrcData.push(Obj);
        }
    }

    return TrcData;
}

export function GetInputFileNameTrc() {

}