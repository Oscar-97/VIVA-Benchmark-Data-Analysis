/**
 * The event listeners of the pages are bound to the data that was loaded when they were registered.
 * They are registered through `Listen`, so they can all be removed at once when new data is loaded.
 * Otherwise the listeners of earlier data would still run next to the new ones.
 */
let controller = new AbortController();

/**
 * Removes all the listeners that were registered with `Listen`.
 */
export function ResetPageListeners(): void {
	controller.abort();
	controller = new AbortController();
}

/**
 * Adds an event listener that is removed by the next call to `ResetPageListeners`.
 *
 * @param target - The element to listen on. Nothing happens if the element does not exist.
 * @param type - The event type.
 * @param handler - The function to run when the event occurs.
 */
export function Listen<K extends keyof HTMLElementEventMap>(
	target: HTMLElement | null,
	type: K,
	handler: (event: HTMLElementEventMap[K]) => void
): void {
	target?.addEventListener(type, handler, { signal: controller.signal });
}
