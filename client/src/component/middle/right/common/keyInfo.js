import { Input } from "@material-ui/core";
import { Button, Paper } from "@mui/material";
import React, { Component } from "react";
import "./keyInfo.scss";
import event from "../../../../tools/event";
import { Comfirm } from "../../../../common/comfirm";
import Api from "../../../../tools/api";
import message from "../../../../tools/message";
import Left from "../../left/left";
import Right from "../right";

class KeyInfo extends Component {
	state = {
		type: this.props.type,
		ttl: this.props.ttl,
		path: this.props.path,
		data: this.props.data,

		changePath: this.props.path,
	};

	componentDidMount() {}

	render() {
		return (
			<div className="key-info">
				<Paper className="paper">
					<div className="left">
						<Button variant="outlined" className="type">
							{this.state.type}
						</Button>
						<Button variant="outlined" className="ttl">
							{this.state.ttl}
						</Button>
						<Input
							className="path"
							variant={"standard"}
							inputProps={{ id: "uncontrolled-native" }}
							value={this.state.changePath}
							onChange={(e) => this.setState({ changePath: e.target.value })}
							autoComplete="off"
						/>
					</div>
					<div className="right">
						<Button variant="contained" className="rename success-button" onClick={() => this.rename()}>
							rename
						</Button>
						<Button variant="contained" className="ttl-b ttl-button" onClick={() => this.ttl()}>
							ttl
						</Button>
						<Button variant="contained" className="delete error-button" onClick={() => this.delete()}>
							delete
						</Button>
						<Button variant="contained" className="reload normal-button" onClick={() => this.reload()}>
							reload
						</Button>
					</div>
				</Paper>
			</div>
		);
	}

	reload() {
		event.emitComponent(Right, "right-reloadKey", this.state.data);
	}

	async delete() {
		Comfirm.open({
			width: "400px",
			height: "100px",
			title: "Delete Key",
			text: `Are you sure delete ${this.state.path} ?`,
			actions: (
				<div>
					<Button autoFocus onClick={() => Comfirm.close()}>
						cancel
					</Button>
					<Button
						autoFocus
						onClick={async () => {
							// delete redis key
							var cmd = ["DEL", this.state.path];
							var res = await Api.do(cmd);
							if (res.msg == "1") {
								event.emitComponent(Left, "left-deleteKey", this.state.data);
								event.emitComponent(Right, "right-closeKey", this.state.data);
								message.success("rename success");
							} else {
								message.error(res.msg);
							}
							Comfirm.close();
						}}
					>
						submit
					</Button>
				</div>
			),
		});
	}

	ttl() {
		var ttl = this.state.ttl;

		Comfirm.open({
			width: "400px",
			height: "100px",
			title: "TTL Key",
			text: (
				<div className="ttl-box">
					<div className="content">
						<Input
							className="ttl-input"
							variant={"standard"}
							inputProps={{ id: "uncontrolled-native" }}
							defaultValue={ttl}
							onChange={(e) => (ttl = e.target.value)}
							autoComplete="off"
						/>
					</div>
				</div>
			),
			actions: (
				<div className="actions">
					<Button onClick={() => Comfirm.close()}>Cancel</Button>
					<Button
						onClick={async () => {
							var cmd = ["EXPIRE", this.state.path, ttl];
							if (ttl == -1) {
								cmd = ["PERSIST", this.state.path];
							}
							let res = await Api.do(cmd);
							if (res.msg == 1) {
								message.success("ttl set success");
								this.setState({ ttl: ttl });
							}
							Comfirm.close();
						}}
					>
						Submit
					</Button>
				</div>
			),
		});
	}

	rename() {
		Comfirm.open({
			width: "400px",
			height: "100px",
			title: "Rename Key",
			text: `Are you sure rename ${this.state.path} to ${this.state.changePath}?`,
			actions: (
				<div>
					<Button autoFocus onClick={() => Comfirm.close()}>
						cancel
					</Button>
					<Button
						autoFocus
						onClick={async () => {
							// rename redis key
							if (this.state.changePath == this.state.path) {
								message.error("no change");
								Comfirm.close();
								return;
							}
							var cmd = ["RENAME", this.state.path, this.state.changePath];
							let res = await Api.do(cmd);
							if (res.msg == "OK") {
								event.emitComponent(Right, "right-closeKey", this.state.data);
								event.emitComponent(Left, "left-refresh", { ...this.state.data, changePath: this.state.changePath });
								message.success("rename success");
							} else {
								message.error(res.msg);
							}
							Comfirm.close();
						}}
					>
						submit
					</Button>
				</div>
			),
		});
	}
}

export default KeyInfo;
