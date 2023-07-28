import { fileInput, importDataButton } from "../Elements/Elements";
import { DisplayErrorNotification } from "../Elements/DisplayAlertNotification";

/**
 * User should only be able to upload multiple .trc files, and atleast one of the files needs to be a .txt, .trc or .json file.
 * @returns DataFileType
 */
export function GetDataFileType(): string {
	const files = fileInput.files;
	const extensions = [];

	let txtCount = 0;
	let jsonCount = 0;

	for (let i = 0; i < files.length; i++) {
		const extension = files[i].name.split(".").pop();
		if (extension === "trc") {
			extensions.push(extension);
		} else if (extension === "txt") {
			txtCount++;
			if (txtCount > 1) {
				DisplayErrorNotification("Cannot upload multiple .txt files.");
				throw new Error("Cannot upload multiple .txt files.");
			}
			extensions.push(extension);
		} else if (extension === "json") {
			jsonCount++;
			if (jsonCount > 1) {
				DisplayErrorNotification("Cannot upload multiple .json files.");
				throw new Error("Cannot upload multiple .json files.");
			}
			extensions.push(extension);
		}
	}

	if (extensions.length === 0) {
		DisplayErrorNotification("No .txt, .trc or .json files found.");
		throw new Error("No .txt, .trc or .json files found.");
	}

	return extensions[0];
}

/**
 * Read the raw data.
 * @param rawData
 * @param rawInstanceInfoData
 * @param rawSoluData
 * @returns
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
				localStorage.setItem("UserConfiguration", dataJSON);
				console.log("Stored uploaded UserConfiguration.");
			} else if (fileExtension === "txt" || fileExtension === "trc") {
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
				const lines = (<string>reader.result).split("\r\n");
				for (let i = 0; i <= lines.length - 1; i++) {
					const line = lines[i];
					rawSoluData.push(line);
				}
			} else {
				DisplayErrorNotification(
					"Invalid file extension. Please use a .trc or .txt file for results. Use a .csv file for instance data information."
				);
				throw new Error(
					"Invalid file extension. Please use a .trc or .txt file for results. Use a .csv file for instance data information."
				);
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
