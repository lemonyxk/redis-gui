import React, { Component } from "react";
import "./left.scss";

import { Description, PlayArrow } from "@material-ui/icons";

let toggledView = <PlayArrow style={{ height: 20, transform: "rotate(90deg)", position: "relative", top: "-1px" }} />;
let unToggleView = <PlayArrow style={{ height: 20 }} />;
let loadingView = <div>loading...</div>;
let descriptionView = <Description style={{ width: 14 }} />;

let headerStyle = {
	userSelect: "none",
	cursor: "pointer",
	display: "flex",
	justifyContent: "flex-start",
	alignItems: "center",
	width: "100%",
	height: "24px",
	fontSize: "14px",
};

let containerStyle = {
	display: "flex",
	justifyContent: "flex-start",
	alignItems: "center",
	height: "24px",
	width: "100%",
};

let itemDesc = {
	display: "flex",
	justifyContent: "flex-start",
	alignItems: "center",
	height: "24px",
	width: "100%",
	height: "100%",
	paddingLeft: "4px",
	fontSize: "14px",
};

let fn = (self) => {
	return {
		style: {
			tree: {
				base: {
					fontSize: "14px",
					whiteSpace: "pre-wrap",
					backgroundColor: "inherit",
					height: "100%",
					padding: "5px 0",
				},
			},
		},

		decorators: {
			Loading: (props) => {
				return loadingView;
			},
			Toggle: (node) => {
				if (node.toggled) return toggledView;
				return unToggleView;
			},
			Header: (node) => {
				if (node.isDir) {
					return (
						<div style={headerStyle}>
							<div>{node.name}</div>
							<div style={{ marginLeft: 5 }}>({node.size})</div>
						</div>
					);
				}

				return (
					<div style={{ ...headerStyle, paddingLeft: 6 }}>
						<div style={{ height: 24 }}>{node.path ? descriptionView : null}</div>
						<div style={itemDesc}>{node.name}</div>
					</div>
				);
			},
			Container: (props) => {
				if (props.node.isDir) {
					return (
						<div
							className="tree-list-item tree-color"
							onContextMenuCapture={(e) => e.preventDefault()}
							onClick={() => self.onDir(props.node)}
							style={containerStyle}
						>
							{self.decorators.Toggle(props.node)}
							{self.decorators.Header(props.node)}
						</div>
					);
				}

				let classList = ["tree-list-item", "tree-color"];
				if (props.node.selected) {
					classList.push("tree-list-item-background");
				}

				return (
					<div
						className={classList.join(" ")}
						onContextMenuCapture={(e) => {
							e.preventDefault();
							if (self.selectedNodeID) {
								let n = self.findNode(self.selectedNodeID);
								if (n) {
									n.selected = false;
								}
							}
							self.selectedNodeID = props.node.id;
							props.node.selected = true;
							self.menuEvent = e;
							self.openMenu(e);
						}}
						onClick={() => self.onKey(props.node)}
						style={containerStyle}
					>
						{self.decorators.Header(props.node)}
					</div>
				);
			},
		},
	};
};

export default fn;
