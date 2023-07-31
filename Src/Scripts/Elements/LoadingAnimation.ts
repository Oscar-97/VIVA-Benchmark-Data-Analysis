import { loaderContainer } from "./Elements";

/**
 * This function creates and displays a loading animation.
 *
 * @remarks
 * This function assumes the existence of a pre-defined element `loaderContainer` in your DOM.
 * The loading animation is implemented by creating a new `div` element with the class `loader`
 * and adding it as a child to `loaderContainer`.
 * The `loader` class should contain the styles and animations necessary for the loading animation.
 *
 * @example
 * LoadingAnimation(); // To start the loading animation
 */
export function LoadingAnimation(): void {
	const loader = document.createElement("div") as HTMLDivElement;
	loader.className = "loader";
	loaderContainer.innerHTML = "";
	loaderContainer.appendChild(loader);
	loaderContainer.style.display = "flex";
}
