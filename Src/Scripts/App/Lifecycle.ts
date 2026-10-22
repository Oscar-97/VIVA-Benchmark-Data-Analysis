/**
 * Lets pages restart the program (for example after the table has been cleared)
 * without importing the initialization code, which would create an import cycle.
 */
let restartHandler: () => void = (): void => {};

/**
 * Sets the function that restarts the program.
 */
export function SetRestartHandler(handler: () => void): void {
	restartHandler = handler;
}

/**
 * Restarts the program by running the registered restart handler.
 */
export function RestartProgram(): void {
	restartHandler();
}
