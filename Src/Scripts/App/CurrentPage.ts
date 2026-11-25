import { PAGE_TITLE_SUFFIX, PageTitles } from "../Constants/PageTitles";

/**
 * The kinds of pages the application consists of.
 */
export enum PageKind {
	TABLE = "table",
	COMPARE_SOLVERS = "compareSolvers",
	PLOT = "plot"
}

/**
 * Gets the name of a page from its document title, without the application name suffix.
 *
 * @param title - The document title. Defaults to the title of the current document.
 */
export function GetPageName(title: string = document.title): string {
	return title.endsWith(PAGE_TITLE_SUFFIX)
		? title.slice(0, -PAGE_TITLE_SUFFIX.length)
		: title;
}

/**
 * Determines what kind of page is shown, based on the document title.
 * Every page that is neither the table page nor the compare solvers page is a plot page.
 *
 * @param title - The page title. Defaults to the title of the current document.
 */
export function GetPageKind(title: string = document.title): PageKind {
	switch (GetPageName(title)) {
		case PageTitles.TABLE:
			return PageKind.TABLE;
		case PageTitles.COMPARE_SOLVERS:
			return PageKind.COMPARE_SOLVERS;
		default:
			return PageKind.PLOT;
	}
}
