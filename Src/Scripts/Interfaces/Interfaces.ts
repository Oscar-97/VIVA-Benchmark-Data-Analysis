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
	InputFileName?: string | undefined;
	Direction?: string | undefined;
	ModelType?: string | undefined;
	DualBoundProblem?: number | string | undefined;
	PrimalBoundProblem?: number | string | undefined;
	Gap_Problem?: number | undefined;
	NumberOfVariables?: number | undefined;
	NumberOfDiscreteVariables?: number | undefined;
	NumberOfEquations?: number | undefined;
	NumberOfNonZeros?: number | undefined;
	NumberOfNonlinearNonZeros?: number | undefined;
	SolverName?: string | undefined;
	ModelStatus?: string | undefined;
	SolverStatus?: string | undefined;
	DualBoundSolver?: number | string | undefined;
	DualGap?: number | undefined;
	PrimalBoundSolver?: number | string | undefined;
	PrimalGap?: number | undefined;
	Gap_Solver?: number | undefined;
	SolverTime?: number | undefined;
	NumberOfIterations?: number | undefined;
	NumberOfNodes?: number | undefined;
	NumberOfDomainViolations?: number | undefined;
	Fail?: boolean | undefined;
	FailReason?: string | undefined;
	ObjectiveValue?: number | string | undefined;
	ObjectiveValueEstimate?: number | string | undefined;
}

/**
 * A solver and the number of its instances per status message, for example `{ SolverName: "SCIP", Failed: 2 }`.
 */
export interface StatusCount {
	SolverName?: string | undefined;
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
