import { Paper, Button } from "@material-ui/core";
import React, { Component } from "react";
import "./bottom.scss";

class Bottom extends Component {
	render() {
		return (
			<div className="bottom">
				<Paper elevation={3} className="content full-width-height"></Paper>
			</div>
		);
	}
}

export default Bottom;
