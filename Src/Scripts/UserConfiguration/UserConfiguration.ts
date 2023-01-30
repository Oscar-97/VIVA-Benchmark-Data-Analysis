const UserData = {
    dataSet: [],
    fileExtensionType: "",
}

export function CreateUserConfiguration(RawData: any[], FileExtensionType: string) {
    UserData.dataSet = RawData;
    UserData.fileExtensionType = FileExtensionType;
    localStorage.setItem("UserConfiguration", JSON.stringify(UserData))
}

export function GetUserConfiguration(): [any[], string] {
    const UserConfig = JSON.parse(localStorage.getItem("UserConfiguration"));
    let RawData = [];
    let FileExtensionType :string;
    UserConfig.dataSet.forEach(function(value: any) {
        RawData.push(value);
    });
    FileExtensionType = UserConfig.fileExtensionType;
    console.log("RawData fron localStorage: ", RawData);
    console.log("FileType of saved data: ", FileExtensionType);
    return [RawData, FileExtensionType];
}

export function DeleteUserConfiguration() {
    localStorage.removeItem("UserConfiguration");
}