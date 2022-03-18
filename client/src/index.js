import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import Qs from "querystring";
import { ComfirmContainer } from "./common/comfirm";
import { HashRouter } from "react-router-dom";
import store from "./tools/store";
import theme from "./theme/theme";
import event from "./tools/event";

// console.warn = () => {};

var uuid = store.get("uuid");

if (!uuid) {
	uuid = Math.random().toString(36).slice(2);
	store.set("uuid", uuid);
}

axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

axios.defaults.baseURL = "";

axios.defaults.timeout = 15000;

axios.interceptors.request.use((request) => {
	var db = store.get("db") === undefined ? 0 : parseInt(store.get("db"));
	var token = store.get("token") === undefined ? "" : store.get("token");

	if (request.method === "get") {
		let req = JSON.parse(JSON.stringify(request));

		delete req.url;
		delete req.method;
		delete req.baseURL;
		delete req.transformRequest;
		delete req.transformResponse;
		delete req.headers;
		delete req.params;
		delete req.paramsSerializer;
		delete req.data;
		delete req.timeout;
		delete req.timeoutErrorMessage;
		delete req.withCredentials;
		delete req.adapter;
		delete req.auth;
		delete req.responseType;
		delete req.xsrfCookieName;
		delete req.xsrfHeaderName;
		delete req.onUploadProgress;
		delete req.onDownloadProgress;
		delete req.maxContentLength;
		delete req.validateStatus;
		delete req.maxBodyLength;
		delete req.maxRedirects;
		delete req.socketPath;
		delete req.httpAgent;
		delete req.httpsAgent;
		delete req.proxy;
		delete req.cancelToken;
		delete req.decompress;
		delete req.transitional;
		delete req.signal;
		delete req.insecureHTTPParser;

		request.params = { ...req, db, token, uuid };
	}

	if (request.method === "post") {
		request.data = Qs.stringify({ ...request.data, db, token, uuid });
	}

	return request;
});

axios.interceptors.response.use(
	(response) => {
		if (response.data && response.data.status) {
			if (response.data.code !== 200) {
				// throw response.data.msg;
				console.error(response.data.msg);
			}
		}
		return response;
	},
	(error) => {
		console.error(error);
	}
);

store.set("window", { width: window.innerWidth, height: window.innerHeight });
window.addEventListener("resize", () => {
	store.set("window", { width: window.innerWidth, height: window.innerHeight });
	event.emit("resize", { width: window.innerWidth, height: window.innerHeight });
});

if (!store.get("config")) {
	store.set("config", { show: 15, limit: 15 });
}

theme.init(store.get("theme") || "default");

ReactDOM.render(
	<React.Fragment>
		<HashRouter>
			<App />
		</HashRouter>

		<ToastContainer />
		<ComfirmContainer />
	</React.Fragment>,
	document.getElementById("root")
);
