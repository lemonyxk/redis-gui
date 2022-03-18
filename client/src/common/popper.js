import { Input } from "@material-ui/core";
import { Button, Paper } from "@mui/material";
import React, { Component } from "react";

class Popper extends Component {
	create() {
		return (
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					zIndex: 9999,
					width: window.innerWidth,
					height: window.innerHeight,
				}}
				onClick={(e) => {
					e.stopPropagation();
					this.props.onClose();
				}}
			>
				<div
					style={{
						position: "absolute",
						top: this.props.anchorEl.pageY + 150 > window.innerHeight ? window.innerHeight - 150 : this.props.anchorEl.pageY,
						left: this.props.anchorEl.pageX + 250 > window.innerWidth ? window.innerWidth - 250 : this.props.anchorEl.pageX,
						zIndex: 9999,
					}}
				>
					{this.props.children}
				</div>
			</div>
		);
	}

	render() {
		return this.props.open ? this.create() : null;
	}
}

export default Popper;
