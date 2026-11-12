/**
 * Splits a text into lines of at most the given number of characters, at the spaces. A word that is longer than a
 * line is kept whole. Chart.js squeezes a line that does not fit the chart, so a long subtitle is given as lines.
 *
 * @param text - The text.
 * @param maxCharacters - The most characters in a line.
 * @returns The lines. A text that fits is a single line.
 */
export function WrapText(text: string, maxCharacters: number): string[] {
	const lines: string[] = [];
	let line = "";
	for (const word of text.split(/\s+/).filter((part) => part !== "")) {
		if (line !== "" && line.length + 1 + word.length > maxCharacters) {
			lines.push(line);
			line = word;
		} else {
			line = line === "" ? word : `${line} ${word}`;
		}
	}
	if (line !== "") {
		lines.push(line);
	}
	return lines.length > 0 ? lines : [text];
}
