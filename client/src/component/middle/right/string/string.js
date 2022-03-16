import React, { Component } from "react";
import "./string.scss";
import { FormControl, Input, InputLabel, MenuItem, Select } from "@material-ui/core";
import axios from "axios";
import KeyInfo from "../common/keyInfo";
import { Button, Paper } from "@mui/material";
import Api from "../../../../tools/api";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import message from "../../../../tools/message";

class String extends Component {
	constructor(props) {
		super(props);
	}

	state = {
		ttl: -2,
		res: null,
		resType: "text",
		size: -1,
	};

	componentDidMount() {
		this.init();
	}

	async init() {
		this.getTTL(this.props.path);
		this.getString(this.props.path);
	}

	async getSize(key) {
		var size = this.state.res.length;
		this.setState({ size: size });
	}

	async getTTL(key) {
		let res = await Api.do(["TTL", key]);
		this.setState({ ttl: res.msg });
	}

	async getString(key) {
		let res = await Api.do(["GET", key]);
		this.value = res.msg;
		this.setState({ res: res.msg }, () => this.getSize(key));
	}

	value = "";
	async saveString() {
		if (this.value == this.state.res) {
			message.error("no change");
			return;
		}
		let res = await Api.do(["SET", this.props.path, this.value]);
		if (res.msg === "OK") {
			this.setState({ res: this.value }, () => this.getSize(this.props.path));
			message.success("save success");
		} else {
			message.error(res.msg);
		}
	}

	render() {
		return (
			<div className="string">
				<div className="top">
					{this.state.ttl !== -2 ? (
						<KeyInfo type={this.props.type} data={this.props.data} path={this.props.path} ttl={this.state.ttl}></KeyInfo>
					) : null}
				</div>
				<div className="middle">
					<Paper className="paper">
						<div className="top">
							<Paper className="paper">
								<Button variant="outlined" className="size">
									{this.state.size}
								</Button>
								<Select
									className="resType"
									variant={"standard"}
									inputProps={{ id: "uncontrolled-native" }}
									value={this.state.resType}
									onChange={(e) => this.setState({ resType: e.target.value })}
								>
									<MenuItem key={"text"} value={"text"}>
										text
									</MenuItem>
									<MenuItem key={"json"} value={"json"}>
										json
									</MenuItem>
								</Select>
							</Paper>
						</div>
						<div className="middle">
							<div className="paper">
								<div className="res">
									<Paper elevation={3} className="top">
										<TextareaAutosize
											onChange={(e) => (this.value = e.target.value)}
											className="string-content none-scrollbar"
											defaultValue={this.state.res || ""}
											spellCheck={false}
										/>
									</Paper>
									<div className="middle">
										<div className="left"></div>
										<div className="right">
											<Button variant="contained" className="save save-button" onClick={() => this.saveString()}>
												save
											</Button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Paper>
				</div>
			</div>
		);
	}
}

export default String;
