import { fileInput, importDataButton } from "../Elements/Elements";
import { DisplayErrorNotification } from "../Elements/DisplayAlertNotification";
import { userData } from "../UserConfiguration/UserConfiguration";

/**
 * Retrieves the type of the data file inputted by the user.
 *
 * @returns The extension of the data file.
 *
 * @remarks
 * This function examines the files selected by the user through the file input.
 * It checks each file's extension, verifying that it is valid (.trc, .json, .solu, or .csv).
 * It then asserts that there are not multiple files of the same extension and that
 * there is at least one .trc or .json file.
 * If any of these checks fail, it displays an error notification and throws an error.
 * If all checks pass, it returns the extension of the first file.
 *
 * @throws
 * This function will throw an error if:
 * - Any file has an invalid extension.
 * - There are multiple files with the same extension.
 * - There is no .trc or .json file.
 * - There are both .trc and .json files.
 */
export function GetDataFileType(): string {
	const files = fileInput.files;
	const extensions = [];
	const fileCounts = { csv: 0, solu: 0, json: 0 };

	for (let i = 0; i < files.length; i++) {
		const extension = CheckFileExtension(files[i], fileCounts);

		if (["trc", "solu", "json", "csv"].includes(extension)) {
			extensions.push(extension);
		}
	}

	if (extensions.length === 0) {
		DisplayErrorNotification("No .trc, .json or .solu files found.");
		throw new Error("No .trc, .json or .solu files found.");
	}

	const hasTRCOrJSON = extensions.some(
		(ext) => ext === "trc" || ext === "json"
	);

	if (!hasTRCOrJSON) {
		DisplayErrorNotification("At least one .trc or .json file required.");
		throw new Error("At least one .trc or .json file required.");
	}

	if (extensions.includes("trc") && extensions.includes("json")) {
		DisplayErrorNotification(
			"Cannot upload both .trc and .json files simultaneously."
		);
		throw new Error("Cannot upload both .trc and .json files simultaneously.");
	}

	return extensions.find((ext) => ext === "trc" || ext === "json");
}

/**
 * Validates the extension of the given file and updates the file counts accordingly.
 *
 * @param file - The file for which to check the extension.
 * @param fileCounts - An object that tracks the count of each file extension encountered.
 * @returns The valid file extension of the provided file.
 * @throws Error if an invalid extension is encountered or if multiple files of the same extension are uploaded.
 *
 * @example
 * const fileCounts = { csv: 0, solu: 0, json: 0 };
 * const file = new File(["content"], "filename.json");
 * const extension = CheckFileExtension(file, fileCounts);  // Returns "json"
 */
function CheckFileExtension(
	file: File,
	fileCounts: {
		[x: string]: number;
		csv?: number;
		solu?: number;
		json?: number;
	}
): string {
	const extension = file.name.split(".").pop();

	if (!IsValidExtension(extension)) {
		DisplayErrorNotification(
			"Invalid file extension. Only .trc, .json, .solu, and .csv allowed."
		);
		throw new Error(
			"Invalid file extension. Only .trc, .json, .solu, and .csv allowed."
		);
	}

	if (extension in fileCounts) {
		fileCounts[extension]++;
		if (fileCounts[extension] > 1) {
			DisplayErrorNotification(`Cannot upload multiple .${extension} files.`);
			throw new Error(`Cannot upload multiple .${extension} files.`);
		}
	}

	return extension;
}

/**
 * Checks if a file extension is valid.
 *
 * @param extension - The file extension to check.
 * @returns Boolean value indicating if the file extension is valid.
 */
function IsValidExtension(extension: string): boolean {
	return ["trc", "json", "solu", "csv"].includes(extension);
}

/**
 * Reads data from multiple file inputs, returning the raw data, instance information data and solu data.
 *
 * @param rawData - An array to store the raw data from .trc files.
 * @param rawInstanceInfoData - An array to store the raw data from .csv files.
 * @param rawSoluData - An array to store the raw data from .solu files.
 * @returns An object containing arrays of raw data, instance information data, and solu data.
 *
 * @remarks
 * This function reads multiple files selected by the user, like trace1.trc, trace2.trc and minlp.solu.
 * It uses the FileReader API to read the content of each file.
 * Depending on the file extension (.json, .trc, .csv, .solu), it splits the file's content into an array of lines
 * and processes each line as required, storing the results in the relevant arrays (rawData, rawInstanceInfoData, rawSoluData).
 * If the file extension is .json, the function stores the uploaded UserConfiguration in the localStorage.
 */
export function ReadData(
	rawData: string[],
	rawInstanceInfoData: string[],
	rawSoluData: string[]
): { RawData: string[]; RawInstanceInfoData: string[]; RawSoluData: string[] } {
	importDataButton.disabled = false;

	/**
	 * Input multiple files.
	 * For instance: trace1.trc, trace2.trc and minlp.solu.
	 */
	for (let i = 0; i < fileInput.files.length; i++) {
		const reader = new FileReader();
		const file = fileInput.files[i];
		const fileName = file.name;
		const fileExtension = fileName.split(".").pop();

		/**
		 * Split the file's content into an array of lines and iterate over the lines array and process each line as needed.
		 */
		reader.addEventListener("load", function () {
			if (fileExtension === "json") {
				const dataJSON = <string>reader.result;
				const parsedData = JSON.parse(dataJSON);

				if (
					parsedData.hasOwnProperty("dataSet") &&
					parsedData.hasOwnProperty("dataFileType")
				) {
					userData.dataSet = parsedData.dataSet;
					userData.dataFileType = parsedData.dataFileType;

					if (parsedData.hasOwnProperty("defaultTime")) {
						userData.defaultTime = parsedData.defaultTime;
					}

					localStorage.setItem("UserConfiguration", JSON.stringify(userData));
				} else {
					DisplayErrorNotification("Invalid data structure in uploaded JSON.");
					console.log("Invalid data structure in uploaded JSON.");
				}
			} else if (fileExtension === "trc") {
				const lines = (<string>reader.result)
					.split(/\r?\n/)
					.map((line) => line.trim());
				for (let i = 0; i <= lines.length - 1; i++) {
					const line = lines[i];
					rawData.push(line);
				}
			} else if (fileExtension === "csv") {
				const lines = (<string>reader.result).split("\n");
				for (let i = 0; i <= lines.length - 1; i++) {
					const line = lines[i];
					rawInstanceInfoData.push(line);
				}
			} else if (fileExtension === "solu") {
				const lines = (<string>reader.result).split(/\r?\n/);
				for (let i = 0; i <= lines.length - 1; i++) {
					const line = lines[i];
					rawSoluData.push(line);
				}
			}
		});

		reader.readAsText(file);
	}

	return {
		RawData: rawData,
		RawInstanceInfoData: rawInstanceInfoData,
		RawSoluData: rawSoluData
	};
}
