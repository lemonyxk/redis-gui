import React, { Component } from "react";
import "./hash.scss";
import { Input, MenuItem, Select, TextField } from "@material-ui/core";
import { Button, Paper } from "@mui/material";
import KeyInfo from "../common/keyInfo";
import Api from "../../../../tools/api";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import VList from "react-virtualized/dist/commonjs/List";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import message from "../../../../tools/message";
import { Comfirm } from "../../../../common/comfirm";
import event from "../../../../tools/event";
import Left from "../../left/left";
import Right from "../right";
import store from "../../../../tools/store";
import { Resizable } from "re-resizable";

class Hash extends Component {
	constructor(props) {
		super(props);
	}

	config = store.get("config");

	page = 1;
	limit = this.config.limit;
	show = this.config.show;

	state = {
		ttl: -2,
		size: -1,
		res: [],
		resType: "text",
		page: 1,
		selectKey: "",
		selectValue: "",
	};

	componentDidMount() {
		this.init();
	}

	async init() {
		this.getTTL(this.props.path);
		this.getHash(this.props.path);
		this.getSize(this.props.path);
	}

	async getTTL(key) {
		let res = await Api.do(["TTL", key]);
		await this.setState({ ttl: res.msg });
	}

	async getSize(key) {
		let res = await Api.do(["HLEN", key]);
		await this.setState({ size: res.msg });
	}

	iter = 0;
	cache = {};
	overage = [];

	reset() {
		this.state.page = 1;
		this.page = 1;
		this.iter = 0;
		this.cache = {};
		this.overage = [];
	}

	async getHash(key) {
		// this.selectIndex = 0;

		if (this.cache[this.page]) {
			this.state.res = [];

			let data = [...this.cache[this.page]];

			for (let i = 0; i < data.length; i += 2) {
				let key = data[i];
				let value = data[i + 1];
				this.state.res.push({ key, value });
			}
		} else {
			if (this.iter == 0 && this.page != 1) {
				this.state.res = [];

				let data = [...this.overage];
				this.overage = [];

				let cache = [];

				for (let i = 0; i < data.length; i += 2) {
					let key = data[i];
					let value = data[i + 1];
					if (this.state.res.length >= this.limit) {
						this.overage.push(key);
						this.overage.push(value);
					} else {
						this.state.res.push({ key, value });
						cache.push(key);
						cache.push(value);
					}
				}

				this.cache[this.page] = cache;
			} else {
				this.state.res = [];

				let data = [...this.overage];

				this.overage = [];
				let res = await Api.do(["HSCAN", key, this.iter, "COUNT", this.limit]);
				this.iter = res.msg[0];
				data.push(...res.msg[1]);

				let cache = [];
				for (let i = 0; i < data.length; i += 2) {
					let key = data[i];
					let value = data[i + 1];
					if (this.state.res.length >= this.limit) {
						this.overage.push(key);
						this.overage.push(value);
					} else {
						this.state.res.push({ key, value });
						cache.push(key);
						cache.push(value);
					}
				}

				this.cache[this.page] = cache;
			}
		}

		if (this.selectIndex > this.state.res.length - 1) {
			this.selectIndex = this.state.res.length - 1;
		}

		this.setState(
			{
				res: this.state.res,
				selectKey: this.state.res[this.selectIndex].key,
				selectValue: this.state.res[this.selectIndex].value,
			},
			() => {
				this.vlist.current.forceUpdateGrid();
			}
		);
	}

	render() {
		return (
			<div className="hash">
				<div className="top">
					{this.state.ttl !== -2 && this.state.size != -1 ? (
						<KeyInfo
							size={this.state.size}
							type={this.props.type}
							data={this.props.data}
							path={this.props.path}
							ttl={this.state.ttl}
						></KeyInfo>
					) : null}
				</div>
				<div className="middle">
					<Paper elevation={3} className="paper">
						<div className="top">
							<Paper elevation={3} className="paper">
								<Button variant="outlined" className="size">
									{this.state.size}
								</Button>
								<Select
									className="resType"
									variant={"standard"}
									inputProps={{ id: "uncontrolled-native" }}
									value={this.state.resType}
									onChange={(e) => this.setState({ resType: e.target.value })}
								>
									<MenuItem key={"text"} value={"text"}>
										text
									</MenuItem>
									<MenuItem key={"json"} value={"json"}>
										json
									</MenuItem>
								</Select>
							</Paper>
						</div>
						<div className="middle">
							<Paper elevation={3} className="paper">
								<div className="res">
									<div className="top">
										<Resizable
											defaultSize={{ width: 500 }}
											minWidth={500}
											maxWidth={800}
											bounds=".top"
											enable={{ right: true }}
											// disableDragging={true}
											className="left"
											grid={[1, 2]}
										>
											<AutoSizer>
												{({ width, height }) => (
													<Paper elevation={3} className="paper" elevation={3}>
														<VList
															ref={this.vlist}
															// className={styles.List}
															height={height}
															width={width}
															overscanRowCount={this.limit}
															// noRowsRenderer={this._noRowsRenderer}
															rowCount={this.state.res.length}
															rowHeight={height / this.show}
															rowRenderer={(value) => this.renderItem(value, height)}
															// scrollToIndex={this.selectIndex}
															scrollToAlignment="end"
															onScroll={this.onScroll}
														/>
													</Paper>
												)}
											</AutoSizer>
										</Resizable>
										<div className="right">
											<Paper elevation={3} className="top">
												<TextareaAutosize
													onChange={(e) => this.changeKey(e.target.value)}
													className="hash-key-content none-scrollbar"
													value={this.state.selectKey || ""}
													spellCheck={false}
												/>
											</Paper>
											<Paper elevation={3} className="middle">
												<TextareaAutosize
													onChange={(e) => this.changeValue(e.target.value)}
													className="hash-value-content none-scrollbar"
													value={this.state.selectValue || ""}
													spellCheck={false}
												/>
											</Paper>
										</div>
									</div>
									<div className="middle">
										<div className="left">
											<Button className="back" size="small" onClick={() => this.back()}>
												<ArrowBackIosIcon style={{ width: 18 }}></ArrowBackIosIcon>
											</Button>
											<Input
												size="small"
												className="page"
												// variant={"standard"}
												variant="outlined"
												inputProps={{ id: "uncontrolled-native" }}
												value={this.state.page}
												onChange={(e) => this.setState({ page: e.target.value })}
												onBlur={(e) => this.changePage(e.target.value)}
												autoComplete="off"
												spellCheck="false"
											/>
											<Button className="forward" size="small" onClick={() => this.forward()}>
												<ArrowForwardIosIcon style={{ width: 18 }}></ArrowForwardIosIcon>
											</Button>
										</div>
										<div className="right">
											<Button variant="contained" className="delete-row delete-row-button" onClick={() => this.deleteRow()}>
												deleterow
											</Button>
											<Button variant="contained" className="add-row add-row-button" onClick={() => this.addRow()}>
												addrow
											</Button>
											<Button variant="contained" className="save save-button" onClick={() => this.saveHash()}>
												save
											</Button>
										</div>
									</div>
								</div>
							</Paper>
						</div>
					</Paper>
				</div>
			</div>
		);
	}

	deleteRow() {
		Comfirm.open({
			width: "400px",
			height: "100px",
			title: "Delete Key",
			text: `Are you sure delete ${this.state.selectKey} ?`,
			actions: (
				<div>
					<Button autoFocus onClick={() => Comfirm.close()}>
						cancel
					</Button>
					<Button
						autoFocus
						onClick={async () => {
							// delete hash key
							let cmd = ["HDEL", this.props.path, this.state.selectKey];
							await Api.do(cmd);
							if (this.state.size == 1) {
								event.emitComponent(Left, "left-refresh", this.props.data);
								event.emitComponent(Right, "right-closeKey", this.props.data);
							} else {
								this.reset();
								await this.getHash(this.props.path);
								await this.getSize(this.props.path);
							}
							message.success("Delete Row Success");
							Comfirm.close();
						}}
					>
						submit
					</Button>
				</div>
			),
		});
	}

	addRow() {
		let addRowKey = "";
		let addRowValue = "";

		Comfirm.open({
			width: "400px",
			height: "150px",
			title: "Add Row",
			text: (
				<div style={{ height: "100%", display: "flex", justifyContent: "space-around", alignItems: "center", flexDirection: "column" }}>
					<Input
						className="add-row-key"
						style={{ width: "100%" }}
						variant={"standard"}
						placeholder="key"
						inputProps={{ id: "uncontrolled-native" }}
						defaultValue={addRowKey}
						onChange={(e) => (addRowKey = e.target.value)}
						autoComplete="off"
						spellCheck="false"
					/>
					<Input
						className="add-row-value"
						style={{ width: "100%" }}
						variant={"standard"}
						placeholder="value"
						inputProps={{ id: "uncontrolled-native" }}
						defaultValue={addRowValue}
						onChange={(e) => (addRowValue = e.target.value)}
						autoComplete="off"
						spellCheck="false"
					/>
				</div>
			),
			actions: (
				<div className="actions">
					<Button onClick={() => cancel()}>Cancel</Button>
					<Button autoFocus onClick={() => submit()}>
						Submit
					</Button>
				</div>
			),
		});

		let cancel = () => {
			Comfirm.close();
		};

		let submit = async () => {
			// hash add row
			let cmd = ["HSET", this.props.path, addRowKey, addRowValue];
			let res = await Api.do(cmd);
			if (res.code != 200) {
				message.error(res.msg);
			} else {
				this.reset();
				await this.getHash(this.props.path);
				await this.getSize(this.props.path);
				message.success("Add Row Success");
			}
			Comfirm.close();
		};
	}

	async saveHash() {
		let key = this.state.selectKey;
		let value = this.state.selectValue;

		let oldKey = this.state.res[this.selectIndex].key;
		let oldValue = this.state.res[this.selectIndex].value;
		if (oldValue == value && oldKey == key) {
			return message.error("no change");
		}

		if (oldKey != key) {
			let cmd = ["HDEL", this.props.path, oldKey];
			await Api.do(cmd);
		}

		let cmd = ["HSET", this.props.path, key, value];
		await Api.do(cmd);

		this.reset();
		await this.getHash(this.props.path);
		message.success("Add Row Success");
	}

	changeKey(key) {
		this.setState({ selectKey: key });
	}

	changeValue(value) {
		this.setState({ selectValue: value });
	}

	async changePage(page) {
		if (page < 1) {
			this.setState({ page: this.page });
			return;
		}
		if (page > Math.ceil(this.state.size / this.limit)) {
			this.setState({ page: this.page });
			return;
		}
		if (page == this.page) {
			return;
		}
		this.page = page;
		this.setState({ page: page });
		await this.getHash(this.props.path);
	}

	async forward() {
		if (this.limit * this.state.page >= this.state.size) {
			return;
		}
		this.page++;
		this.setState({ page: this.page });
		await this.getHash(this.props.path);
	}

	async back() {
		if (this.page == 1) {
			return;
		}
		this.page--;
		this.setState({ page: this.page });
		await this.getHash(this.props.path);
	}

	onScroll = (value) => {
		// console.log(value);
		// clientHeight + scrollTop = scrollHeight
	};

	renderItem = (value, height) => {
		if (value.index > this.state.res.length - 1) return;
		let classList = ["v-list-item"];
		if (this.selectIndex > this.state.res.length - 1) {
			this.selectIndex = this.state.res.length - 1;
		}

		this.state.res[this.selectIndex].select = true;
		if (this.state.res[value.index].select) {
			classList.push("v-list-item-background");
		}
		return (
			<div
				key={value.index}
				className={classList.join(" ")}
				style={{ ...value.style, lineHeight: height / this.show + "px" }}
				onClick={(el) => this.selectItem(el, value)}
			>
				<div className="i">{(this.page - 1) * this.limit + value.index + 1}</div>
				<div className="key">{this.state.res[value.index].key}</div>
				<div className="value">{this.state.res[value.index].value}</div>
			</div>
		);
	};

	selectIndex = 0;
	vlist = React.createRef();

	selectItem(el, value) {
		let { res } = this.state;
		res[this.selectIndex].select = false;

		this.selectIndex = value.index;
		res[value.index].select = true;

		this.setState({ res, selectValue: res[value.index].value, selectKey: res[value.index].key }, () => {
			this.vlist.current.forceUpdateGrid();
		});
	}
}

export default Hash;
