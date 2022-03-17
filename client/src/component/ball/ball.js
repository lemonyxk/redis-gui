import React, { Component } from "react";
import "./ball.scss";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { Rnd } from "react-rnd";
import store from "../../tools/store";
import { Comfirm } from "../../common/comfirm";

class Ball extends Component {
	window = store.get("window");

	ballSize = 40;
	initSpeed = 30;

	state = {
		x: 12,
		y: this.window.height - this.ballSize - 12 - 120,
	};

	onDragStop(e, d) {
		var cx = d.x;
		var cy = d.y;

		if (d.x < 12) d.x = 12;
		if (d.x > this.window.width - this.ballSize - 12) d.x = this.window.width - this.ballSize - 12;

		if (d.y < 12) d.y = 12;
		if (d.y > this.window.height - this.ballSize - 12) d.y = this.window.height - this.ballSize - 12;

		var m = "";
		if (d.x < this.window.width / 2) {
			if (d.y < this.window.height / 2) {
				if (d.x < d.y) {
					d.x = 12;
					m = "x";
				} else {
					d.y = 12;
					m = "y";
				}
			} else {
				if (d.x < this.window.height - d.y) {
					d.x = 12;
					m = "x";
				} else {
					d.y = this.window.height - this.ballSize - 12;
					m = "y";
				}
			}
		} else {
			if (d.y < this.window.height / 2) {
				if (this.window.width - d.x < d.y) {
					d.x = this.window.width - this.ballSize - 12;
					m = "x";
				} else {
					d.y = 12;
					m = "y";
				}
			} else {
				if (this.window.width - d.x < this.window.height - d.y) {
					d.x = this.window.width - this.ballSize - 12;
					m = "x";
				} else {
					d.y = this.window.height - this.ballSize - 12;
					m = "y";
				}
			}
		}

		var add = 0;

		if (m == "x") {
			var mx = cx - d.x;
			if (mx > 0) {
				add = -this.initSpeed;
			} else {
				add = this.initSpeed;
			}

			var fn = () => {
				requestAnimationFrame(() => {
					cx += add;
					if (add > 0) {
						if (cx > d.x) cx = d.x;
					} else {
						if (cx < d.x) cx = d.x;
					}
					this.setState({ x: cx, y: d.y }, () => {
						if (cx == d.x) return;
						fn();
					});
				});
			};

			fn();
		} else {
			var my = cy - d.y;
			if (my > 0) {
				add = -this.initSpeed;
			} else {
				add = this.initSpeed;
			}

			var fn = () => {
				requestAnimationFrame(() => {
					cy += add;
					if (add > 0) {
						if (cy > d.y) cy = d.y;
					} else {
						if (cy < d.y) cy = d.y;
					}
					this.setState({ x: d.x, y: cy }, () => {
						if (cy == d.y) return;
						fn();
					});
				});
			};

			fn();
		}
	}

	onClick() {
		Comfirm.open({
			title: "Add Key",
		});
	}

	render() {
		return (
			<Rnd
				position={{ x: this.state.x, y: this.state.y }}
				onDragStop={(e, d) => this.onDragStop(e, d)}
				onDrag={(e, d) => this.onDrag(e, d)}
				enableResizing={false}
				className="ball"
			>
				<Fab aria-label="add" onClick={() => this.onClick()}>
					<AddIcon />
				</Fab>
			</Rnd>
		);
	}
}

export default Ball;
