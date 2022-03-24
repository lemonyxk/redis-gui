let store = require("store");

let userAgent = navigator.userAgent.toLowerCase();
if (userAgent.indexOf(" electron/") > -1) {
	const Store = window.require("electron-store");
	store = new Store();
	store.remove = store.delete;
}

class Store {
	appName = "__redis-client__";

	get(key) {
		return store.get(this.appName + key);
	}

	set(key, value) {
		return store.set(this.appName + key, value);
	}

	remove(key) {
		return store.remove(this.appName + key);
	}

	clear() {
		return store.clearAll();
	}
}

export default new Store();
