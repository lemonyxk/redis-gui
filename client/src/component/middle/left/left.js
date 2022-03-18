import React, { Component } from "react";
import "./left.scss";
import { Select, MenuItem, Input, InputAdornment, Paper, Menu, Button, InputLabel, FormControl } from "@mui/material";
import { MenuItem as RMenuItem, Menu as RMenu } from "@material-ui/core";
import SearchIcon from "@mui/icons-material/Search";
import { Treebeard } from "react-treebeard";
import { Description, PlayArrow } from "@material-ui/icons";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import event from "../../../tools/event";
import { Resizable } from "re-resizable";
import Api from "../../../tools/api";
import store from "../../../tools/store";
import Right from "../right/right";
import Divider from "@mui/material/Divider";
import keyInfo from "../../../common/key";
import Popper from "../../../common/popper";

class Left extends Component {
	state = {
		data: { children: [] },
		dbList: {},
		db: 0,
		onOpenMenu: null,
		onOpenPopper: null,
	};

	openMenu(e) {
		this.setState({ onOpenMenu: e.currentTarget });
	}

	closeMenu() {
		this.setState({ onOpenMenu: null });
	}

	openPopper(e) {
		this.setState({ onOpenPopper: e });
	}

	closePopper() {
		this.setState({ onOpenPopper: null });
	}

	limit = 100;

	selectedNodeID = null;

	menuEvent = null;

	popperValue = "";

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
		return { parent, data, page, limit };
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
		event.addComponentListener(Left, "left-refresh", (data) => {
			this.refresh(data.id);
		});
		event.addComponentListener(Left, "left-rename", async (data) => {
			this.selectedNodeID = data.changePath + data.isDir + data.isKey;
			await this.refresh(data.id);
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
			async () => {
				this.selectedNodeID = null;
				var { parent, data, page, limit } = await this.getNodes(this.state.data, "", 1);
				await this.renderNode(parent, data, page, limit);
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
					<div className="item-desc">{node.name}</div>
				</div>
			);
		},
		Container: (props) => {
			if (props.node.isDir) {
				return (
					<div
						className="tree-list-item tree-color"
						onContextMenuCapture={(e) => e.preventDefault()}
						onClick={() => this.onDir(props.node)}
						style={this.containerStyle}
					>
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
				<div
					className={classList.join(" ")}
					onContextMenuCapture={(e) => {
						e.preventDefault();
						if (this.selectedNodeID) {
							var n = this.findNode(this.selectedNodeID);
							if (n) {
								n.selected = false;
							}
						}
						this.selectedNodeID = props.node.id;
						props.node.selected = true;
						this.menuEvent = e;
						this.openMenu(e);
					}}
					onClick={() => this.onSelect(props.node)}
					onDoubleClick={() => this.onKey(props.node)}
					style={this.containerStyle}
				>
					{props.decorators.Header(props.node)}
				</div>
			);
		},
	};

	async onSelect(node) {
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
				this.setState({ data: this.state.data });
			}
			return;
		}
	}

	onKey = async (node) => {
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
				var { parent, data, page, limit } = await this.getNodes(node.parent, node.parent.path, node.page);
				await this.renderNode(parent, data, page, limit);
			}
			return;
		}
	};

	onDir = async (node) => {
		if (!node.isDir) {
			return;
		}

		node.toggled = !node.toggled;

		if (node.toggled) {
			var { parent, data, page, limit } = await this.getNodes(node, node.path);
			await this.renderNode(parent, data, page, limit);
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
											{/* <CachedIcon className="refresh-icon" onClick={() => this.refresh(this.selectedNodeID)} /> */}
										</InputAdornment>
									}
								/>
							</FormControl>
						</div>
					</Paper>
				</Resizable>

				<Popper
					open={!!this.state.onOpenPopper}
					onClose={() => {
						var v = this.findNode(this.selectedNodeID);
						if (v.path != this.popperValue) {
							keyInfo.rename(v, this.popperValue, false);
						}
						this.closePopper();
					}}
					anchorEl={this.state.onOpenPopper}
					transition
				>
					<Paper className="popper">
						<div>
							<FormControl fullWidth>
								<InputLabel variant="standard" htmlFor="uncontrolled-native">
									rename
								</InputLabel>
								<Input
									variant={"standard"}
									inputProps={{ id: "uncontrolled-native" }}
									defaultValue={(() => {
										var v = this.findNode(this.selectedNodeID);
										var r = v ? v.path : "";
										this.popperValue = r;
										return r;
									})()}
									onChange={(e) => {
										this.popperValue = e.target.value;
									}}
									autoComplete="off"
									onClick={(e) => e.stopPropagation()}
									onKeyDown={(e) => {
										if (e.keyCode == 13) {
											var v = this.findNode(this.selectedNodeID);
											keyInfo.rename(v, this.popperValue, false);
											return this.closePopper();
										}
									}}
								/>
							</FormControl>
						</div>
					</Paper>
				</Popper>

				<RMenu
					anchorEl={this.state.onOpenMenu}
					open={!!this.state.onOpenMenu}
					onClose={() => this.closeMenu()}
					// MenuListProps={{ "aria-labelledby": "basic-button" }}
					// getContentAnchorEl={null}
					anchorReference={"anchorPosition"}
					anchorPosition={{
						top: this.menuEvent ? this.menuEvent.pageY : 0,
						left: this.menuEvent ? this.menuEvent.pageX : 0,
					}}
					onContextMenuCapture={(e) => e.preventDefault()}
					className="left-menu"
					autoFocus={false}
				>
					<RMenuItem
						className="left-menu-list"
						onClick={() => {
							var node = this.findNode(this.selectedNodeID);
							if (node) {
								this.onNode(node);
							}
							this.closeMenu();
						}}
					>
						<Button size="small" className="normal-color">
							open
						</Button>
					</RMenuItem>
					<Divider />

					<RMenuItem
						className="left-menu-list"
						onClick={() => {
							this.refresh(this.selectedNodeID);
							this.closeMenu();
						}}
					>
						<Button size="small" className="normal-color">
							refresh
						</Button>
					</RMenuItem>
					<Divider />

					<RMenuItem
						className="left-menu-list"
						onClick={() => {
							this.start(this.state.db);
							this.closeMenu();
						}}
					>
						<Button size="small" className="normal-color">
							reload
						</Button>
					</RMenuItem>
					<Divider />

					<RMenuItem
						className="left-menu-list"
						onClick={(e) => {
							// keyInfo.rename(this.selectedNodeID);
							this.closeMenu();
							this.openPopper(e);
						}}
					>
						<Button size="small" className="secondary-color">
							rename
						</Button>
					</RMenuItem>
					<Divider />

					<RMenuItem
						className="eft-menu-list"
						onClick={() => {
							var n = this.findNode(this.selectedNodeID);
							if (!n) return;
							keyInfo.delete(n);
							this.closeMenu();
						}}
					>
						<Button size="small" className="error-color">
							delete
						</Button>
					</RMenuItem>
				</RMenu>
			</div>
		);
	}

	async refresh(id) {
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

		var map = {};
		for (var i = 0; i < node.parent.children.length; i++) {
			map[node.parent.children[i].id] = { i: i, v: false };
		}

		var { parent, data, page, limit } = await this.getNodes(node.parent, node.parent.path, 1);

		// merge node parent and data
		if (!data) {
			data = [];
		}

		// add
		for (var i = 0; i < data.length; i++) {
			var el = data[i];
			var id = el.Path + el.IsDir + el.IsKey;
			var index = map[id];
			if (!index) {
				node.parent.children.push({
					parent: node.parent,
					name: el.Name,
					id: id,
					path: el.Path,
					size: el.Size,
					isDir: el.IsDir,
					isKey: el.IsKey,
					children: [],
					selected: this.selectedNodeID == id,
				});
			} else {
				map[id].v = true;
			}
		}

		// remove
		for (const id in map) {
			if (map[id].v == false) {
				node.parent.children.splice(map[id].i, 1);
			}
		}

		if (node.parent.children.length === limit) {
			node.parent.children.push({
				parent: node.parent,
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

		node.parent.children.sort((a, b) => a.name.localeCompare(b.name));

		this.setState({ data: this.state.data });
	}
}

export default Left;
