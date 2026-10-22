import {
	RegisterServiceWorker,
	RequestPWANotificationPermission,
	ShowPWANotification
} from "../Src/Scripts/PWA/PWA-utils";

type NotificationMock = jest.Mock & {
	permission: string;
	requestPermission: jest.Mock;
};

function SetGlobal(name: string, value: unknown): void {
	Object.defineProperty(globalThis, name, { value, configurable: true });
}

function RemoveGlobal(name: string): void {
	Reflect.deleteProperty(globalThis, name);
}

function CreateNotification(permission: string): NotificationMock {
	const notification = jest.fn() as NotificationMock;
	notification.permission = permission;
	notification.requestPermission = jest.fn(() => Promise.resolve("granted"));
	return notification;
}

/** Pretends that the app runs as an installed app, or in a browser tab. */
function SetInstalled(installed: boolean): void {
	SetGlobal("window", {
		matchMedia: (query: string): { matches: boolean } => ({
			matches: installed && query === "(display-mode: standalone)"
		}),
		addEventListener: jest.fn()
	});
}

let info: jest.SpyInstance;
let warn: jest.SpyInstance;
let error: jest.SpyInstance;

beforeEach(() => {
	info = jest.spyOn(console, "info").mockImplementation(() => {});
	warn = jest.spyOn(console, "warn").mockImplementation(() => {});
	error = jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
	jest.restoreAllMocks();
	RemoveGlobal("window");
	RemoveGlobal("navigator");
	RemoveGlobal("Notification");
});

describe("RegisterServiceWorker", () => {
	it("registers the service worker once the page is loaded", async () => {
		const register = jest.fn(() => Promise.resolve({ scope: "/" }));
		const addEventListener = jest.fn();
		SetGlobal("navigator", { serviceWorker: { register } });
		SetGlobal("window", { addEventListener });

		RegisterServiceWorker();

		expect(register).not.toHaveBeenCalled();
		expect(addEventListener).toHaveBeenCalledWith("load", expect.any(Function));
		addEventListener.mock.calls[0][1]();
		await Promise.resolve();
		await Promise.resolve();
		expect(register).toHaveBeenCalledWith("/service-worker.js");
		expect(info).toHaveBeenCalled();
	});

	it("only warns when the registration fails", async () => {
		const register = jest.fn(() => Promise.reject(new Error("no")));
		const addEventListener = jest.fn();
		SetGlobal("navigator", { serviceWorker: { register } });
		SetGlobal("window", { addEventListener });

		RegisterServiceWorker();
		addEventListener.mock.calls[0][1]();
		await new Promise((resolve) => setImmediate(resolve));

		expect(warn).toHaveBeenCalled();
	});

	it("does nothing in a browser without service workers", () => {
		const addEventListener = jest.fn();
		SetGlobal("navigator", {});
		SetGlobal("window", { addEventListener });

		RegisterServiceWorker();

		expect(addEventListener).not.toHaveBeenCalled();
	});
});

describe("RequestPWANotificationPermission", () => {
	it("does not ask in a browser tab", () => {
		SetInstalled(false);
		const notification = CreateNotification("default");
		SetGlobal("Notification", notification);

		RequestPWANotificationPermission();

		expect(notification.requestPermission).not.toHaveBeenCalled();
	});

	it("asks the user once in an installed app", async () => {
		SetInstalled(true);
		const notification = CreateNotification("default");
		SetGlobal("Notification", notification);
		(globalThis.window as unknown as Record<string, unknown>)["Notification"] =
			notification;

		RequestPWANotificationPermission();
		await Promise.resolve();
		await Promise.resolve();

		expect(notification.requestPermission).toHaveBeenCalledTimes(1);
		expect(info).toHaveBeenCalledWith("Notification permission granted.");
	});

	it("warns when the user does not grant the permission", async () => {
		SetInstalled(true);
		const notification = CreateNotification("default");
		notification.requestPermission.mockResolvedValue("denied");
		SetGlobal("Notification", notification);
		(globalThis.window as unknown as Record<string, unknown>)["Notification"] =
			notification;

		RequestPWANotificationPermission();
		await Promise.resolve();
		await Promise.resolve();

		expect(warn).toHaveBeenCalled();
	});

	it.each(["granted", "denied"])(
		"does not ask when the permission is already %s",
		(permission) => {
			SetInstalled(true);
			const notification = CreateNotification(permission);
			SetGlobal("Notification", notification);
			(globalThis.window as unknown as Record<string, unknown>)[
				"Notification"
			] = notification;

			RequestPWANotificationPermission();

			expect(notification.requestPermission).not.toHaveBeenCalled();
		}
	);

	it("reports a browser without notifications", () => {
		SetInstalled(true);

		RequestPWANotificationPermission();

		expect(error).toHaveBeenCalled();
	});
});

describe("ShowPWANotification", () => {
	function Install(permission: string): NotificationMock {
		SetInstalled(true);
		const notification = CreateNotification(permission);
		SetGlobal("Notification", notification);
		(globalThis.window as unknown as Record<string, unknown>)["Notification"] =
			notification;
		return notification;
	}

	it("shows the notification when it is allowed", () => {
		const notification = Install("granted");

		ShowPWANotification("Title", { body: "Body" });

		expect(notification).toHaveBeenCalledWith("Title", { body: "Body" });
	});

	it("warns when it is denied", () => {
		const notification = Install("denied");

		ShowPWANotification("Title", {});

		expect(notification).not.toHaveBeenCalled();
		expect(warn).toHaveBeenCalled();
	});

	it("shows nothing before the user has chosen", () => {
		const notification = Install("default");

		ShowPWANotification("Title", {});

		expect(notification).not.toHaveBeenCalled();
	});

	it("shows nothing in a browser tab", () => {
		SetInstalled(false);
		const notification = CreateNotification("granted");
		SetGlobal("Notification", notification);

		ShowPWANotification("Title", {});

		expect(notification).not.toHaveBeenCalled();
	});

	it("reports a browser without notifications", () => {
		SetInstalled(true);

		ShowPWANotification("Title", {});

		expect(error).toHaveBeenCalled();
	});
});
