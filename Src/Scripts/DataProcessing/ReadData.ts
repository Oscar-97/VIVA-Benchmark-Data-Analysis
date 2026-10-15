import { elements } from "../Elements/Elements";
import { DisplayErrorNotification } from "../Elements/Events/DisplayAlertNotification";
import { userData } from "../UserConfiguration/UserConfiguration";
import { Keys } from "../Constants/Keys";
import { ErrorMessages } from "../Constants/Messages";

/**
 * This function retrieves the type of the data file inputted by the user.
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
	const files = elements.fileInput.files;
	const extensions = [];
	const fileCounts = { csv: 0, solu: 0, json: 0 };

	if (!files) {
		throw new Error("No files were selected.");
	}
	for (const file of Array.from(files)) {
		const extension = CheckFileExtension(file, fileCounts);

		if (["trc", "solu", "json", "csv"].includes(extension)) {
			extensions.push(extension);
		}
	}

	if (extensions.length === 0) {
		DisplayErrorNotification(ErrorMessages.WRONG_EXTENSIONS);
		throw new Error(ErrorMessages.WRONG_EXTENSIONS);
	}

	const hasTRCOrJSON = extensions.some((ext) => {
		return ext === "trc" || ext === "json";
	});

	if (!hasTRCOrJSON) {
		DisplayErrorNotification(ErrorMessages.NEITHER_EXTENSIONS);
		throw new Error(ErrorMessages.NEITHER_EXTENSIONS);
	}

	if (extensions.includes("trc") && extensions.includes("json")) {
		DisplayErrorNotification(ErrorMessages.BOTH_EXTENSIONS);
		throw new Error(ErrorMessages.BOTH_EXTENSIONS);
	}

	return (
		extensions.find((ext) => {
			return ext === "trc" || ext === "json";
		}) ?? ""
	);
}

/**
 * This function validates the extension of the given file and updates the file counts accordingly.
 *
 * @param {File} file - The file for which to check the extension.
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
	}
): string {
	const extension = file.name.split(".").pop();

	if (!extension || !IsValidExtension(extension)) {
		DisplayErrorNotification(ErrorMessages.INVALID_EXTENSION);
		throw new Error(ErrorMessages.INVALID_EXTENSION);
	}

	if (extension in fileCounts) {
		const count = (fileCounts[extension] ?? 0) + 1;
		fileCounts[extension] = count;
		if (count > 1) {
			DisplayErrorNotification(`Cannot upload multiple .${extension} files.`);
			throw new Error(`Cannot upload multiple .${extension} files.`);
		}
	}

	return extension;
}

/**
 * This function checks if a file extension is valid.
 *
 * @param {string} extension - The file extension to check.
 * @returns Boolean value indicating if the file extension is valid.
 */
function IsValidExtension(extension: string): boolean {
	return ["trc", "json", "solu", "csv"].includes(extension);
}

/**
 * Splits the content of a file into lines, for the line endings of Windows (\r\n) and of Unix (\n).
 * The lines of a trace file are also trimmed.
 *
 * @param extension - The kind of file: a trace file, the instance information (.csv) or the best known bounds (.solu).
 * @param content - The text of the file.
 */
export function SplitIntoLines(
	extension: "trc" | "csv" | "solu",
	content: string
): string[] {
	const lines = content.split(/\r?\n/);
	return extension === "trc" ? lines.map((line) => line.trim()) : lines;
}

/**
 * This function reads data from multiple file inputs, returning the raw data, instance information data and solu data.
 *
 * @param {string[]} unprocessedData - An array to store the raw data from .trc files.
 * @param {string[]} unprocessedInstanceInformationData - An array to store the raw data from .csv files.
 * @param {string[]} unprocessedSolutionData - An array to store the raw data from .solu files.
 * @returns An object containing arrays of raw data, instance information data, and solu data.
 *
 * @remarks
 * This function reads multiple files selected by the user, like trace1.trc, trace2.trc and minlp.solu.
 * It uses the FileReader API to read the content of each file.
 * Depending on the file extension (.json, .trc, .csv, .solu), it splits the file's content into an array of lines
 * and processes each line as required, storing the results in the relevant arrays (unprocessedData, unprocessedInstanceInformationData, unprocessedSolutionData).
 * If the file extension is .json, the function stores the uploaded UserConfiguration in the localStorage.
 */
export async function ReadData(
	unprocessedData: string[],
	unprocessedInstanceInformationData: string[],
	unprocessedSolutionData: string[]
): Promise<{
	UnprocessedData: string[];
	UnprocessedInstanceInformationData: string[];
	UnprocessedSolutionData: string[];
}> {
	/**
	 * Input multiple files.
	 * For instance: trace1.trc, trace2.trc and minlp.solu.
	 */
	if (!elements.fileInput.files) {
		throw new Error("No files were selected.");
	}
	const files = Array.from(elements.fileInput.files);

	// The import is not possible until all files are read.
	elements.importDataButton.disabled = true;

	// All files are read at the same time, but the results are used in the order of the selection,
	// so the order of the rows does not depend on which read finishes first.
	let contents: string[];
	try {
		contents = await Promise.all(
			files.map((file) =>
				file.text().catch((error: unknown) => {
					throw new Error(`The file ${file.name} could not be read.`, {
						cause: error
					});
				})
			)
		);
	} catch (error) {
		// Without all files the import stays closed, until other files are chosen.
		elements.librarySelector.disabled = false;
		throw error;
	}
	elements.importDataButton.disabled = false;
	elements.librarySelector.disabled = false;

	files.forEach((file, index) => {
		const fileExtension = file.name.split(".").pop();
		const content = contents[index] ?? "";

		/**
		 * Split the file's content into an array of lines and process each line as needed.
		 */
		if (fileExtension === "json") {
			let parsedData: unknown;
			try {
				parsedData = JSON.parse(content);
			} catch {
				RejectConfigurationFile(file.name, ErrorMessages.INVALID_JSON);
				return;
			}
			VerifyConfigurationProperties(file.name, parsedData);
		} else if (fileExtension === "trc") {
			for (const line of SplitIntoLines("trc", content)) {
				unprocessedData.push(line);
			}
		} else if (fileExtension === "csv") {
			for (const line of SplitIntoLines("csv", content)) {
				unprocessedInstanceInformationData.push(line);
			}
		} else if (fileExtension === "solu") {
			for (const line of SplitIntoLines("solu", content)) {
				unprocessedSolutionData.push(line);
			}
		}
	});

	return {
		UnprocessedData: unprocessedData,
		UnprocessedInstanceInformationData: unprocessedInstanceInformationData,
		UnprocessedSolutionData: unprocessedSolutionData
	};
}

/**
 * This function checks the properties of the data in the JSON file.
 */
interface ParsedData {
	dataSet: string[];
	dataFileType: string;
	defaultTime?: string;
	[key: string]: unknown;
}

/**
 * Reports a configuration file that cannot be used, and keeps the import closed until another file is chosen,
 * so that the configuration that was stored earlier is not loaded instead.
 */
function RejectConfigurationFile(fileName: string, reason: string): void {
	const message = `${fileName}: ${reason}`;
	DisplayErrorNotification(message);
	console.error(message);
	elements.importDataButton.disabled = true;
}

function IsParsedData(value: unknown): value is ParsedData {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function VerifyConfigurationProperties(
	fileName: string,
	parsedData: unknown
): void {
	if (!IsParsedData(parsedData)) {
		RejectConfigurationFile(fileName, ErrorMessages.INVALID_DATA_STRUCTURE);
		return;
	}
	if (
		parsedData.hasOwnProperty.call(parsedData, "dataSet") &&
		parsedData.hasOwnProperty.call(parsedData, "dataFileType")
	) {
		userData.dataSet = parsedData.dataSet;
		userData.dataFileType = parsedData.dataFileType;

		if (parsedData.hasOwnProperty.call(parsedData, "defaultTime")) {
			userData.defaultTime = parsedData.defaultTime
				? Number(parsedData.defaultTime)
				: undefined;
		}

		localStorage.setItem(Keys.USER_CONFIGURATION, JSON.stringify(userData));
	} else {
		RejectConfigurationFile(fileName, ErrorMessages.INVALID_DATA_STRUCTURE);
	}
}
