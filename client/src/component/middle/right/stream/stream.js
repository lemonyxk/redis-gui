import React, { Component } from "react";
import "./stream.scss";
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

class Stream extends Component {
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
		selectID: "",
	};

	componentDidMount() {
		this.init();
	}

	async init() {
		this.getTTL(this.props.path);
		this.getStream(this.props.path);
		this.getSize(this.props.path);
	}

	async getTTL(key) {
		let res = await Api.do(["TTL", key]);
		this.setState({ ttl: res.msg });
	}

	async getSize(key) {
		let res = await Api.do(["XINFO", "STREAM", key]);
		this.setState({ size: res.msg[1] });
	}

	iter = "+";
	cache = {};

	reset() {
		this.state.page = 1;
		this.page = 1;
		this.iter = "+";
		this.cache = {};
	}

	async getStream(key) {
		// this.selectIndex = 0;
		this.state.res = [];

		if (this.cache[this.page]) {
			let res = this.cache[this.page];
			for (let i = 0; i < res.length; i++) {
				let data = res[i];
				let id = data[0];
				let key = data[1][0];
				let value = data[1][1];
				this.state.res.push({ id, key, value });
			}
		} else {
			let res = await Api.do(["XREVRANGE", key, this.iter, "-", "COUNT", this.limit + 1]);
			this.iter = res.msg[res.msg.length - 1][0];
			if (res.msg.length > this.limit) {
				res.msg = res.msg.slice(0, res.msg.length - 1);
			}
			let cache = [];
			for (let i = 0; i < res.msg.length; i++) {
				let data = res.msg[i];
				let id = data[0];
				let key = data[1][0];
				let value = data[1][1];
				cache.push(data);
				this.state.res.push({ id, key, value });
			}
			this.cache[this.page] = cache;
		}

		if (this.selectIndex > this.state.res.length - 1) {
			this.selectIndex = this.state.res.length - 1;
		}
		this.setState(
			{
				res: this.state.res,
				selectID: this.state.res[this.selectIndex].id,
			},
			() => {
				this.vlist.current.forceUpdateGrid();
			}
		);
	}

	render() {
		return (
			<div className="stream">
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
													<Paper elevation={3} className="paper">
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
											<Paper elevation={3} className="top-id">
												<TextareaAutosize
													className="stream-id-content none-scrollbar"
													value={this.state.res[this.selectIndex] ? this.state.res[this.selectIndex].id : ""}
													spellCheck={false}
												/>
											</Paper>
											<Paper elevation={3} className="top">
												<TextareaAutosize
													className="stream-key-content none-scrollbar"
													value={this.state.res[this.selectIndex] ? this.state.res[this.selectIndex].key : ""}
													spellCheck={false}
												/>
											</Paper>
											<Paper elevation={3} className="middle">
												<TextareaAutosize
													className="stream-value-content none-scrollbar"
													value={this.state.res[this.selectIndex] ? this.state.res[this.selectIndex].value : ""}
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
			text: `Are you sure delete ${this.state.selectID} ?`,
			actions: (
				<div>
					<Button autoFocus onClick={() => Comfirm.close()}>
						cancel
					</Button>
					<Button
						autoFocus
						onClick={async () => {
							// delete stream key
							// XDEL my-stream 1647358926226-0
							let cmd = ["XDEL", this.props.path, this.state.selectID];
							await Api.do(cmd);
							if (this.state.size == 1) {
								let cmd = ["DEL", this.props.path];
								await Api.do(cmd);
								event.emitComponent(Left, "left-refresh", this.props.data);
								event.emitComponent(Right, "right-closeKey", this.props.data);
							} else {
								this.reset();
								this.getStream(this.props.path);
								this.getSize(this.props.path);
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
		let addRowID = "*";
		let addRowkey = "";
		let addRowValue = "";

		Comfirm.open({
			width: "400px",
			height: "150px",
			title: "Add Row",
			text: (
				<div style={{ height: "100%", display: "flex", justifyContent: "space-around", alignItems: "center", flexDirection: "column" }}>
					<Input
						className="add-row-id"
						style={{ width: "100%" }}
						variant={"standard"}
						placeholder="id"
						inputProps={{ id: "uncontrolled-native" }}
						defaultValue={addRowID}
						onChange={(e) => (addRowID = e.target.value)}
						autoComplete="off"
						spellCheck="false"
					/>
					<Input
						className="add-row-key"
						style={{ width: "100%" }}
						variant={"standard"}
						placeholder="score"
						inputProps={{ id: "uncontrolled-native" }}
						defaultValue={addRowkey}
						onChange={(e) => (addRowkey = e.target.value)}
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
			// stream add row
			//  XADD my-stream * a 1
			let cmd = ["XADD", this.props.path, addRowID, addRowkey, addRowValue];
			let res = await Api.do(cmd);
			if (res.code != 200) {
				message.error(res.msg);
			} else {
				this.reset();
				await this.getStream(this.props.path);
				this.getSize(this.props.path);
				message.success("Add Row Success");
			}
			Comfirm.close();
		};
	}

	changePage(page) {
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
		this.getStream(this.props.path);
	}

	forward() {
		if (this.limit * this.state.page >= this.state.size) {
			return;
		}
		this.page++;
		this.setState({ page: this.page });
		this.getStream(this.props.path);
	}

	back() {
		if (this.page == 1) {
			return;
		}
		this.page--;
		this.setState({ page: this.page });
		this.getStream(this.props.path);
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
				<div className="id">{this.state.res[value.index].id}</div>
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

		this.setState({ res, selectID: res[value.index].id }, () => {
			this.vlist.current.forceUpdateGrid();
		});
	}
}

export default Stream;
