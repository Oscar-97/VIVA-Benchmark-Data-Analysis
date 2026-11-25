/**
 * The separators of numbers in a locale. The number fields and the charts of the browser use its locale, so the
 * text that the application writes uses it as well.
 */
export interface NumberSeparators {
	decimal: string;
	thousands: string;
}

/**
 * Formats a number as the locale does, for example 0,01 and 1 010 in Swedish and 0.01 and 1,010 in English.
 *
 * @param value - The number to format.
 * @param locale - The locale. The locale of the browser when it is not given.
 */
export function FormatNumber(value: number, locale?: string): string {
	return new Intl.NumberFormat(locale, { maximumFractionDigits: 20 }).format(
		value
	);
}

/**
 * The decimal and thousands separators of the locale.
 *
 * @param locale - The locale. The locale of the browser when it is not given.
 */
export function GetNumberSeparators(locale?: string): NumberSeparators {
	const parts = new Intl.NumberFormat(locale).formatToParts(1000.5);
	return {
		decimal: parts.find((part) => part.type === "decimal")?.value ?? ".",
		thousands: parts.find((part) => part.type === "group")?.value ?? ","
	};
}
