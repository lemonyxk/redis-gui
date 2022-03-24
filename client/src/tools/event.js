class Event {
	eventList = {};

	add = (name, fn) => {
		if (!this.eventList[name]) {
			this.eventList[name] = [];
		}

		let index = this.eventList[name].indexOf(fn);
		if (index == -1) {
			this.eventList[name].push(fn);
		}
	};

	remove = (name, fn) => {
		if (!this.eventList[name]) {
			return;
		}
		let index = this.eventList[name].indexOf(fn);
		if (index > -1) {
			this.eventList[name].splice(index, 1);
		}
	};

	emit = (name, data, fn) => {
		if (!this.eventList[name]) return;

		for (let i = 0; i < this.eventList[name].length; i++) {
			if (this.eventList[name][i]) {
				let res = this.eventList[name][i].call(this, data);
				fn && fn(res);
			}
		}
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
		let res = this.componentList[component][name].call(this, data);
		fn && fn(res);
	};
}

export default new Event();
