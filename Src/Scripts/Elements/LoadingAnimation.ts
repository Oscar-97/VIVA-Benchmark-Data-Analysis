import { loaderContainer } from "./Elements";

export function LoadingAnimation(): void {
	const loader = document.createElement("div") as HTMLDivElement;
	loader.className = "loader";
	loaderContainer.innerHTML = "";
	loaderContainer.appendChild(loader);
	loaderContainer.style.display = "flex";
}
