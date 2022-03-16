import React, { Component } from "react";
import "./App.scss";
import { HashRouter, Route, Switch, withRouter, Redirect } from "react-router-dom";

import Index from "./pages/index/index";

class App extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.unlisten = this.props.history.listen((path) => {});
	}

	componentWillUnmount() {
		this.unlisten();
	}

	render() {
		return (
			<HashRouter>
				<Switch>
					<Route path="/index" component={Index} exact />
					<Redirect from="**" to="/index" />
				</Switch>
			</HashRouter>
		);
	}
}

export default withRouter(App);
