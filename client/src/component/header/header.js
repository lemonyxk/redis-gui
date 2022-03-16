import React, { Component } from "react";
import { AppBar, FormControl, IconButton, InputLabel, Paper, Select, Toolbar, MenuItem } from "@material-ui/core";
import { Button } from "@mui/material";
import { Menu as MenuIcon } from "@material-ui/icons";

import "./header.scss";
import Draw from "../../common/draw";
import Connection from "../../component/connection/connection";
import Log from "../../component/log/log";
import Setting from "../setting/setting";

class Header extends Component {
	state = {
		onOpenConnection: false,
		onOpenLog: false,
		onOpenSetting: false,
	};

	openConnection() {
		this.setState({ onOpenConnection: true });
	}

	closeConnection() {
		this.setState({ onOpenConnection: false });
	}

	openLog() {
		this.setState({ onOpenLog: true });
	}

	closeLog() {
		this.setState({ onOpenLog: false });
	}

	openSetting() {
		this.setState({ onOpenSetting: true });
	}

	closeSetting() {
		this.setState({ onOpenSetting: false });
	}

	render() {
		return (
			<div className="header">
				<Paper elevation={3} className="full-width-height">
					<AppBar position="static" className="appbar-background-color">
						<Toolbar variant="dense">
							<div className="left">
								<IconButton size="medium" edge="start" className="white-color">
									<MenuIcon />
								</IconButton>
							</div>

							<div className="right">
								<Button className="white-color" onClick={() => this.openConnection()}>
									connection
								</Button>
								<Button className="white-color" onClick={() => this.openSetting()}>
									setting
								</Button>
								<Button className="white-color" onClick={() => this.openLog()}>
									log
								</Button>
							</div>
						</Toolbar>
					</AppBar>
				</Paper>
				<Draw
					anchor="right"
					style={{
						width: "450px",
						height: "100%",
					}}
					open={this.state.onOpenConnection}
					onOpen={() => {}}
					onClose={() => this.closeConnection()}
				>
					<Connection />
				</Draw>

				<Draw
					anchor="right"
					style={{
						width: "800px",
						height: "100%",
					}}
					open={this.state.onOpenLog}
					onOpen={() => {}}
					onClose={() => this.closeLog()}
				>
					<Log />
				</Draw>

				<Draw
					anchor="right"
					style={{
						width: "500px",
						height: "100%",
					}}
					open={this.state.onOpenSetting}
					onOpen={() => {}}
					onClose={() => this.closeSetting()}
				>
					<Setting />
				</Draw>
			</div>
		);
	}
}

export default Header;
