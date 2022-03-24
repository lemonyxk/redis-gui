import React, { Component } from "react";
import "./left.scss";
import { Select, MenuItem, Input, InputAdornment, Paper, FormControl } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Treebeard } from "react-treebeard";
import { Description, PlayArrow } from "@material-ui/icons";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import event from "../../../tools/event";
import { Resizable } from "re-resizable";
import Api from "../../../tools/api";
import store from "../../../tools/store";
import Right from "../right/right";
import Popper from "./popper";
import Menu from "./menu";
import Tree from "./tree";
import CloseIcon from "@mui/icons-material/Close";

class Left extends Component {
	state = {
		data: { children: [] },
		dbList: {},
		db: 0,
		onOpenMenu: null,
		onOpenPopper: null,
		openSearch: false,
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

	searchValue = "";

	hasLoadMore = (children) => {
		if (children.length > 0) {
			if (children[children.length - 1].path === "") {
				return true;
			}
		}
		return false;
	};

	findNode(id) {
		let res = null;
		let data = this.state.data;
		let find = (id, data) => {
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
		let res = null;
		let data = this.state.data;
		let find = (data) => {
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
			let id = el.Path + el.IsDir + el.IsKey;
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
		if (data.length >= limit) {
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
		let dbList = await Api.DBList();
		this.setState({ dbList: dbList });
	};

	componentDidMount() {
		this.loadTree();

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
			let node = this.findSelectedNode();
			if (node) {
				node.selected = false;
			}

			if (!data) {
				this.selectedNodeID = null;
			} else {
				this.selectedNodeID = data.id;
				let node = this.findNode(data.id);
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
		let parent = this.state.data;
		let path = "";
		let page = 1;
		let limit = this.limit;

		let data = await Api.list(path, page, limit);

		if (finish) {
			if (this.hasLoadMore(parent.children)) {
				parent.children.splice(parent.children.length - 1, 1);
			}
		}

		let find = (id) => {
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
		this.exitSearch();

		event.emitComponent(Right, "right-closeAllKey");

		this.setState(
			{
				data: { children: [] },
				// dbList: {},
				db: parseInt(db),
			},
			async () => {
				this.selectedNodeID = null;
				let { parent, data, page, limit } = await this.getNodes(this.state.data, "", 1);
				await this.renderNode(parent, data, page, limit);
			}
		);
	}

	loadTree() {
		let res = Tree(this);
		for (const key in res) {
			this[key] = res[key];
		}
	}

	onKey = async (node) => {
		if (!node.isDir) {
			if (node.path) {
				if (this.selectedNodeID) {
					let n = this.findNode(this.selectedNodeID);
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
				if (this.inSearch) {
					this.renderSearch(this.iter);
				} else {
					let { parent, data, page, limit } = await this.getNodes(node.parent, node.parent.path, node.page);
					await this.renderNode(parent, data, page, limit);
				}
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
			if (this.inSearch) {
				this.renderSearch(this.iter);
			} else {
				let { parent, data, page, limit } = await this.getNodes(node, node.path);
				await this.renderNode(parent, data, page, limit);
			}
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
									defaultValue={this.searchValue}
									onChange={(e) => (this.searchValue = e.target.value)}
									ref={this.searchInput}
									spellCheck="false"
									onKeyDown={(e) => {
										if (e.keyCode === 13) {
											this.startSearch();
											this.renderSearch(0);
										}
									}}
									endAdornment={
										<InputAdornment position="end" style={{ cursor: "pointer" }}>
											{this.state.openSearch ? <CloseIcon className="close-icon" onClick={() => this.exitSearch()} /> : null}
											<SearchIcon
												className="search-icon"
												onClick={() => {
													this.startSearch();
													this.renderSearch(0);
												}}
											/>
										</InputAdornment>
									}
								/>
							</FormControl>
						</div>
					</Paper>
				</Resizable>

				{Popper(this)}
				{Menu(this)}
			</div>
		);
	}

	async refresh(id) {
		let node = null;

		// id is null
		if (!id) {
			node = this.state.data.children[0];
		} else {
			node = this.findNode(id) || this.state.data.children[0];
		}

		if (!node) {
			return;
		}

		if (this.inSearch) {
			this.startSearch();
			this.renderSearch(0);
			return;
		}

		let { parent, data, page, limit } = await this.getNodes(node.parent, node.parent.path, 1);

		// merge node parent and data
		if (!data) {
			data = [];
		}

		let map = {};
		for (let i = 0; i < node.parent.children.length; i++) {
			map[node.parent.children[i].id] = { i: i, v: false };
		}

		// add
		for (let i = 0; i < data.length; i++) {
			let el = data[i];
			let id = el.Path + el.IsDir + el.IsKey;
			let index = map[id];
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
				node.parent.children[map[id].i].path = "";
			}
		}

		node.parent.children = node.parent.children.filter((el) => el.path != "");

		node.parent.children.sort((a, b) => a.name.localeCompare(b.name));

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

		this.setState({ data: this.state.data });
	}

	temp = [];
	iter = 0;
	inSearch = false;
	searchInput = React.createRef();

	async renderSearch(iter) {
		this.iter = iter;
		let res = await Api.scan(this.searchValue, this.iter, this.limit);
		this.iter = res.msg.iter;
		this.renderNode(this.state.data, res.msg.data || [], 1, this.limit);
	}

	async startSearch() {
		if (!this.searchValue) return;

		if (!this.inSearch) {
			this.temp = this.state.data.children;
		}
		this.iter = 0;
		this.state.data.children = [];
		this.inSearch = true;

		this.setState({ openSearch: true });
	}

	exitSearch() {
		this.searchValue = "";
		if (this.searchInput && this.searchInput.current) {
			this.searchInput.current.querySelector("input").value = "";
		}
		this.state.data.children = this.temp;
		this.temp = [];
		this.iter = 0;
		this.inSearch = false;

		this.setState({ openSearch: false });
	}
}

export default Left;
