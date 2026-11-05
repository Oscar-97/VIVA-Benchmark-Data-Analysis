const emptyState = { hidden: false };
const dataMenu = { hidden: false };
const classes = new Set<string>();
const buttonContainer = {
	title: "",
	classList: {
		toggle: (name: string, force: boolean): void => {
			if (force) {
				classes.add(name);
			} else {
				classes.delete(name);
			}
		}
	},
	removeAttribute: (name: string): void => {
		if (name === "title") {
			buttonContainer.title = "";
		}
	}
};

jest.mock("../Src/Scripts/Elements/Elements", () => ({
	elements: {
		get emptyState(): object {
			return emptyState;
		},
		get dataMenu(): object {
			return dataMenu;
		},
		get buttonContainer(): object {
			return buttonContainer;
		}
	}
}));

import { SetEmptyStateVisible } from "../Src/Scripts/Elements/EmptyState";

describe("SetEmptyStateVisible", () => {
	it("explains how to load data, and holds back the data actions, while there is no data", () => {
		SetEmptyStateVisible(true);

		expect(emptyState.hidden).toBe(false);
		expect(dataMenu.hidden).toBe(true);
		expect(classes.has("no-data")).toBe(true);
		expect(buttonContainer.title).toBe("Load data first.");
	});

	it("offers the data actions once there is data", () => {
		SetEmptyStateVisible(true);
		SetEmptyStateVisible(false);

		expect(emptyState.hidden).toBe(true);
		expect(dataMenu.hidden).toBe(false);
		expect(classes.has("no-data")).toBe(false);
		expect(buttonContainer.title).toBe("");
	});
});
