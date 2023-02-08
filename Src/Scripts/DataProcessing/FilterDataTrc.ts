/**
 * Extract the data from the trc file.
 * @param RawData The provided raw data.
 * @returns TrcData Contains the processed trc results.
 */
export function ExtractTrcData(RawData: string | any[]) {

    const TrcData = [];
    const FirstLine = RawData[0].split(",");

    /**
     * Check if headers are included in the .trc file. If they are found, include them, if not, use the custom headers.
     */
    if (FirstLine[0].startsWith("*")) {
        console.log("Found headers.");
        /**
         * Remove "* " from InputFileName.
         */
        const Header = FirstLine.map((element: string) => element.replace(/^[\*]/, "").trim());
        console.log("Header: ", Header);

        for (let i = 1; i < RawData.length; i++) {
            const Obj = {};
            const currentLine = RawData[i].split(",");
            for (let j = 0; j < Header.length; j++) {
                Obj[Header[j]] = currentLine[j];
            }
            TrcData.push(Obj);
        }
    } else if (!FirstLine[0].startsWith("*")) {
        /**
         * Standard order of headers: 
         * https://www.gamsworld.org/performance/trace.htm
         */
        //const defaultHeaders = ["InputFileName", "ModelType", "SolverName", "Direction", 
        //"ModelStatus", "SolverStatus", "ObjectiveValue", "SolverTime"];
        const DefaultHeaders = [
            "filename",   
            "modeltype", 
            "solvername", 
            "NLP def",    
            "MIP def",    
            "juliantoday",
            "direction", 
            "equnum",     
            "varnum",	 
            "dvarnum",    
            "nz",       
            "nlnz",    
            "optfile",   
            "modelstatus",  
            "solvestatus",
            "obj",    
            "objest",    
            "res used",   
            "iter used",
            "dom used",
            "nodes used",
            "user1"
        ]
        const PreviousRow = {};

        for (let i = 0; i < RawData.length; i++) {
            const CurrentLine = RawData[i].split(",");
            const Filename = CurrentLine[0];
            const Solvername = CurrentLine[2];

            // Check if the combination of filename and solver has been used earlier.
            if (PreviousRow[Filename] === Solvername) {
              continue;
            }
            PreviousRow[Filename] = Solvername;
            
            const Obj = {};
            for (let j = 0; j < DefaultHeaders.length; j++) {
              Obj[DefaultHeaders[j]] = CurrentLine[j];
            }
            TrcData.push(Obj);
          }
    }
    return TrcData;
}

/**
 * Get the provided category and the corresponding data.
 * @param TrcData Contains the processed trc results.
 * @param DataCategory The data category to extract values from.
 * @returns DataCategoryResults The category results that will be returned.
 */
export function GetTrcDataCategory(TrcData: any[], DataCategory: string) {
    let DataCategoryResults = [];
    for (let i = 0; i < TrcData.length; i++) {
        DataCategoryResults.push(TrcData[i][DataCategory]);
    }
    return DataCategoryResults;
}