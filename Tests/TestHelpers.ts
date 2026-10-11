/**
 * Gets an item of a list and fails if there is none, so a test can use the item without a non-null assertion
 * and a wrong index fails with a message instead of a TypeError.
 */
export function At<T>(items: readonly T[], index: number): T {
	const item = items[index];
	if (item === undefined) {
		throw new Error(`There is no item at index ${index}.`);
	}
	return item;
}
