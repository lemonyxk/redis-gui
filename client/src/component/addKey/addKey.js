import { Paper, Button } from "@material-ui/core";
import React, { Component } from "react";
import "./addKey.scss";
import { FormControl, InputLabel, Select, MenuItem, Input } from "@material-ui/core";
import { Comfirm } from "../../common/comfirm";
import message from "../../tools/message";
import event from "../../tools/event";
import Api from "../../tools/api";
import Left from "../../component/middle/left/left";

class AddKey extends Component {
	state = {
		type: "string",
		typeList: ["string", "list", "hash", "set", "zset", "stream"],
		key: "",
		value: "",
		hashKey: "",
		streamKey: "",
		score: "0",
		id: "*",
	};

	render() {
		return (
			<div className="addKey">
				<FormControl fullWidth>
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
						{this.state.typeList.map((item, index) => (
							<MenuItem key={index} value={item}>
								{item}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				{this.renderType()}
				<div className="actions">
					<Button className="error-button white-color" onClick={() => Comfirm.close()}>
						Cancel
					</Button>
					<Button className="success-button white-color" autoFocus onClick={() => this.submit()}>
						Submit
					</Button>
				</div>
			</div>
		);
	}

	renderType() {
		switch (this.state.type) {
			case "string":
				return this.string();
			case "list":
				return this.list();
			case "hash":
				return this.hash();
			case "set":
				return this.set();
			case "zset":
				return this.zset();
			case "stream":
				return this.stream();
			default:
				return this.state.type;
		}
	}

	key() {
		return (
			<FormControl fullWidth>
				<InputLabel variant="standard" htmlFor="uncontrolled-native">
					key
				</InputLabel>
				<Input
					variant={"standard"}
					inputProps={{ id: "uncontrolled-native" }}
					value={this.state.key}
					onChange={(e) => {
						this.setState({ key: e.target.value });
					}}
					autoComplete="off"
					spellCheck="false"
				/>
			</FormControl>
		);
	}

	value() {
		return (
			<FormControl fullWidth>
				<InputLabel variant="standard" htmlFor="uncontrolled-native">
					value
				</InputLabel>
				<Input
					variant={"standard"}
					inputProps={{ id: "uncontrolled-native" }}
					value={this.state.value}
					onChange={(e) => {
						this.setState({ value: e.target.value });
					}}
					autoComplete="off"
					spellCheck="false"
				/>
			</FormControl>
		);
	}

	hashKey() {
		return (
			<FormControl fullWidth>
				<InputLabel variant="standard" htmlFor="uncontrolled-native">
					hash key
				</InputLabel>
				<Input
					variant={"standard"}
					inputProps={{ id: "uncontrolled-native" }}
					value={this.state.hashKey}
					onChange={(e) => {
						this.setState({ hashKey: e.target.value });
					}}
					autoComplete="off"
					spellCheck="false"
				/>
			</FormControl>
		);
	}

	streamKey() {
		return (
			<FormControl fullWidth>
				<InputLabel variant="standard" htmlFor="uncontrolled-native">
					hash key
				</InputLabel>
				<Input
					variant={"standard"}
					inputProps={{ id: "uncontrolled-native" }}
					value={this.state.streamKey}
					onChange={(e) => {
						this.setState({ streamKey: e.target.value });
					}}
					autoComplete="off"
					spellCheck="false"
				/>
			</FormControl>
		);
	}

	score() {
		return (
			<FormControl fullWidth>
				<InputLabel variant="standard" htmlFor="uncontrolled-native">
					score
				</InputLabel>
				<Input
					variant={"standard"}
					inputProps={{ id: "uncontrolled-native" }}
					value={this.state.score}
					onChange={(e) => {
						this.setState({ score: e.target.value });
					}}
					autoComplete="off"
					spellCheck="false"
				/>
			</FormControl>
		);
	}

	id() {
		return (
			<FormControl fullWidth>
				<InputLabel variant="standard" htmlFor="uncontrolled-native">
					id
				</InputLabel>
				<Input
					variant={"standard"}
					inputProps={{ id: "uncontrolled-native" }}
					value={this.state.id}
					onChange={(e) => {
						this.setState({ id: e.target.value });
					}}
					autoComplete="off"
					spellCheck="false"
				/>
			</FormControl>
		);
	}

	string() {
		return (
			<>
				{this.key()}
				{this.value()}
			</>
		);
	}

	list() {
		return (
			<>
				{this.key()}
				{this.value()}
			</>
		);
	}

	set() {
		return (
			<>
				{this.key()}
				{this.value()}
			</>
		);
	}

	zset() {
		return (
			<>
				{this.key()}
				{this.score()}
				{this.value()}
			</>
		);
	}

	hash() {
		return (
			<>
				{this.key()}
				{this.hashKey()}
				{this.value()}
			</>
		);
	}

	stream() {
		return (
			<>
				{this.key()}
				{this.id()}
				{this.streamKey()}
				{this.value()}
			</>
		);
	}

	submit() {
		if (this.state.key === "") {
			message.error("Key is required");
		}

		switch (this.state.type) {
			case "string":
				return this.saveString();
			case "list":
				return this.saveList();
			case "hash":
				return this.saveHash();
			case "set":
				return this.saveSet();
			case "zset":
				return this.saveZset();
			case "stream":
				return this.saveStream();
			default:
				return;
		}
	}

	async saveString() {
		let cmd = ["SET", this.state.key, this.state.value];
		let res = await Api.do(cmd);
		Comfirm.close();

		if (res.code != 200) {
			return message.error(res.msg);
		}

		event.emitComponent(Left, "left-refresh", {});
		message.success("success");
	}

	async saveList() {
		let cmd = ["LPUSH", this.state.key, this.state.value];
		let res = await Api.do(cmd);
		Comfirm.close();

		if (res.code != 200) {
			return message.error(res.msg);
		}

		event.emitComponent(Left, "left-refresh", {});
		message.success("success");
	}

	async saveHash() {
		let cmd = ["HSET", this.state.key, this.state.hashKey, this.state.value];
		let res = await Api.do(cmd);
		Comfirm.close();

		if (res.code != 200) {
			return message.error(res.msg);
		}

		event.emitComponent(Left, "left-refresh", {});
		message.success("success");
	}

	async saveSet() {
		let cmd = ["SADD", this.state.key, this.state.value];
		let res = await Api.do(cmd);
		Comfirm.close();

		if (res.code != 200) {
			return message.error(res.msg);
		}

		event.emitComponent(Left, "left-refresh", {});
		message.success("success");
	}

	async saveZset() {
		this.state.score = parseFloat(this.state.score) || 0;

		let cmd = ["ZADD", this.state.key, this.state.score, this.state.value];
		let res = await Api.do(cmd);
		Comfirm.close();

		if (res.code != 200) {
			return message.error(res.msg);
		}

		event.emitComponent(Left, "left-refresh", {});
		message.success("success");
	}

	async saveStream() {
		let cmd = ["XADD", this.state.key, this.state.id, this.state.streamKey, this.state.value];
		let res = await Api.do(cmd);
		Comfirm.close();

		if (res.code != 200) {
			return message.error(res.msg);
		}

		event.emitComponent(Left, "left-refresh", {});
		message.success("success");
	}
}

export default AddKey;
