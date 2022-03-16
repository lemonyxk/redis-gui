import React, { Component } from "react";
import Button from "@mui/material/Button";
import "./connection.scss";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ConnectedTvIcon from "@mui/icons-material/ConnectedTv";
import CustomizedDialogs from "../../common/dialog";
import Add from "./add";
import message from "../../tools/message";
import { Comfirm } from "../../common/comfirm";
import event from "../../tools/event";
import store from "../../tools/store";
import { Checkbox } from "@material-ui/core";
import Index from "../../pages/index";

class Connection extends Component {
	connections = store.get("connections") || [];
	connected = store.get("connected") || "";

	state = {
		openDialog: false,
		connections: this.connections,
	};

	modal = React.createRef();

	default = {};

	setDefault(item, index, checked) {
		this.connections.forEach((element) => (element.checked = false));
		item.checked = checked;
		this.connections[index] = item;
		this.setState({ connections: this.state.connections });
		store.set("connections", this.connections);
	}

	render() {
		return (
			<div className="connection">
				<Button className="header">connections</Button>
				<div className="middle">
					{this.state.connections.map((item, index) => (
						<div className="connection-list" key={item.name}>
							{this.connected === item.name ? (
								<>
									<div className="left">
										<div>
											<Button className="transparent-button">{item.name}</Button>
										</div>
									</div>
									<div className="right">
										<Button onClick={() => this.connect(item)} className="normal-color">
											<ConnectedTvIcon />
										</Button>
										<Button className="warning-color" onClick={() => this.editConnection(item, index)}>
											<EditIcon />
										</Button>
										<Button className="error-color" onClick={() => this.deleteConnection(item, index)}>
											<DeleteIcon />
										</Button>
										<Button>
											<Checkbox
												className="normal-color"
												title="set as default"
												checked={!!item.checked}
												onChange={(e) => this.setDefault(item, index, e.target.checked)}
											/>
										</Button>
									</div>
								</>
							) : (
								<>
									<div className="left">
										<div>
											<Button className="black-color" style={{ fontSize: 16 }}>
												{item.name}
											</Button>
										</div>
									</div>
									<div className="right">
										<Button className="black-color" onClick={() => this.connect(item)}>
											<ConnectedTvIcon />
										</Button>
										<Button className="black-color" onClick={() => this.editConnection(item, index)}>
											<EditIcon />
										</Button>
										<Button className="black-color" onClick={() => this.deleteConnection(item, index)}>
											<DeleteIcon />
										</Button>
										<Button className="black-color">
											<Checkbox
												className="black-color"
												title="set as default"
												checked={!!item.checked}
												onChange={(e) => this.setDefault(item, index, e.target.checked)}
											/>
										</Button>
									</div>
								</>
							)}
						</div>
					))}
				</div>
				<div className="bottom">
					<Button style={{ width: "100%" }} variant="contained" className="normal-button" onClick={() => this.openDialog("add")}>
						Add Connection
					</Button>
				</div>

				{this.state.openDialog ? this.addConnection() : null}
			</div>
		);
	}

	openDialog(action) {
		this.action = action;
		this.setState({ openDialog: true });
	}

	closeDialog() {
		this.action = "";
		this.setState({ openDialog: false });
	}

	config = null;
	configIndex = -1;
	action = "";

	connect(item) {
		event.emitComponent(Index, "connect", item);

		event.addComponentListener(Connection, "connected", (data) => {
			this.connected = item.name;
			store.set("connected", this.connected);
			this.setState({ connections: this.connections });
		});
	}

	editConnection(item, index) {
		this.config = item;
		this.configIndex = index;
		this.openDialog("edit");
	}

	deleteConnection(item, index) {
		Comfirm.open({
			width: "400px",
			height: "100px",
			title: "Delete Connection",
			text: `Are you sure delete ${item.name} ?`,
			actions: (
				<div>
					<Button autoFocus onClick={() => Comfirm.close()}>
						cancel
					</Button>
					<Button
						autoFocus
						onClick={async () => {
							this.config = item;
							this.configIndex = index;
							this.connections.splice(index, 1);

							store.set("connections", this.connections);

							this.setState({ connections: this.connections });

							message.success("Connection deleted");

							Comfirm.close();
						}}
					>
						submit
					</Button>
				</div>
			),
		});
	}

	createConnection() {
		var data = this.modal.current.submit();

		if (!data.name) return message.error("Please input connection name");

		for (let i = 0; i < this.connections.length; i++) {
			const element = this.connections[i];
			if (element.name === data.name) {
				if (this.action === "add") {
					return message.error("The connection name already exists");
				}
			}
		}

		data.addr = data.addr.filter((item) => item.host && item.port);
		if (data.addr.length === 0) return message.error("Please input connection address");

		data.db = data.db || 0;

		if (data.type !== "client") {
			if (!data.masterName) return message.error("Please input master name");
		}

		if (this.action === "add") {
			this.connections = [...this.connections, data];
		}

		if (this.action === "edit") {
			this.connections[this.configIndex] = data;
		}

		store.set("connections", this.connections);

		this.setState({ connections: this.connections });

		this.closeDialog();

		return message.success("Create connection success");
	}

	addConnection() {
		return (
			<CustomizedDialogs
				// onClose={() => this.closeDialog()}
				// title={"Add Connection"}
				width={400}
				height={600}
				content={
					<div className="dialog-content">
						<Add ref={this.modal} config={this.config}></Add>
					</div>
				}
				actions={
					<div className="dialogs-actions">
						<Button className="error-color" onClick={() => this.closeDialog()}>
							Cancel
						</Button>
						<Button onClick={() => this.createConnection()}>Submit</Button>
					</div>
				}
			/>
		);
	}
}

export default Connection;
