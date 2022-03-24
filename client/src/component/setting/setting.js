import { Button, FormControl, Input, InputLabel } from "@material-ui/core";
import React, { Component } from "react";
import message from "../../tools/message";
import store from "../../tools/store";
import "./setting.scss";

class Setting extends Component {
	config = store.get("config");

	state = this.config;

	render() {
		return (
			<div className="setting">
				<div className="top">
					<div>
						<FormControl>
							<InputLabel variant="standard" htmlFor="uncontrolled-native">
								show number
							</InputLabel>
							<Input
								variant={"standard"}
								inputProps={{ id: "uncontrolled-native" }}
								style={{ width: "100%", height: 48 }}
								value={this.state.show}
								onChange={(e) => this.setState({ show: e.target.value })}
								autoComplete="off"
								spellCheck="false"
							/>
						</FormControl>

						<FormControl>
							<InputLabel variant="standard" htmlFor="uncontrolled-native">
								limit number
							</InputLabel>
							<Input
								variant={"standard"}
								inputProps={{ id: "uncontrolled-native" }}
								style={{ width: "100%", height: 48 }}
								value={this.state.limit}
								onChange={(e) => this.setState({ limit: e.target.value })}
								autoComplete="off"
								spellCheck="false"
							/>
						</FormControl>
					</div>
				</div>
				<div className="middle">
					<Button className="normal-button white-color" onClick={() => this.saveConfig()}>
						SAVE
					</Button>
				</div>
			</div>
		);
	}

	saveConfig() {
		this.state.show = parseInt(this.state.show);
		this.state.limit = parseInt(this.state.limit);

		if (!this.state.show) {
			return message.error("show number is required");
		}

		if (this.state.show > 20) {
			return message.error("show number must less than 20");
		}

		if (!this.state.limit) {
			return message.error("limit number is required");
		}

		store.set("config", this.state);

		message.success("save success");
	}
}

export default Setting;
