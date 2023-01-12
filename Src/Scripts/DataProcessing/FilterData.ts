/**
 * Filter the instance and solvers.
 * @param GetInstanceAndSolvers
 * @returns Instance and solvers.
 */
export function GetInstanceAndSolvers(data: string) {
    let TempData1 = data.split("\|");
    let TempData2 = TempData1.filter(item => item);
    for (var i = TempData2.length - 1; i >= 0; i--) {
        TempData2[i] = TempData2[i].replace(/\s+/g, "");
    }
    let ReturnData = TempData2;
    return ReturnData.slice(0, -1);
}

/**
 * Filter the data labels.
 * @param GetDataLabels
 * @returns Data labels.
 */
export function GetDataLabels(data: string) {
    // Get the solver names.
    let ReturnData = data.split(" ");
    // Remove extra 'bound' in array when splitting.
    let TempData = ReturnData.filter(function (value) {
        return value != "bound";
    });
    // Remove "|" and "#".
    let TempData2 = TempData.map(function (value) {
        return value.replace(/[I| #]/g, '');
    });
    // Remove blanks.
    let TempData3 = TempData2.filter(item => item);

    // Add back 'bound/I' with function, and clean up the rest of the content.
    for (var i = 0; i < TempData3.length; i++)
        if (TempData3[i] === "Primal") {
            TempData3[i] = "Primal bound";
        } else if (TempData3[i] === "Dual") {
            TempData3[i] = "Dual bound";
        } else if (TempData3[i] === "Nodes") {
            TempData3[i] = "Nodes I";
        }
    ReturnData = TempData3;
    // Remove last /r in array before returning the data.
    return ReturnData.slice(0, -1);
}

/**
 * Filter the problems.
 * @param GetProblems 
 * @returns Problems.
 */
export function GetProblems(data: string) {
    // Remove blanks.
    let TempData = data.replace(/\s+/g,' ');
    let ReturnData = TempData.split(" ");
    // Remove "|".
    let TempData2 = ReturnData.map(function (value) {
        return value.replace(/[|]/g, '');
    });
    ReturnData = TempData2;
    // Remove last /r in array and return data.
    return ReturnData.slice(0, -1);
}