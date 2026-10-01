/**
 * UserData consists of dataset and file extension.
 * @interface UserData
 */
export interface UserData {
	dataSet: string[] | object[];
	dataFileType: string;
	defaultTime?: number | undefined;
	gapLimit?: number | undefined;
}

/**
 * A user configuration that was restored from the local storage, with the defaults filled in.
 */
export interface StoredConfiguration {
	dataSet: string[];
	dataFileType: string;
	defaultTime: number;
	gapLimit: number;
}

/**
 * Interface for the parsed data object.
 */
export interface TraceData {
	InputFileName?: string;
	Direction?: string;
	ModelType?: string;
	DualBoundProblem?: number | string;
	PrimalBoundProblem?: number | string;
	Gap_Problem?: number;
	NumberOfVariables?: number;
	NumberOfDiscreteVariables?: number;
	NumberOfEquations?: number;
	NumberOfNonZeros?: number;
	NumberOfNonlinearNonZeros?: number;
	SolverName?: string;
	ModelStatus?: string;
	SolverStatus?: string;
	DualBoundSolver?: number | string;
	DualGap?: number;
	PrimalBoundSolver?: number | string;
	PrimalGap?: number;
	Gap_Solver?: number;
	SolverTime?: number;
	NumberOfIterations?: number;
	NumberOfNodes?: number;
	NumberOfDomainViolations?: number;
	Fail?: boolean;
	FailReason?: string;
	ObjectiveValue?: number | string;
	ObjectiveValueEstimate?: number | string;
}

/**
 * A solver and the number of its instances per status message, for example `{ SolverName: "SCIP", Failed: 2 }`.
 */
export interface StatusCount {
	SolverName?: string;
	[status: string]: string | number | undefined;
}

/**
 * The time a solver needed for one instance.
 */
export interface SolverTimeEntry {
	time: number;
	InputFileName: string;
}

/**
 * Interface for the comparison summary object.
 */
export interface ComparisonSummary {
	better: number;
	worse: number;
	equal: number;
	details: ComparisonDetails[];
}

/**
 * Interface for the comparison detail object.
 */
export interface ComparisonDetails {
	InputFileName: string;
	time1: number;
	time2: number;
	comparison: "better" | "worse" | "equal";
}

/**
 * Interface representing a categories object with optional `InputFileName` and `name` properties.
 */
export interface CategoriesObj {
	InputFileName?: string;
	name?: string;
}

/**
 * Interface representing a statistics object for the statistics table.
 */
export interface StatisticsColumns {
	countValue?: number;
	sumValue?: number;
	avgValue: number;
	minValue: number;
	maxValue: number;
	stdValue: number;
	p10Value: number;
	p25Value: number;
	p50Value: number;
	p75Value: number;
	p90Value: number;
}
