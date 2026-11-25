import { StoredConfiguration, UserData } from "../Interfaces/Interfaces";
import { Values } from "../Constants/Values";
import { IsSupportedVersion, ReadDataSet } from "./ConfigurationFormat";

/**
 * Turns a parsed configuration into one with the defaults filled in.
 *
 * @returns The configuration, or undefined if it has no data.
 */
export function ToStoredConfiguration(
	userConfig: UserData
): StoredConfiguration | undefined {
	const lines = ReadDataSet(userConfig?.dataSet);
	if (!lines || lines.length === 0 || !IsSupportedVersion(userConfig.version)) {
		return undefined;
	}

	return {
		dataSet: lines,
		dataFileType: userConfig.dataFileType,
		defaultTime: userConfig.defaultTime ?? Values.DEFAULT_TIME,
		gapLimit: userConfig.gapLimit ?? Values.DEFAULT_GAP_LIMIT
	};
}
