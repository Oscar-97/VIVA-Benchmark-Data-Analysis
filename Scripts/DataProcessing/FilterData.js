// Filter the instance and solvers.
export function GetInstanceAndSolvers(data) {
    let tempData1 = data.split("\|");
    let tempData2 = tempData1.filter(item => item);
    for (var i = tempData2.length -1; i >= 0; i--){
        tempData2[i] = tempData2[i].replace(/\s+/g,"");
    }
    let returnData = tempData2;
    return returnData.slice(0, -1);
}

// Filter the data labels
export function GetDataLabels(data) {
    // Get the solver names.
    let returnData = data.split(" ");
    // Remove extra 'bound' in array when splitting.
    let tempData = returnData.filter(function(value) {
        return value != "bound"; });
    // Remove "|" and "#".
    let tempData2 = tempData.map(function(value) {
        return value.replace(/[I| #]/g, ''); });
    // Remove blanks.
    let tempData3 = tempData2.filter(item => item);
    
    // Add back 'bound' with function, and clean up the rest of the content.
    for (var i = 0; i < tempData3.length; i++)
    if (tempData3[i] === "Primal") {
        tempData3[i] = "Primal bound";
    } else if (tempData3[i] === "Dual"){
        tempData3[i] = "Dual bound"
    }
    returnData = tempData3;
    // Remove last /r in array before returning the data.
    return returnData.slice(0, -1);
}

// Filter the problems.
export function GetProblems(data) {
    let returnData = data.split(" ");
    // Remove blanks.
    let tempData = returnData.filter(item => item);
    // Remove "|".
    let tempData2 = tempData.map(function(value) {
        return value.replace(/[|]/g, ''); });
    returnData = tempData2;
    // Remove last /r in array and return data.
    return returnData.slice(0, -1);
}