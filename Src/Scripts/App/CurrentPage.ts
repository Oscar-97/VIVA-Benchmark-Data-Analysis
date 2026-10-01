import { PageTitles } from "../Constants/PageTitles";

/**
 * The kinds of pages the application consists of.
 */
export enum PageKind {
	TABLE = "table",
	COMPARE_SOLVERS = "compareSolvers",
	PLOT = "plot"
}

/**
 * Determines what kind of page is shown, based on the document title.
 * Every page that is neither the table page nor the compare solvers page is a plot page.
 *
 * @param title - The page title. Defaults to the title of the current document.
 */
export function GetPageKind(title: string = document.title): PageKind {
	switch (title) {
		case PageTitles.TABLE:
			return PageKind.TABLE;
		case PageTitles.COMPARE_SOLVERS:
			return PageKind.COMPARE_SOLVERS;
		default:
			return PageKind.PLOT;
	}
}
