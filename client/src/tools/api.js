import axios from "axios";
import dayjs from "dayjs";

const Api = {
	queryLogs: [],
	serverLogs: [],
	http: "http://127.0.0.1:8666",
	ws: "ws://127.0.0.1:8667",

	queryLog(params, data) {
		var cmdStr = params.join(" ");
		var str = `${dayjs().format("YYYY-MM-DD HH:mm:ss")} CMD: ${cmdStr} `;
		if (data.data.code != 200) {
			str += `MSG: ${data.data.msg}`;
		}
		this.queryLogs.push(str);
		if (this.queryLogs.length > 300) {
			this.queryLogs.shift();
		}
	},

	serverLog(data) {
		var dataStr = data.join(" ");
		var str = `${dayjs().format("YYYY-MM-DD HH:mm:ss")} EVENT: ${dataStr} `;
		this.serverLogs.push(str);
		if (this.serverLogs.length > 300) {
			this.serverLogs.shift();
		}
	},

	async list(path, page, limit) {
		let res = await axios.get(`${this.http}/list`, { path: path, page: page, limit: limit });
		if (!res.data.msg) res.data.msg = [];
		var data = res.data.msg;
		return data;
	},

	async DBList() {
		var dbList = {};
		let res = await axios.get(`${this.http}/db`);
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
		let res = await axios.get(`${this.http}/type`, { path: path });
		var type = res.data.msg;
		this.queryLog(["TYPE", path], res);
		return type;
	},

	async do(cmd) {
		let res = await axios.post(`${this.http}/do`, { cmd: JSON.stringify(cmd) });
		var data = res.data;
		this.queryLog(cmd, res);
		return data;
	},

	async scan(search, iter, limit) {
		let res = await axios.get(`${this.http}/scan`, { limit: limit, search: search, iter: iter });
		var data = res.data;
		this.queryLog(["SCAN", iter, search, limit], res);
		return data;
	},
};

export default Api;
