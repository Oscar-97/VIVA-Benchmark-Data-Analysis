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
	NumberOfNonzeros?: number;
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
