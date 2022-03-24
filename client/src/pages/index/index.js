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

			utils.after(800).then(async () => {
				let db = parseInt(data.db);
				store.set("db", db);
				let res = await ws.socket.Do("/login", {
					name: data.name,
					split: data.split,
					db: db,
					type: data.type,
					master_name: data.masterName,
					password: data.password,
					addr: data.addr.map((item) => item.host + ":" + item.port),
				});
				this.login(res.data);
			});
		});

		let connections = store.get("connections") || [];
		if (connections.length == 0) return;
		let checked = connections.filter((item) => item.checked);
		if (checked.length == 0) return;
		event.emitComponent(Index, "connect", checked[0]);
	}

	login(data) {
		this.load.done(data.status);

		if (data.code !== 200) {
			message.close();
			return message.error(data.msg);
		}

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

		let res = [];
		for (const key in data.msg) {
			res.push(key);
			res.push(data.msg[key]);
		}

		Api.serverLog(res);
	}

	componentDidMount() {
		this.load = message.loading("connecting...");
		store.remove("connected");
		ws.socket = new Socket({ addr: Api.ws, heartBeatInterval: 3 });

		ws.socket.before = () => {
			let db = store.get("db") === undefined ? 0 : parseInt(store.get("db"));
			let token = store.get("token") === undefined ? "" : store.get("token");
			let uuid = store.get("uuid") === undefined ? "" : store.get("uuid");
			ws.socket.Global = { db: db, token, uuid };
		};

		ws.socket.AddListener("/loading", this.loading.bind(this));
		ws.socket.AddListener("/serverLog", this.serverLog.bind(this));
		ws.socket.Start(() => this.start());
	}

	componentWillUnmount() {
		ws.socket.RemoveListener("/loading");
		ws.socket.Close();
	}
}

export default Index;
