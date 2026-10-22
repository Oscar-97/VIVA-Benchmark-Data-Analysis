const fileInput = {
	files: null as unknown,
	dispatchEvent: jest.fn()
};

jest.mock("../Src/Scripts/Elements/Elements", () => ({
	elements: {
		get fileInput(): typeof fileInput {
			return fileInput;
		}
	}
}));

import { RegisterDragAndDrop } from "../Src/Scripts/App/DragAndDrop";

type Listener = (event: unknown) => void;

const listeners = new Map<string, Listener>();
const bodyClasses = new Set<string>();

function Fire(type: string, event: object): void {
	const listener = listeners.get(type);
	if (!listener) throw new Error(`No listener for ${type}.`);
	listener(event);
}

/**
 * A drag event, with the kinds of data that it carries.
 */
function DragOf(
	types: string[],
	files: unknown[] = []
): {
	dataTransfer: { types: string[]; files: unknown[]; dropEffect: string };
	preventDefault: jest.Mock;
} {
	return {
		dataTransfer: { types, files, dropEffect: "none" },
		preventDefault: jest.fn()
	};
}

describe("RegisterDragAndDrop", () => {
	beforeEach(() => {
		listeners.clear();
		bodyClasses.clear();
		fileInput.files = null;
		fileInput.dispatchEvent.mockClear();
		Object.defineProperty(globalThis, "document", {
			value: {
				addEventListener: (type: string, listener: Listener): void => {
					listeners.set(type, listener);
				},
				body: {
					classList: {
						add: (name: string): void => {
							bodyClasses.add(name);
						},
						remove: (name: string): void => {
							bodyClasses.delete(name);
						},
						contains: (name: string): boolean => bodyClasses.has(name)
					}
				}
			},
			configurable: true
		});
		Object.defineProperty(globalThis, "Event", {
			value: class {
				constructor(
					public type: string,
					public init?: object
				) {}
			},
			configurable: true
		});
		RegisterDragAndDrop();
	});

	it("should mark the page while files are dragged over it, and unmark it when they leave", () => {
		Fire("dragenter", DragOf(["Files"]));
		Fire("dragenter", DragOf(["Files"]));
		expect(bodyClasses.has("drop-active")).toBe(true);

		// The drag leaves the first element and then the page.
		Fire("dragleave", DragOf(["Files"]));
		expect(bodyClasses.has("drop-active")).toBe(true);
		Fire("dragleave", DragOf(["Files"]));
		expect(bodyClasses.has("drop-active")).toBe(false);
	});

	it("should allow a drop of files, as a copy", () => {
		const event = DragOf(["Files"]);

		Fire("dragover", event);

		expect(event.preventDefault).toHaveBeenCalled();
		expect(event.dataTransfer.dropEffect).toBe("copy");
	});

	it("should leave the drag of text alone", () => {
		const event = DragOf(["text/plain"]);

		Fire("dragenter", event);
		Fire("dragover", event);
		Fire("drop", event);

		expect(event.preventDefault).not.toHaveBeenCalled();
		expect(bodyClasses.has("drop-active")).toBe(false);
		expect(fileInput.dispatchEvent).not.toHaveBeenCalled();
	});

	it("should put the dropped files in the file input and tell it that it changed", () => {
		const files = [{ name: "run.trc" }];
		Fire("dragenter", DragOf(["Files"]));
		const event = DragOf(["Files"], files);

		Fire("drop", event);

		expect(event.preventDefault).toHaveBeenCalled();
		expect(fileInput.files).toBe(files);
		expect(fileInput.dispatchEvent).toHaveBeenCalledTimes(1);
		expect(bodyClasses.has("drop-active")).toBe(false);
	});

	it("should not change the file input when no file is dropped", () => {
		Fire("drop", DragOf(["Files"], []));

		expect(fileInput.files).toBeNull();
		expect(fileInput.dispatchEvent).not.toHaveBeenCalled();
	});
});
