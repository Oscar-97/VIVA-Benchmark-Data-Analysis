/**
 * Information messages.
 */
export enum InfoMessages {
	DEMO_MODE_MSG = "Using demo mode!",
	FOUND_STORED_CONFIG = "Found stored configuration!",
	LOADED_FILES = "Benchmarks loaded with following files: \n",
	INSTANCE_INFO_LOADED = "Instance information succesfully loaded!"
}

/**
 * Error messages.
 */
export enum ErrorMessages {
	SELECT_SOLVER_AMOUNT = "Please select exactly two solvers to compare.",
	WRONG_EXTENSIONS = "No .trc, .json or .solu files found.",
	NEITHER_EXTENSIONS = "At least one .trc or .json file required.",
	BOTH_EXTENSIONS = "Cannot upload both .trc and .json files simultaneously.",
	INVALID_EXTENSION = "Invalid file extension. Only .trc, .json, .solu, and .csv allowed.",
	INVALID_DATA_STRUCTURE = "Invalid data structure in uploaded JSON."
}

/**
 * Messages related to the table page.
 */
export enum TableMessages {
	TABLE_SUCCESS_HEADER = "VIVA: Datatable ready!",
	TABLE_SUCCESS = "Datatable has been successfully generated and is ready for use.",
	TABLE_NO_ROWS = "No rows selected for filtering.",
	TABLE_CLEARING = "Clearing table and reinitializing application in 5 seconds."
}

/**
 * Messages related to the chart pages.
 */
export enum ChartMessages {
	CHART_SUCCESS_HEADER = "VIVA: Chart ready!",
	CHART_SUCCESS = "Chart has been successfully generated and is ready for use.",
	NO_CHART_DATA = "No chart data found!"
}

/**
 * Messages related to user configuration.
 */
export enum UserConfigurationMessages {
	QUOTA_EXCEEDED = "Local storage is full. Please clear.",
	SECURITY_ERROR = "Local storage is disabled. Please enable it in your browser settings.",
	INVALID_ACCESS = "Local storage cannot be accessed. Please try again.",
	STORE_SUCCESS = "Saved configuration!",
	NO_STORED_CONFIG = "No saved data configuration found!",
	PREVIOUSLY_VISITED = "User has previously visited this page in this session/tab.",
	DELETED_CONFIG = "Deleted configuration."
}

/**
 * Captions used in the application on tables, charts and modals.
 */
export enum Captions {
	COMPARISON_TABLE_CAPTION = "Direct comparison on how many instances the solver time was better, worse or equal.",
	COMPARSION_MODAL_LABEL = "Instances were solver times were:",
	INSTANCE_ATTRIBUTES_TABLE_CAPTION = "Statistics on the instance attributes.",
	SOLVE_ATTRIBUTES_TABLE_CAPTION = "Statistics on the solve attributes (all solver runs)."
}
