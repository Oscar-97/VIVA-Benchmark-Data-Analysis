/**
 * Mapping and sort order for the headers to a more readable format for the end users.
 */
export enum TraceHeaderMap {
	InputFileName = "Problem",
	Direction = "Direction",
	ModelType = "ModelType",
	DualBoundProblem = "ProblemDualBound",
	PrimalBoundProblem = "ProblemPrimalBound",
	Gap_Problem = "ProblemGap",
	NumberOfVariables = "#Variables",
	NumberOfDiscreteVariables = "#DiscreteVariables",
	NumberOfEquations = "#Equations",
	NumberOfNonzeros = "#NonZeros",
	NumberOfNonlinearNonZeros = "#NonlinearNonZeroes",
	SolverName = "Solver",
	ModelStatus = "ModelStatus",
	SolverStatus = "SolverStatus",
	TermStatus = "SolverTermStatus",
	DualBoundSolver = "SolverDualBound",
	DualGap = "SolverDualGap[%]",
	PrimalBoundSolver = "SolverPrimalBound",
	PrimalGap = "SolverPrimalGap[%]",
	Gap_Solver = "SolverGap",
	SolverTime = "SolverTime",
	NumberOfIterations = "#SolverIterations",
	NumberOfNodes = "#SolverNodes"
}

/**
 * Reverse mapping for the headers.
 * Used when the data has been filtered.
 */
export enum ReversedTraceHeaderMap {
	Problem = "InputFileName",
	Direction = "Direction",
	ModelType = "ModelType",
	ProblemDualBound = "DualBoundProblem",
	ProblemPrimalBound = "PrimalBoundProblem",
	ProblemGap = "Gap_Problem",
	"#Variables" = "NumberOfVariables",
	"#DiscreteVariables" = "NumberOfDiscreteVariables",
	"#Equations" = "NumberOfEquations",
	"#NonZeros" = "NumberOfNonzeros",
	"#NonlinearNonZeroes" = "NumberOfNonlinearNonZeros",
	Solver = "SolverName",
	ModelStatus = "ModelStatus",
	SolverStatus = "SolverStatus",
	SolverTermStatus = "TermStatus",
	SolverDualBound = "DualBoundSolver",
	"SolverDualGap[%]" = "DualGap",
	SolverPrimalBound = "PrimalBoundSolver",
	"SolverPrimalGap[%]" = "PrimalGap",
	SolverGap = "Gap_Solver",
	SolverTime = "SolverTime",
	"#SolverIterations" = "NumberOfIterations",
	"#SolverNodes" = "NumberOfNodes"
}

/**
 * Default headers to fall back, if no headers are included in the trace files.
 * Based on: https://gams.com/latest/docs/UG_SolverUsage.html#UG_SolverUsage_TraceRecordFields
 */
export const DEFAULT_HEADERS: string[] = [
	"InputFileName",
	"ModelType",
	"SolverName",
	"NLP",
	"MIP",
	"JulianDate",
	"Direction",
	"NumberOfEquations",
	"NumberOfVariables",
	"NumberOfDiscreteVariables",
	"NumberOfNonZeros",
	"NumberOfNonlinearNonZeros",
	"OptionFile",
	"ModelStatus",
	"TermStatus",
	"ObjectiveValue",
	"ObjectiveValueEstimate",
	"SolverTime",
	"NumberOfIterations",
	"NumberOfDomainViolations",
	"NumberOfNodes",
	"UserComment"
];

/**
 * List of default visible headers in the data table.
 */
export const DEFAULT_VISIBLE_HEADERS: string[] = [
	"Problem",
	"Direction",
	"ModelType",
	"Gap[%]",
	"Solver",
	"ModelStatus",
	"SolverStatus",
	"SolverDualBound",
	"SolverDualGap[%]",
	"SolverPrimalBound",
	"SolverPrimalGap[%]",
	"SolverTime",
	"SolverGap[%]"
];
