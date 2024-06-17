import { AddResultCategories } from "./AddResultCategories";
import { ExtractTraceData } from "./FilterData";
import { MergeData } from "./MergeData";
import { GetBestKnownBounds, GetInstanceInformation } from "./ReadMetaData";
import { librarySelector } from "../Elements/Elements";
import { TraceData } from "../Interfaces/Interfaces";

/**
 * This function processes trace data and adds instance information and best known bounds to the trace data.
 */
export async function ProcessData(
	unprocessedData: string[],
	unprocessedInstanceInformationData: string[],
	unprocessedSolutionData: string[]
): Promise<TraceData[]> {
	let traceData: TraceData[], instanceInfoData: object[], soluData: object[];

	traceData = ExtractTraceData(unprocessedData);
	if (unprocessedInstanceInformationData.length !== 0) {
		instanceInfoData = GetInstanceInformation(
			unprocessedInstanceInformationData
		);
		traceData = MergeData(traceData, instanceInfoData);
	}

	if (unprocessedSolutionData.length !== 0) {
		soluData = GetBestKnownBounds(unprocessedSolutionData);
	} else if (librarySelector.value === "MINLPLib") {
		const module = await import(
			/* webpackChunkName: "minlplib-dataset" */ "../Datasets/MINLPLib"
		);
		soluData = module.MINLPLIB_SOLUTION_DATA;
	} else if (librarySelector.value === "MIPLIB_2017") {
		const module = await import(
			/* webpackChunkName: "miplib2017-dataset" */ "../Datasets/MIPLIB_2017"
		);
		soluData = module.MIPLIB_2017_SOLUTION_DATA;
	} else if (librarySelector.value === "MIPLIB_2010") {
		const module = await import(
			/* webpackChunkName: "miplib2010-dataset" */ "../Datasets/MIPLIB_2010"
		);
		soluData = module.MIPLIB_2010_SOLUTION_DATA;
	}

	if (soluData) {
		traceData = MergeData(traceData, soluData);
	}
	AddResultCategories(traceData);

	return traceData;
}
