import React, { Component } from "react";
import "./right.scss";
import CloseIcon from "@material-ui/icons/Close";

import { Paper, Tab, Tabs } from "@material-ui/core";
import event from "../../../tools/event";
import Api from "../../../tools/api";
import String from "./string/string";
import Hash from "./hash/hash";
import List from "./list/list";
import Set from "./set/set";
import ZSet from "./zset/zset";
import Left from "../left/left";
import Stream from "./stream/stream";

class Right extends Component {
	state = {
		activeKey: "",
		data: [],
	};

	onClose(key, shouldSelect) {
		this.state.data = this.state.data.filter((item) => item.name !== key);
		let node = null;
		if (this.state.data.length > 0) {
			if (this.state.activeKey === key) {
				this.state.activeKey = this.state.data[0].name;
				node = this.state.data[0];
			} else {
				node = this.state.data.find((item) => item.name === this.state.activeKey);
			}
		} else {
			this.state.activeKey = "";
		}

		let data = null;

		if (node && shouldSelect) {
			data = { ...node.content.props.data };
		}

		event.emitComponent(Left, "left-selected", data);

		this.setState({ data: this.state.data });
	}

	onChange(activeKey) {
		let node = this.state.data.find((item) => item.name === activeKey);
		event.emitComponent(Left, "left-selected", { ...node.content.props.data });
		this.setState({ activeKey: activeKey });
	}

	async getType(data) {
		let key = data.path;
		let index = this.state.data.findIndex((item) => item.name === key);
		if (index !== -1) {
			this.setState({ activeKey: key });
			return;
		}

		let type = await Api.type(key);

		this.state.data.push({ name: key, content: this.renderType(type, key, data) });

		if (this.state.data.length > 5) {
			this.state.data.shift();
		}

		this.setState({ activeKey: key, data: this.state.data });
	}

	renderType(type, key, data) {
		switch (type) {
			case "string":
				return <String path={key} type={type} data={data} />;
			case "list":
				return <List path={key} type={type} data={data} />;
			case "hash":
				return <Hash path={key} type={type} data={data} />;
			case "set":
				return <Set path={key} type={type} data={data} />;
			case "zset":
				return <ZSet path={key} type={type} data={data} />;
			case "stream":
				return <Stream path={key} type={type} data={data} />;
			default:
				return type;
		}
	}

	async activeKey(data) {
		this.getType(data);
	}

	async reloadKey(node) {
		let key = node.path;
		let index = this.state.data.findIndex((item) => item.name === key);
		if (index === -1) {
			return;
		}

		let type = await Api.type(key);

		this.state.data[index] = { name: key, content: null };
		this.setState({ activeKey: key, data: this.state.data });
		this.state.data[index] = { name: key, content: this.renderType(type, key, node) };
		this.setState({ activeKey: key, data: this.state.data });
	}

	componentDidMount() {
		event.addComponentListener(Right, "right-activeKey", (data) => {
			this.activeKey(data);
		});
		event.addComponentListener(Right, "right-reloadKey", (node) => {
			this.reloadKey(node);
		});
		event.addComponentListener(Right, "right-closeKey", (node) => {
			this.onClose(node.path, node.shouldSelect);
		});
		event.addComponentListener(Right, "right-closeAllKey", (node) => {
			this.state.data = [];
			this.state.activeKey = "";
			this.setState({ data: this.state.data });
		});
	}

	render() {
		return (
			<div className="m-right">
				<Paper elevation={3} style={{ width: "100%", height: "48px" }}>
					{this.state.data.length > 0 ? (
						<Tabs
							value={this.state.activeKey}
							TabIndicatorProps={{ className: "normal-button" }}
							onChange={(e, activeKey) => {
								e.stopPropagation();
								this.onChange(activeKey);
							}}
							className="black-color"
							variant="scrollable"
							scrollButtons="auto"
							style={{ height: "48px", width: "100%" }}
						>
							{this.state.data.map((item, index) => {
								return (
									<Tab
										style={{ height: "100%" }}
										label={
											<TabTitle
												title={item.name}
												onClick={(e) => {
													e.stopPropagation();
													this.onClose(item.name, true);
												}}
											></TabTitle>
										}
										value={item.name}
										key={item.name}
										{...allProps(1)}
									/>
								);
							})}
						</Tabs>
					) : null}
				</Paper>
				<Paper elevation={3} style={{ width: "100%", height: "calc(100% - 48px - 5px)" }}>
					{this.state.data.map((item, index) => {
						return (
							<TabPanel
								style={{ height: "100%", width: "100%" }}
								value={item.name}
								key={item.name}
								index={index}
								selected={this.state.activeKey}
							>
								{item.content}
							</TabPanel>
						);
					})}
				</Paper>
			</div>
		);
	}
}

export default Right;

function allProps(index) {
	return {
		id: `scrollable-auto-tab-${index}`,
		"aria-controls": `scrollable-auto-tabpanel-${index}`,
	};
}

function TabPanel(props) {
	const { children, value, index, selected, style } = props;
	const content = value === selected ? children : null;
	return (
		<div
			className="content"
			role="tabpanel"
			hidden={value !== selected}
			id={`scrollable-auto-tabpanel-${index}`}
			aria-labelledby={`scrollable-auto-tab-${index}`}
			style={style}
		>
			{content}
		</div>
	);
}

function TabTitle(props) {
	const { title, onClick } = props;
	return (
		<div className="item-title">
			<div className="text">{title}</div>
			<CloseIcon onClick={onClick} className="icon" />
		</div>
	);
}
