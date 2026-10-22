import * as fs from "fs";
import * as path from "path";

const root = path.resolve(__dirname, "..");

interface ManifestImage {
	src: string;
	sizes: string;
}

interface Manifest {
	start_url: string;
	icons: ManifestImage[];
	screenshots: ManifestImage[];
	shortcuts: { url: string; icons: ManifestImage[] }[];
}

const manifest = JSON.parse(
	fs.readFileSync(path.join(root, "manifest.json"), "utf8")
) as Manifest;

/**
 * Reads the width and height from the header of a PNG file.
 */
function ReadPngSize(file: string): string {
	const header = fs.readFileSync(path.join(root, file));
	return `${header.readUInt32BE(16)}x${header.readUInt32BE(20)}`;
}

describe("Manifest", () => {
	const images = [
		...manifest.icons,
		...manifest.screenshots,
		...manifest.shortcuts.flatMap((shortcut) => shortcut.icons)
	];

	it.each(images.map((image) => [image.src, image.sizes]))(
		"should have the file and the size of the image %s",
		(src, sizes) => {
			expect(fs.existsSync(path.join(root, String(src)))).toBe(true);
			expect(ReadPngSize(String(src))).toBe(sizes);
		}
	);

	it("should open pages that exist", () => {
		const urls = [
			manifest.start_url,
			...manifest.shortcuts.map((shortcut) => shortcut.url)
		];
		for (const url of urls) {
			expect(fs.existsSync(path.join(root, url))).toBe(true);
		}
	});
});
