import "./query.scss";
import store from "../../tools/store";
import { Comfirm } from "../../common/comfirm";

import React, { Component } from "react";

import ws from "../../tools/socket";

import * as echarts from "echarts";

class QueryLine extends Component {
	maxCount = 180;

	update(data) {
		this.data.push(...data);
		if (this.data.length > this.maxCount) {
			this.data = this.data.slice(this.data.length - this.maxCount);
		}
		for (let i = 0; i < this.data.length; i++) {
			this.option.series[0].data[i] = this.data[i].instantaneous_ops_per_sec;
			this.option.xAxis.data[i] = this.data[i].time;
		}
		this.option.animation = true;
		this.chart.setOption(this.option);
		this.chart.updateLabelLayout();
	}

	option = {
		animation: false,
		legend: {
			data: ["instantaneous_ops_per_sec"],
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
			minInterval: 10,

			axisLabel: {
				formatter: "{value} per/sec",
			},
		},
		series: [
			{
				name: "instantaneous_ops_per_sec",
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
		var chartDom = document.getElementById("query");
		this.chart = echarts.init(chartDom);
		this.chart.setOption(this.option);
	}

	render() {
		return <div className="query" id="query"></div>;
	}
}

class Query {
	ref = React.createRef();

	openCli() {
		Comfirm.open({
			autoClose: true,
			width: 900,
			height: 600,
			style: { border: "none", padding: 0 },
			text: <QueryLine ref={this.ref} />,
			onOpen: () => {
				requestAnimationFrame(() => this.open());
			},
			onClose: () => {
				requestAnimationFrame(() => this.close());
			},
		});
	}

	infoAll(e, data) {
		var res = [];

		for (let i = 0; i < data.msg.length; i++) {
			const element = data.msg[i];
			var r = JSON.parse(element);
			res.push({
				time: r.Time,
				instantaneous_ops_per_sec: r.Stats.instantaneous_ops_per_sec,
			});
		}

		this.ref.current.update(res);
	}

	open() {
		ws.socket.AddListener("/infoAll", this.infoAll.bind(this));
		ws.socket.Emit("/infoAll", {});
	}

	close() {
		ws.socket.Emit("/closeInfoAll", {});
		ws.socket.RemoveListener("/infoAll");
	}

	window = store.get("window");
}

const query = new Query();

export default query;
