import React, { Component } from "react";
import "./left.scss";
import { FormControl, Select, MenuItem, Input, InputAdornment, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Treebeard } from "react-treebeard";
import { Description, PlayArrow } from "@material-ui/icons";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import event from "../../../tools/event";
import { Resizable } from "re-resizable";
import Api from "../../../tools/api";
import CachedIcon from "@mui/icons-material/Cached";
import store from "../../../tools/store";
import Right from "../right/right";

class Left extends Component {
	state = {
		data: { children: [] },
		dbList: {},
		db: 0,
	};

	limit = 100;

	selectedNodeID = null;

	hasLoadMore = (children) => {
		if (children.length > 0) {
			if (children[children.length - 1].path === "") {
				return true;
			}
		}
		return false;
	};

	findNode(id) {
		var res = null;
		var data = this.state.data;
		var find = (id, data) => {
			for (let i = 0; i < data.children.length; i++) {
				if (data.children[i].isDir) {
					if (find(id, data.children[i])) {
						return true;
					}
				} else {
					if (data.children[i].id === id) {
						res = data.children[i];
						return true;
					}
				}
			}
		};

		find(id, data);

		return res;
	}

	findSelectedNode() {
		var res = null;
		var data = this.state.data;
		var find = (data) => {
			for (let i = 0; i < data.children.length; i++) {
				if (data.children[i].isDir) {
					if (find(data.children[i])) {
						return true;
					}
				} else {
					if (data.children[i].selected) {
						res = data.children[i];
						return true;
					}
				}
			}
		};

		find(data);

		return res;
	}

	getNodes = async (parent = null, path = "", page = 1, limit = this.limit) => {
		let data = await Api.list(path, page, limit);
		return await this.renderNode(parent, data, page, limit);
	};

	async renderNode(parent, data, page, limit) {
		if (this.hasLoadMore(parent.children)) {
			parent.children.splice(parent.children.length - 1, 1);
		}

		for (let i = 0; i < data.length; i++) {
			let el = data[i];
			var id = el.Path + el.IsDir + el.IsKey;
			parent.children.push({
				parent: parent,
				name: el.Name,
				id: id,
				path: el.Path,
				size: el.Size,
				isDir: el.IsDir,
				isKey: el.IsKey,
				children: [],
				selected: this.selectedNodeID == id,
			});
		}
		if (data.length === limit) {
			parent.children.push({
				parent: parent,
				name: <ExpandMoreIcon />,
				id: "",
				path: "",
				page: page + 1,
				isDir: false,
				isKey: true,
				children: [],
				selected: false,
			});
		}
		return await this.setState({ data: this.state.data });
	}

	getDB = async () => {
		var dbList = await Api.DBList();
		this.setState({ dbList: dbList });
	};

	componentDidMount() {
		event.addComponentListener(Left, "left-login", (data) => {
			this.getDB();
			this.start(data.db);
		});
		event.addComponentListener(Left, "left-loading", (data) => {
			if (data.msg.db == this.state.db) {
				this.loading(data.msg.db, data.msg.counter, data.msg.finish);
			}
		});
		event.addComponentListener(Left, "left-selected", async (data) => {
			var node = this.findSelectedNode();
			if (node) {
				node.selected = false;
			}

			if (!data) {
				this.selectedNodeID = null;
			} else {
				this.selectedNodeID = data.id;
				var node = this.findNode(data.id);
				if (node) {
					node.selected = true;
				}
			}

			this.setState({ data: this.state.data });
		});
		event.addComponentListener(Left, "left-deleteKey", (data) => {
			this.refresh(data.id);
		});
		event.addComponentListener(Left, "left-refresh", async (data) => {
			this.selectedNodeID = data.changePath + data.isDir + data.isKey;
			await this.refresh(data.id);
			var node = this.findNode(this.selectedNodeID);
			if (node) {
				this.onClick(node);
			}
		});
	}

	async loading(db, counter, finish) {
		var parent = this.state.data;
		var path = "";
		var page = 1;
		var limit = this.limit;

		var data = await Api.list(path, page, limit);

		if (finish) {
			if (this.hasLoadMore(parent.children)) {
				parent.children.splice(parent.children.length - 1, 1);
			}
		}

		var find = (id) => {
			for (let i = 0; i < parent.children.length; i++) {
				if (parent.children[i].id == id) {
					return parent.children[i];
				}
			}
			return null;
		};

		for (let i = 0; i < data.length; i++) {
			let el = data[i];
			let id = el.Path + el.IsDir + el.IsKey;

			let node = find(id);
			if (node) {
				node.size = el.Size;
			} else {
				parent.children.push({
					parent: parent,
					name: el.Name,
					id: id,
					path: el.Path,
					size: el.Size,
					isDir: el.IsDir,
					isKey: el.IsKey,
					children: [],
					selected: this.selectedNodeID == id,
				});
			}
		}
		if (finish) {
			if (data.length === limit) {
				parent.children.push({
					parent: parent,
					name: <ExpandMoreIcon />,
					id: "",
					path: "",
					page: page + 1,
					isDir: false,
					isKey: true,
					children: [],
					selected: false,
				});
			}
		}

		this.setState({ data: this.state.data });

		if (finish) {
			if (parent.children.length > limit) {
				this.start(db);
			}
		}
	}

	start(db) {
		event.emitComponent(Right, "right-closeAllKey");

		this.setState(
			{
				data: { children: [] },
				// dbList: {},
				db: parseInt(db),
			},
			() => {
				this.selectedNodeID = null;
				this.getNodes(this.state.data, "", 1);
			}
		);
	}

	style = {
		tree: {
			base: {
				fontSize: "14px",
				whiteSpace: "pre-wrap",
				backgroundColor: "inherit",
				height: "100%",
				padding: "5px 0",
			},
		},
	};

	toggledView = (<PlayArrow style={{ height: 20, transform: "rotate(90deg)", position: "relative", top: "-1px" }} />);
	unToggleView = (<PlayArrow style={{ height: 20 }} />);
	loadingView = (<div>loading...</div>);
	descriptionView = (<Description style={{ width: 14 }} />);

	headerStyle = {
		userSelect: "none",
		cursor: "pointer",
		display: "flex",
		justifyContent: "flex-start",
		alignItems: "center",
		width: "100%",
		height: "24px",
	};

	containerStyle = {
		display: "flex",
		justifyContent: "flex-start",
		alignItems: "center",
		height: "24px",
		width: "100%",
	};

	decorators = {
		Loading: (props) => {
			return this.loadingView;
		},
		Toggle: (node) => {
			if (node.toggled) return this.toggledView;
			return this.unToggleView;
		},
		Header: (node) => {
			this.headerStyle = node.parent.path ? this.headerStyle : { ...this.headerStyle, paddingLeft: 6 };
			if (node.isDir) {
				var l = node.children.length;
				if (this.hasLoadMore(node.children)) {
					l -= 1;
				}
				return (
					<div style={this.headerStyle}>
						{node.name} ({node.size})
					</div>
				);
			}

			return (
				<div style={this.headerStyle}>
					{node.path ? this.descriptionView : null}
					{node.name}
				</div>
			);
		},
		Container: (props) => {
			if (props.node.isDir) {
				return (
					<div className="tree-list-item tree-color" onClick={() => this.onClick(props.node)} style={this.containerStyle}>
						{props.decorators.Toggle(props.node)}
						{props.decorators.Header(props.node)}
					</div>
				);
			}

			var classList = ["tree-list-item", "tree-color"];
			if (props.node.selected) {
				classList.push("tree-list-item-background");
			}

			return (
				<div className={classList.join(" ")} onClick={() => this.onClick(props.node)} style={this.containerStyle}>
					{props.decorators.Header(props.node)}
				</div>
			);
		},
	};

	onClick = (node) => {
		if (!node.isDir) {
			if (node.path) {
				if (this.selectedNodeID) {
					var n = this.findNode(this.selectedNodeID);
					if (n) {
						n.selected = false;
					}
				}
				this.selectedNodeID = node.id;
				node.selected = true;
				this.setState({ data: this.state.data }, () => {
					this.onNode(node);
				});
			} else {
				this.getNodes(node.parent, node.parent.path, node.page);
			}
			return;
		}

		node.toggled = !node.toggled;

		if (node.toggled) {
			this.getNodes(node, node.path);
		} else {
			node.children = [];
			this.setState({ data: this.state.data });
		}
	};

	onNode = (node) => {
		event.emitComponent(Right, "right-activeKey", { id: node.id, path: node.path, isDir: node.isDir, isKey: node.isKey });
	};

	selectDB(db) {
		store.set("db", db);
		this.start(db);
	}

	window = store.get("window");

	render() {
		return (
			<div className="m-left ">
				<Resizable
					defaultSize={{ width: 300 }}
					minWidth={250}
					maxWidth={500}
					bounds=".middle"
					enable={{ right: true }}
					// disableDragging={true}
					className="rnd"
					grid={[1, 2]}
				>
					<Paper elevation={3} className="m-left-background-color">
						<div className="top">
							<FormControl fullWidth style={{ width: "100%", height: 36 }}>
								{/* <InputLabel variant="standard" htmlFor="uncontrolled-native"></InputLabel> */}
								{Object.keys(this.state.dbList).length > 0 ? (
									<Select
										variant={"standard"}
										inputProps={{ id: "uncontrolled-native" }}
										style={{ width: "100%", height: 36 }}
										value={this.state.db}
										onChange={(e) => this.selectDB(e.target.value)}
									>
										{Object.keys(this.state.dbList).map((item) => (
											<MenuItem key={item} value={item}>
												<div style={{ textIndent: 5 }}>
													db-{item} ({this.state.dbList[item]})
												</div>
											</MenuItem>
										))}
									</Select>
								) : null}
							</FormControl>
						</div>
						<div className="middle">
							<Treebeard
								data={this.state.data.children}
								// onToggle={(node, toggled) => this.onToggle(node, toggled)}
								style={this.style}
								animations={false}
								decorators={this.decorators}
							/>
						</div>
						<div className="bottom">
							<FormControl className="search">
								<Input
									autoComplete="off"
									variant={"standard"}
									placeholder="search"
									inputProps={{ id: "uncontrolled-native" }}
									className="search-input"
									endAdornment={
										<InputAdornment position="end" style={{ cursor: "pointer" }}>
											<SearchIcon className="search-icon" />
											<CachedIcon className="refresh-icon" onClick={() => this.refresh(this.selectedNodeID)} />
										</InputAdornment>
									}
								/>
							</FormControl>
						</div>
					</Paper>
				</Resizable>
			</div>
		);
	}

	async refresh(id, shouldDelete) {
		var node = null;

		// id is null
		if (!id) {
			node = this.state.data.children[0];
		} else {
			node = this.findNode(id) || this.state.data.children[0];
		}

		if (!node) {
			return;
		}

		node.parent.children = [];

		this.setState({ data: this.state.data });
		return await this.getNodes(node.parent, node.parent.path, 1);
	}
}

export default Left;
