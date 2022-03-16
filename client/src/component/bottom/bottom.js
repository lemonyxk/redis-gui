import { Button, Paper } from "@material-ui/core";
import React, { Component } from "react";
import "./bottom.scss";
import "xterm/css/xterm.css";
import { Resizable } from "re-resizable";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { AttachAddon } from "xterm-addon-attach";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

class Bottom extends Component {
	componentDidMount() {
		this.open();
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
			theme: {
				foreground: "#333", //字体
				background: "#f8f8f8", //背景色
				cursor: "#000",
			},
			screenKeys: true,
			useStyle: true,
		});

		const fitAddon = new FitAddon();
		term.loadAddon(fitAddon);

		term.onTitleChange(function (title) {
			document.title = title;
		});

		var dom = document.getElementById("terminal-container");
		term.open(dom);

		const socket = new WebSocket(`ws://127.0.0.1:8669`);
		const attachAddon = new AttachAddon(socket);
		term.loadAddon(attachAddon);

		this.fit = fitAddon;
		this.term = term;

		socket.onopen = () => {
			this.socket = socket;
			this.onResize();
		};

		window.addEventListener("resize", () => this.onResize());
	}

	close() {
		this.term && this.term.dispose();
		this.socket && this.socket.close();
		window.removeEventListener("resize", () => this.onResize());
		this.term = null;
		this.socket = null;
	}

	componentWillUnmount() {
		this.close();
	}

	onResize() {
		this.fit.fit();
		requestAnimationFrame(() => this.socket.send(JSON.stringify({ cols: this.term.cols, rows: this.term.rows })));
	}

	ref = React.createRef();

	isToggle = false;

	state = {
		icon: <ArrowDropUpIcon />,
	};

	toggle() {
		if (this.isToggle) {
			this.ref.current.updateSize({ height: 48 });
			requestAnimationFrame(() => this.onResize());
			this.setState({ icon: <ArrowDropUpIcon /> });
			this.isToggle = false;
		} else {
			this.ref.current.updateSize({ height: 300 });
			requestAnimationFrame(() => this.onResize());
			this.setState({ icon: <ArrowDropDownIcon /> });
			this.isToggle = true;
		}
	}

	render() {
		return (
			<Resizable
				ref={this.ref}
				defaultSize={{ height: 48 }}
				minHeight={48}
				maxHeight={300}
				bounds=".index"
				enable={{ top: true }}
				// disableDragging={true}
				className="bottom"
				grid={[1, 2]}
				onResize={() => this.onResize()}
			>
				<Paper elevation={3} id="terminal-container" className="content full-width-height">
					<Button className="cli" onClick={() => this.toggle()}>
						{this.state.icon}
					</Button>
				</Paper>
			</Resizable>
		);
	}
}

export default Bottom;
