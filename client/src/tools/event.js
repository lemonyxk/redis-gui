class Event {
	eventList = {};

	add = (name, fn) => {
		this.eventList[name] = fn;
	};

	remove = (name) => {
		delete this.eventList[name];
	};

	emit = (name, data, fn) => {
		if (!this.eventList[name]) return;
		var res = this.eventList[name].call(this, data);
		fn && fn(res);
	};

	componentList = {};

	addComponentListener = (component, name, fn) => {
		if (!this.componentList[component]) {
			this.componentList[component] = {};
		}
		this.componentList[component][name] = fn;
	};

	removeComponentListener = (component, name) => {
		if (!this.componentList[component]) return;
		delete this.componentList[component][name];
	};

	emitComponent = (component, name, data, fn) => {
		if (!this.componentList[component]) return;
		if (!this.componentList[component][name]) return;
		var res = this.componentList[component][name].call(this, data);
		fn && fn(res);
	};
}

export default new Event();
