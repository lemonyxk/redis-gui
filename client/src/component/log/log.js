import React, { Component } from "react";
import Api from "../../tools/api";
import "./log.scss";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

class Log extends Component {
	queryLogs = Api.queryLogs || [];
	serverLogs = Api.serverLogs || [];

	state = {
		value: 0,
	};

	handleChange = (event, value) => {
		this.setState({ value }, () => {
			this.smoothscroll();
		});
	};

	ref = [React.createRef(), React.createRef()];

	smoothscroll() {
		const domWrapper = this.ref[this.state.value].current; // 外层容器 出现滚动条的dom
		const currentScroll = domWrapper.scrollTop; // 已经被卷掉的高度
		const clientHeight = domWrapper.offsetHeight; // 容器高度
		const scrollHeight = domWrapper.scrollHeight; // 内容总高度
		domWrapper.scrollTo(0, scrollHeight);
	}

	componentDidMount() {
		this.smoothscroll();
	}

	render() {
		return (
			<div className="log log-background-color">
				<Tabs
					value={this.state.value}
					TabIndicatorProps={{ className: "tabs-indica" }}
					className="tabs"
					onChange={this.handleChange}
					centered
					{...allProps(1)}
				>
					<Tab label="QUERY LOG" />
					<Tab label="SERVER LOG" />
				</Tabs>
				<TabPanel value={0} key={0} index={0} refs={this.ref[0]} selected={this.state.value}>
					{this.queryLogs.map((item, index) => (
						<div className="log-color" key={index}>
							- {item}
						</div>
					))}
				</TabPanel>
				<TabPanel value={1} key={1} index={1} refs={this.ref[1]} selected={this.state.value}>
					{this.serverLogs.map((item, index) => (
						<div className="log-color" key={index}>
							- {item}
						</div>
					))}
				</TabPanel>
			</div>
		);
	}
}

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
			ref={props.refs}
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

export default Log;
