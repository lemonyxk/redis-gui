import React, { Component } from "react";
import { SwipeableDrawer } from "@material-ui/core";

export default class Draw extends Component {
	constructor(props) {
		super(props);
		this.anchor = props.anchor || "right";
	}

	render() {
		return (
			<SwipeableDrawer
				anchor={this.anchor}
				open={this.props.open}
				onOpen={() => this.props.onOpen && this.props.onOpen()}
				onClose={() => this.props.onClose && this.props.onClose()}
			>
				<div style={this.props.style}>{this.props.children}</div>
			</SwipeableDrawer>
		);
	}
}
