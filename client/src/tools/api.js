import dayjs from "dayjs";
import ws from "./socket";

const Api = {
	queryLogs: [],
	serverLogs: [],
	ws: "ws://127.0.0.1:8667/ws",

	queryLog(params, data) {
		let cmdStr = params.join(" ");
		let str = `${dayjs().format("YYYY-MM-DD HH:mm:ss")} CMD: ${cmdStr} `;
		if (data.data.code != 200) {
			str += `MSG: ${data.data.msg}`;
		}
		this.queryLogs.push(str);
		if (this.queryLogs.length > 300) {
			this.queryLogs.shift();
		}
	},

	serverLog(data) {
		let dataStr = data.join(" ");
		let str = `${dayjs().format("YYYY-MM-DD HH:mm:ss")} EVENT: ${dataStr} `;
		this.serverLogs.push(str);
		if (this.serverLogs.length > 300) {
			this.serverLogs.shift();
		}
	},

	async list(path, page, limit) {
		let res = await ws.socket.Do("/list", { path: path, page: page, limit: limit });
		if (!res.data.msg) res.data.msg = [];
		let data = res.data.msg;
		return data;
	},

	async DBList() {
		let dbList = {};
		let res = await ws.socket.Do("/db", {});
		let db = res.data.msg.db[1];
		for (let i = 0; i < db; i++) {
			dbList[i] = 0;
		}
		let arr = res.data.msg.key.split("\r\n");
		for (let i = 1; i < arr.length - 1; i++) {
			const element = arr[i];
			const a = element.split(",")[0];
			const b = a.split(":");
			dbList[b[0].slice(2)] = parseInt(b[1].slice(5));
		}
		this.queryLog(["CONFIG", "GET", "DATABASES"], res);
		return dbList;
	},

	async type(path) {
		let res = await ws.socket.Do("/type", { path: path });
		let type = res.data.msg;
		this.queryLog(["TYPE", path], res);
		return type;
	},

	async do(cmd) {
		let res = await ws.socket.Do("/do", { cmd: JSON.stringify(cmd) });
		let data = res.data;
		this.queryLog(cmd, res);
		return data;
	},

	async scan(search, iter, limit) {
		let res = await ws.socket.Do("/scan", { limit: limit, search: search, iter: iter });
		let data = res.data;
		this.queryLog(["SCAN", iter, search, limit], res);
		return data;
	},
};

export default Api;
