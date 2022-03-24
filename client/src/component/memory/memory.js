import "./memory.scss";
import store from "../../tools/store";
import { Comfirm } from "../../common/comfirm";

import React, { Component } from "react";

import ws from "../../tools/socket";
import event from "../../tools/event";

import * as echarts from "echarts";

class MemoryLine extends Component {
	maxCount = 180;

	update(data) {
		this.data.push(...data);
		if (this.data.length > this.maxCount) {
			this.data = this.data.slice(this.data.length - this.maxCount);
		}
		for (let i = 0; i < this.data.length; i++) {
			this.option.series[0].data[i] = this.data[i].used_memory / 1024 / 1024;
			this.option.xAxis.data[i] = this.data[i].time;
		}
		this.option.animation = true;
		this.chart.setOption(this.option);
		this.chart.updateLabelLayout();
	}

	option = {
		animation: false,
		legend: {
			data: ["used_memory"],
		},
		xAxis: {
			type: "category",
			data: [],
			axisLabel: {
				interval: 30,
				showMaxLabel: true,
			},
		},
		yAxis: {
			type: "value",
			min: 0,
			// max: 1000,
			minInterval: 100,

			axisLabel: {
				formatter: "{value} MB",
			},
		},
		series: [
			{
				name: "used_memory",
				type: "line",
				data: [],
				smooth: true,
				symbol: "none",
			},
		],
	};

	data = [];
	chart = null;

	componentDidMount() {
		let chartDom = document.getElementById("memory");
		this.chart = echarts.init(chartDom);
		this.chart.setOption(this.option);
	}

	render() {
		return <div className="memory" id="memory"></div>;
	}
}

class Memory {
	ref = React.createRef();

	openCli() {
		Comfirm.open({
			autoClose: true,
			width: 900,
			height: 600,
			style: { border: "none", padding: 0 },
			text: <MemoryLine ref={this.ref} />,
			onOpen: () => {
				requestAnimationFrame(() => this.open());
			},
			onClose: () => {
				requestAnimationFrame(() => this.close());
			},
		});
	}

	infoAll(e, data) {
		let res = [];

		for (let i = 0; i < data.msg.length; i++) {
			const element = data.msg[i];
			let r = JSON.parse(element);
			res.push({
				time: r.Time,
				used_memory: r.Memory.used_memory,
			});
		}

		this.ref.current.update(res);
	}

	bindResize = this.onResize.bind(this);

	onResize(data) {
		this.window = data;
	}

	open() {
		event.add("resize", this.bindResize);
		ws.socket.AddListener("/infoAll", this.infoAll.bind(this));
		ws.socket.Emit("/infoAll", {});
	}

	close() {
		event.remove("resize", this.bindResize);
		ws.socket.Emit("/closeInfoAll", {});
		ws.socket.RemoveListener("/infoAll");
	}

	window = store.get("window");
}

const memory = new Memory();

export default memory;
