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
         * TODO: Check if there is a standard order for these.
         */
        const defaultHeaders = ["InputFileName", "ModelType", "SolverName", "Direction", "ModelStatus", "SolverStatus", "ObjectiveValue", "SolverTime"];

        for (let i = 0; i < RawData.length; i++) {
            const Obj = {};
            const currentLine = RawData[i].split(",");
            for (let j = 0; j < defaultHeaders.length; j++) {
                Obj[defaultHeaders[j]] = currentLine[j];
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