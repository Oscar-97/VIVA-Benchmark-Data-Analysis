import { LoaderContainer } from "./Elements";

export function LoadingAnimation(): void {
	const Loader = document.createElement("div") as HTMLDivElement;
	Loader.className = "loader";
	LoaderContainer.innerHTML = "";
	LoaderContainer.appendChild(Loader);
	LoaderContainer.style.display = "flex";
}
