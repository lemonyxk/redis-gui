import React, { Component } from "react";
import "./middle.scss";
import Lfet from "./left/left";
import Right from "./right/right";

class Middle extends Component {
	render() {
		return (
			<div className="middle">
				<Lfet></Lfet>
				<Right></Right>
			</div>
		);
	}
}

export default Middle;
