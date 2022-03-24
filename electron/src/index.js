const { app, BrowserWindow, screen, Menu } = require("electron");
const path = require("path");
const child = require("child_process");
const Store = require("electron-store");
const fs = require("fs");

Store.initRenderer();

var lock = path.join(__dirname, "lock");
var lockServer = path.join(__dirname, "lock_server");

class Main {
	server = null;
	dev = !!process.env.NODE_ENV;

	mainWindow = null;

	kill(pid, callback = () => {}) {
		if (process.platform === "win32") {
			child.exec(`taskkill /T /F /PID ${pid}`, () => callback());
		} else {
			child.exec(`kill -9 ${pid}`, () => callback());
		}
	}

	closeServer(callback) {
		if (!this.server) return callback();

		var pid = 0;

		if (fs.existsSync(lockServer)) {
			pid = fs.readFileSync(lockServer, "utf-8");
			fs.unlinkSync(lockServer);

			this.kill(pid, callback);
		}

		if (this.server.pid != pid) {
			this.kill(this.server.pid, callback);
		}

		fs.unlinkSync(lock);
	}

	startServer() {
		if (!this.dev) {
			if (process.platform === "win32") {
				this.server = child.spawn(path.join(__dirname, "/windows-server/server.exe"), {
					stdio: "pipe",
				});
			} else {
				this.server = child.exec(path.join(__dirname, "/mac-server/server"), {
					stdio: "pipe",
				});
			}

			this.server.stdout.on("data", (data) => {
				console.log(data);
			});

			this.server.on("error", (err) => console.log(err));

			fs.writeFileSync(lockServer, `${this.server.pid}`);
		}
	}

	restart() {
		fs.unlinkSync(lock);
		app.relaunch();
		this.quit();
	}

	checkSingle() {
		if (fs.existsSync(lock)) {
			return false;
		}
		fs.writeFileSync(lock, `${process.pid}`);
		return true;
	}

	lisnten() {
		// This method will be called when Electron has finished
		// initialization and is ready to create browser windows.
		// Some APIs can only be used after this event occurs.
		app.on("ready", () => {
			// const ret = globalShortcut.register("CommandOrControl+P", () => {
			// 	if (this.mainWindow.webContents.isDevToolsOpened()) {
			// 		this.mainWindow.webContents.closeDevTools();
			// 	} else {
			// 		this.mainWindow.webContents.openDevTools();
			// 	}
			// });

			// // 检查快捷键是否注册成功
			// console.log(globalShortcut.isRegistered("CommandOrControl+P"));

			console.log("main pid", process.pid);
			if (this.server) console.log("child pid", this.server.pid);

			this.createWindow();
		});

		// Quit when all windows are closed.
		app.on("window-all-closed", () => {
			console.log("on window-all-closed");
			// On OS X it is common for applications and their menu bar
			// to stay active until the user quits explicitly with Cmd + Q
			// if (process.platform !== "darwin") {}
			this.quit();
		});

		app.on("activate", () => {
			console.log("on activate");
			// On OS X it's common to re-create a window in the app when the
			// dock icon is clicked and there are no other windows open.
			if (BrowserWindow.getAllWindows().length === 0) {
				this.createWindow();
			}
		});
	}

	createWindow() {
		// Create the browser window.
		let size = screen.getPrimaryDisplay().size;
		let width = size.width * 0.8;
		let height = size.height * 0.8;

		if (width < 900) {
			width = size.width * 0.9;
			height = size.height * 0.9;
		}

		if (width < 900) width = 900;
		if (height < 600) height = 600;

		// fix windos size
		width = parseInt(width);
		height = parseInt(height);

		this.mainWindow = new BrowserWindow({
			width: this.dev ? size.width * 1 : width,
			height: this.dev ? size.height * 1 : height,
			minWidth: width,
			minHeight: height,
			icon: path.join(__dirname, "redis.icns"),

			show: false,
			// transparent: true,
			// titleBarStyle: "default",
			// frame: false,

			webPreferences: {
				nodeIntegration: true,
				enableRemoteModule: true,
				contextIsolation: false,
			},
		});

		// this.mainWindow.webContents.on("ready-to-show", () => {
		// 	console.log("ready-to-show");
		// 	this.mainWindow.show();
		// });

		this.mainWindow.on("close", () => {
			console.log("close");
			this.mainWindow.hide();
		});

		this.mainWindow.webContents.on("dom-ready", () => {
			console.log("dom-ready");
			this.mainWindow.show();
		});

		// and load the index.html of the app.
		if (this.dev) {
			this.mainWindow.loadURL("http://127.0.0.1:3000");
		} else {
			this.mainWindow.loadFile(path.join(__dirname, "/dist/index.html"));
		}

		// Open the DevTools.
		if (this.dev) this.mainWindow.webContents.openDevTools();
	}

	quit() {
		this.closeServer(() => app.quit());
	}

	start() {
		if (!this.checkSingle()) {
			this.quit();
			return;
		}

		this.startServer();

		if (process.platform === "darwin") {
			const template = [
				{
					label: "Application",
					submenu: [
						{
							label: "Quit",
							accelerator: "Command+Q",
							click: () => this.quit(),
						},
					],
				},
				{
					label: "Edit",
					submenu: [
						{ label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
						{ label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
						{ type: "separator" },
						{ label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
						{ label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
						{ label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
						{ label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" },
					],
				},
				{
					label: "Dev",
					submenu: [{ label: "Open Dev Tools", role: "toggleDevTools" }],
				},
			];
			Menu.setApplicationMenu(Menu.buildFromTemplate(template));
		} else {
			Menu.setApplicationMenu(null);
		}

		app.allowRendererProcessReuse = true;

		this.lisnten();
	}
}

const main = new Main();

main.start();
