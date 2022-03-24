import React, { Component } from "react";
import { FormControl, InputLabel, Select, MenuItem, Input } from "@material-ui/core";
import "./add.scss";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import message from "../../tools/message";

class Add extends Component {
	constructor(props) {
		super(props);
	}

	state = this.props.config || {
		name: "default",
		type: "client",
		masterName: "",
		addr: [{ host: "", port: "" }],
		password: "",
		split: ":",
		db: 0,
	};

	render() {
		return (
			<div className="add">
				<div className="name">
					<FormControl fullWidth style={{ width: "100%", height: 48 }}>
						<InputLabel variant="standard" htmlFor="uncontrolled-native">
							name
						</InputLabel>
						<Input
							variant={"standard"}
							inputProps={{ id: "uncontrolled-native" }}
							style={{ width: "100%", height: 48 }}
							value={this.state.name}
							onChange={(e) => this.setState({ name: e.target.value })}
							autoComplete="off"
							spellCheck="false"
						/>
					</FormControl>
				</div>
				<div className="type">
					<FormControl fullWidth style={{ width: "100%", height: 48 }}>
						<InputLabel variant="standard" htmlFor="uncontrolled-native">
							type
						</InputLabel>
						<Select
							variant={"standard"}
							inputProps={{ id: "uncontrolled-native" }}
							style={{ width: "100%", height: 48 }}
							value={this.state.type}
							onChange={(e) => this.setState({ type: e.target.value })}
						>
							<MenuItem key={"client"} value={"client"}>
								client
							</MenuItem>
							<MenuItem key={"sentinel"} value={"sentinel"}>
								sentinel
							</MenuItem>
							<MenuItem key={"cluster"} value={"cluster"}>
								cluster
							</MenuItem>
						</Select>
					</FormControl>
				</div>
				<div className="master-name">
					<FormControl fullWidth style={{ width: "100%", height: 48 }}>
						<InputLabel variant="standard" htmlFor="uncontrolled-native">
							master name
						</InputLabel>
						<Input
							variant={"standard"}
							inputProps={{ id: "uncontrolled-native" }}
							style={{ width: "100%", height: 48 }}
							value={this.state.masterName}
							onChange={(e) => this.setState({ masterName: e.target.value })}
							autoComplete="off"
							spellCheck="false"
						/>
					</FormControl>
				</div>
				<div className="addr">
					<div className="left">
						<div className="addr-add" onClick={() => this.addAddr()}>
							<AddIcon />
						</div>
					</div>
					<div className="right">
						{this.state.addr.map((item, index) => (
							<div key={index}>
								<FormControl fullWidth style={{ width: "70%", height: 48 }}>
									<InputLabel variant="standard" htmlFor="uncontrolled-native">
										host
									</InputLabel>
									<Input
										variant={"standard"}
										inputProps={{ id: "uncontrolled-native" }}
										style={{ width: "100%", height: 48 }}
										value={this.state.addr[index].host}
										onChange={(e) => {
											this.state.addr[index].host = e.target.value;
											this.setState({ addr: this.state.addr });
										}}
										autoComplete="off"
										spellCheck="false"
									/>
								</FormControl>
								<FormControl fullWidth style={{ width: "30%", height: 48 }}>
									<InputLabel variant="standard" htmlFor="uncontrolled-native">
										port
									</InputLabel>
									<Input
										variant={"standard"}
										inputProps={{ id: "uncontrolled-native" }}
										style={{ width: "100%", height: 48 }}
										value={this.state.addr[index].port}
										onChange={(e) => {
											this.state.addr[index].port = e.target.value;
											this.setState({ addr: this.state.addr });
										}}
										autoComplete="off"
										spellCheck="false"
									/>
								</FormControl>
								<div className="addr-delete" onClick={() => this.removeAddr(index)}>
									<DeleteIcon />
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="password">
					<FormControl fullWidth style={{ width: "100%", height: 48 }}>
						<InputLabel variant="standard" htmlFor="uncontrolled-native">
							password
						</InputLabel>
						<Input
							variant={"standard"}
							inputProps={{ id: "uncontrolled-native" }}
							style={{ width: "100%", height: 48 }}
							value={this.state.password}
							onChange={(e) => this.setState({ password: e.target.value })}
							autoComplete="off"
							spellCheck="false"
						/>
					</FormControl>
				</div>

				<div className="split">
					<FormControl fullWidth style={{ width: "100%", height: 48 }}>
						<InputLabel variant="standard" htmlFor="uncontrolled-native">
							split
						</InputLabel>
						<Input
							variant={"standard"}
							inputProps={{ id: "uncontrolled-native" }}
							style={{ width: "100%", height: 48 }}
							value={this.state.split}
							onChange={(e) => this.setState({ split: e.target.value })}
							autoComplete="off"
							spellCheck="false"
						/>
					</FormControl>
				</div>

				<div className="db">
					<FormControl fullWidth style={{ width: "100%", height: 48 }}>
						<InputLabel variant="standard" htmlFor="uncontrolled-native">
							db
						</InputLabel>
						<Input
							variant={"standard"}
							inputProps={{ id: "uncontrolled-native" }}
							style={{ width: "100%", height: 48 }}
							value={this.state.db}
							onChange={(e) => this.setState({ db: e.target.value })}
							autoComplete="off"
							spellCheck="false"
						/>
					</FormControl>
				</div>
			</div>
		);
	}

	addAddr() {
		this.state.addr.push({ host: "", port: "" });
		this.setState({ addr: this.state.addr });
	}

	removeAddr(index) {
		if (this.state.addr.length < 2) {
			return message.error("addr list must have at least one addr");
		}
		this.state.addr.splice(index, 1);
		this.setState({ addr: this.state.addr });
	}

	submit() {
		this.state.db = parseInt(this.state.db) || 0;
		return JSON.parse(JSON.stringify(this.state));
	}
}

export default Add;
