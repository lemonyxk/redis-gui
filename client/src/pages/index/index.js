import React, { Component } from "react";
import "./index.scss";

import Header from "../../component/header/header";
import Middle from "../../component/middle/middle";
import Bottom from "../../component/bottom/bottom";
import Socket from "../../lib/socket";
import event from "../../tools/event";
import message from "../../tools/message";
import utils from "../../tools/utils";
import store from "../../tools/store";
import Api from "../../tools/api";
import Connection from "../../component/connection/connection";
import Left from "../../component/middle/left/left";
import ws from "../../tools/socket";
import Ball from "../../component/ball/ball";

class Index extends Component {
	render() {
		return (
			<div className="index body-background-color">
				<Header></Header>
				<Middle></Middle>
				<Ball></Ball>
				{/* <Bottom></Bottom> */}
			</div>
		);
	}

	load = null;

	uuid = store.get("uuid");

	start() {
		message.close();

		event.addComponentListener(Index, "connect", (data) => {
			this.load = message.loading("connecting...");

			utils.after(800).then(() => {
				var db = parseInt(data.db);
				store.set("db", db);
				ws.socket.Emit("/login", {
					name: data.name,
					split: data.split,
					db: db,
					type: data.type,
					master_name: data.masterName,
					password: data.password,
					addr: data.addr.map((item) => item.host + ":" + item.port),
				});
			});
		});

		let connections = store.get("connections") || [];
		if (connections.length == 0) return;
		var checked = connections.filter((item) => item.checked);
		if (checked.length == 0) return;
		event.emitComponent(Index, "connect", checked[0]);
	}

	login(e, data) {
		if (data.code !== 200) {
			message.close();
			return message.error(data.msg);
		}

		ws.socket.Global.token = data.msg.Token;
		this.load.done(data.status);
		store.set("token", data.msg.Token);
		store.set("connected", data.msg.name);
		event.emitComponent(Connection, "connected", data);
		event.emitComponent(Left, "left-login", { db: data.msg.db });
	}

	loading(e, data) {
		if (data.code !== 200) {
			return message.error(data.msg);
		}
		event.emitComponent(Left, "left-loading", data);
	}

	serverLog(e, data) {
		if (data.code !== 200) {
			return message.error(data.msg);
		}

		var res = [];
		for (const key in data.msg) {
			res.push(key);
			res.push(data.msg[key]);
		}

		Api.serverLog(res);
	}

	componentDidMount() {
		this.load = message.loading("connecting...");
		store.remove("connected");
		ws.socket = new Socket({ addr: Api.ws });
		ws.socket.Global.uuid = this.uuid;
		ws.socket.AddListener("/login", this.login.bind(this));
		ws.socket.AddListener("/loading", this.loading.bind(this));
		ws.socket.AddListener("/serverLog", this.serverLog.bind(this));
		ws.socket.Start(() => this.start());
	}

	componentWillUnmount() {
		ws.socket.RemoveListener("/login");
		ws.socket.RemoveListener("/loading");
		ws.socket.Close();
	}
}

export default Index;
