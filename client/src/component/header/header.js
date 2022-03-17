import React, { Component } from "react";
import { AppBar, FormControl, IconButton, InputLabel, Paper, Select, Toolbar, MenuItem, Menu, MenuList } from "@material-ui/core";
import { Button } from "@mui/material";
import { Menu as MenuIcon } from "@material-ui/icons";

import "./header.scss";
import Draw from "../../common/draw";
import Connection from "../../component/connection/connection";
import Log from "../../component/log/log";
import Setting from "../setting/setting";

import cli from "../cli/cli";
import client from "../client/client";
import memory from "../memory/memory";
import network from "../network/network";
import query from "../query/query";

class Header extends Component {
	state = {
		onOpenConnection: false,
		onOpenLog: false,
		onOpenSetting: false,
		onOpenMonitor: false,
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

	openMonitor(e) {
		this.setState({ onOpenMonitor: true });
		this.anchorEl = e.currentTarget;
	}

	closeMonitor() {
		this.setState({ onOpenMonitor: false });
		this.anchorEl = null;
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
								<Button className="white-color" onClick={(e) => this.openMonitor(e)}>
									monitor
								</Button>
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
				<Menu
					id="basic-menu"
					anchorEl={this.anchorEl}
					open={this.state.onOpenMonitor}
					onClose={() => this.closeMonitor()}
					MenuListProps={{
						"aria-labelledby": "basic-button",
					}}
				>
					<MenuItem>
						<Button variant="contained" className="network-button" onClick={() => network.openCli()}>
							network info
						</Button>
					</MenuItem>
					<MenuItem>
						<Button variant="contained" className="query-button" onClick={() => query.openCli()}>
							query info
						</Button>
					</MenuItem>
					<MenuItem>
						<Button variant="contained" className="memory-button" onClick={() => memory.openCli()}>
							memory info
						</Button>
					</MenuItem>
					<MenuItem>
						<Button variant="contained" className="client-button" onClick={() => client.openCli()}>
							client info
						</Button>
					</MenuItem>
					<MenuItem>
						<Button variant="contained" className="cli-button" onClick={() => cli.openCli()}>
							open terminal
						</Button>
					</MenuItem>
				</Menu>
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
