import { StoredConfiguration, UserData } from "../Interfaces/Interfaces";
import { Values } from "../Constants/Values";

/**
 * Turns a parsed configuration into one with the defaults filled in.
 *
 * @returns The configuration, or undefined if it has no data.
 */
export function ToStoredConfiguration(
	userConfig: UserData
): StoredConfiguration | undefined {
	if (!Array.isArray(userConfig?.dataSet) || userConfig.dataSet.length === 0) {
		return undefined;
	}

	return {
		dataSet: userConfig.dataSet.map((value) => {
			return typeof value === "string" ? value : JSON.stringify(value);
		}),
		dataFileType: userConfig.dataFileType,
		defaultTime: userConfig.defaultTime ?? Values.DEFAULT_TIME,
		gapLimit: userConfig.gapLimit ?? Values.DEFAULT_GAP_LIMIT
	};
}
