import "./cli.scss";
import "xterm/css/xterm.css";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { AttachAddon } from "xterm-addon-attach";
import themeJS from "../../theme/theme";
const themes = require("../../theme/theme.json");
import store from "../../tools/store";
import { Comfirm } from "../../common/comfirm";
import event from "../../tools/event";

class Cli {
	openCli() {
		Comfirm.open({
			autoClose: true,
			width: 900,
			height: 500,
			style: { border: "none", padding: 0 },
			text: <div id="terminal-container"></div>,
			onOpen: () => {
				requestAnimationFrame(() => this.open());
			},
			onClose: () => {
				requestAnimationFrame(() => this.close());
			},
		});
	}

	open() {
		const term = new Terminal({
			rendererType: "canvas", //渲染类型
			// rows: 40, //行数
			// cols: 200, // 不指定行数，自动回车后光标从下一行开始
			convertEol: true, //启用时，光标将设置为下一行的开头
			// scrollback: 50, //终端中的回滚量
			disableStdin: false, //是否应禁用输入
			// cursorStyle: "underline", //光标样式
			cursorBlink: true, //光标闪烁
			lineHeight: themes[themeJS.themeName]["--terminal-line-height"], //行高
			cursorWidth: 1, //光标宽度
			tabStopWidth: 4, //tab宽度
			cursorStyle: "block", //光标样式
			fontSize: themes[themeJS.themeName]["--terminal-font-size"], //字体大小
			fontFamily: themes[themeJS.themeName]["--terminal-font-family"], //字体
			allowTransparency: true, //是否允许透明
			theme: {
				foreground: themes[themeJS.themeName]["--terminal-foreground"], //字体
				background: themes[themeJS.themeName]["--terminal-background"], //背景色
				cursor: themes[themeJS.themeName]["--terminal-cursor"], //光标颜色
			},
		});

		const fitAddon = new FitAddon();
		term.loadAddon(fitAddon);

		term.onTitleChange(function (title) {
			document.title = title;
		});

		var dom = document.getElementById("terminal-container");
		term.open(dom);

		const socket = new WebSocket(`ws://127.0.0.1:8669?token=${store.get("token")}&uuid=${store.get("uuid")}`);
		const attachAddon = new AttachAddon(socket);
		term.loadAddon(attachAddon);

		this.fit = fitAddon;
		this.term = term;

		socket.onopen = () => {
			this.socket = socket;
			this.onResize();
			this.term.focus();
			this.t = setInterval(() => {
				this.socket.send("");
			}, 1000);
		};

		event.add("resize", this.bindResize);
	}

	bindResize = this.onResize.bind(this);

	onResize(data) {
		this.window = data;
		this.onResize();
	}

	close() {
		event.remove("resize", this.bindResize);
		clearInterval(this.t);
		this.term && this.term.dispose();
		this.socket && this.socket.close();
		this.term = null;
		this.socket = null;
	}

	onResize() {
		this.fit && this.fit.fit();
		requestAnimationFrame(() => this.socket && this.socket.send(JSON.stringify({ cols: this.term.cols, rows: this.term.rows })));
	}

	window = store.get("window");
	token = store.get("token");
	uuid = store.get("uuid");
}

const cli = new Cli();

export default cli;
