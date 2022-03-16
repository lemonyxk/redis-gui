import React, { Component } from "react";
import "./zset.scss";
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

class ZSet extends Component {
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
		selectScore: "",
		selectValue: "",
	};

	componentDidMount() {
		this.init();
	}

	async init() {
		this.getTTL(this.props.path);
		this.getZSet(this.props.path);
		this.getSize(this.props.path);
	}

	async getTTL(key) {
		let res = await Api.do(["TTL", key]);
		this.setState({ ttl: res.msg });
	}

	async getSize(key) {
		let res = await Api.do(["ZCARD", key]);
		this.setState({ size: res.msg });
	}

	async getZSet(key) {
		// this.selectIndex = 0;
		this.state.res = [];
		let res = await Api.do(["ZRANGE", key, this.limit * (this.page - 1), this.limit * this.page - 1, "WITHSCORES"]);
		for (let i = 0; i < res.msg.length; i += 2) {
			var value = res.msg[i];
			var score = res.msg[i + 1];
			score = String(parseFloat(score));
			this.state.res.push({ value, score });
		}
		if (this.selectIndex > this.state.res.length - 1) {
			this.selectIndex = this.state.res.length - 1;
		}
		this.setState(
			{
				res: this.state.res,
				selectScore: this.state.res[this.selectIndex].score,
				selectValue: this.state.res[this.selectIndex].value,
			},
			() => {
				this.vlist.current.forceUpdateGrid();
			}
		);
	}

	render() {
		return (
			<div className="zset">
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
					<Paper className="paper">
						<div className="top">
							<Paper className="paper">
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
							<Paper className="paper">
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
													<Paper className="paper" elevation={3}>
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
											<Paper className="top" elevation={3}>
												<TextareaAutosize
													onChange={(e) => this.changeScore(e.target.value)}
													className="zset-score-content none-scrollbar"
													value={this.state.selectScore || ""}
													spellCheck={false}
												/>
											</Paper>
											<Paper className="middle" elevation={3}>
												<TextareaAutosize
													onChange={(e) => this.changeValue(e.target.value)}
													className="zset-value-content none-scrollbar"
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
											<Button variant="contained" className="save save-button" onClick={() => this.saveZSet()}>
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
			text: `Are you sure delete ${this.state.selectValue} ?`,
			actions: (
				<div>
					<Button autoFocus onClick={() => Comfirm.close()}>
						cancel
					</Button>
					<Button
						autoFocus
						onClick={async () => {
							// delete zset key
							var cmd = ["zrem", this.props.path, this.state.selectValue];
							await Api.do(cmd);
							if (this.state.size == 1) {
								event.emitComponent(Left, "left-deleteKey", this.props.data);
								event.emitComponent(Right, "right-closeKey", this.props.data);
							} else {
								this.getZSet(this.props.path);
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
		var addRowScore = "";
		var addRowValue = "";

		Comfirm.open({
			width: "400px",
			height: "150px",
			title: "Add Row",
			text: (
				<div style={{ height: "100%", display: "flex", justifyContent: "space-around", alignItems: "center", flexDirection: "column" }}>
					<Input
						className="add-row-score"
						style={{ width: "100%" }}
						variant={"standard"}
						placeholder="score"
						inputProps={{ id: "uncontrolled-native" }}
						defaultValue={addRowScore}
						onChange={(e) => (addRowScore = e.target.value)}
						autoComplete="off"
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

		var cancel = () => {
			Comfirm.close();
		};

		var submit = async () => {
			// zset add row
			var cmd = ["zadd", this.props.path, addRowScore, addRowValue];
			var res = await Api.do(cmd);
			if (res.code != 200) {
				message.error(res.msg);
			} else {
				await this.getZSet(this.props.path);
				this.getSize(this.props.path);
				message.success("Add Row Success");
			}
			Comfirm.close();
		};
	}

	async saveZSet() {
		var score = this.state.selectScore;
		var value = this.state.selectValue;

		if (!score.match(/[+-]?([0-9]*[.])?[0-9]+/) || isNaN(score)) {
			return message.error("score must be a number");
		}

		score = String(parseFloat(score));

		var oldValue = this.state.res[this.selectIndex].value;
		var oldScore = this.state.res[this.selectIndex].score;
		if (oldValue == value && oldScore == score) {
			return message.error("no change");
		}

		if (value != oldValue) {
			// remove
			var cmd = ["zrem", this.props.path, oldValue];
			await Api.do(cmd);
		}

		var cmd = ["zadd", this.props.path, score, value];
		await Api.do(cmd);

		this.state.res[this.selectIndex].value = value;
		this.state.res[this.selectIndex].score = score;
		this.setState({ res: this.state.res }, () => {
			this.vlist.current.forceUpdateGrid();
		});

		message.success("save success");
	}

	changeScore(score) {
		this.setState({ selectScore: score });
	}

	changeValue(value) {
		this.setState({ selectValue: value });
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
		this.getZSet(this.props.path);
	}

	forward() {
		if (this.limit * this.state.page >= this.state.size) {
			return;
		}
		this.page++;
		this.setState({ page: this.page });
		this.getZSet(this.props.path);
	}

	back() {
		if (this.page == 1) {
			return;
		}
		this.page--;
		this.setState({ page: this.page });
		this.getZSet(this.props.path);
	}

	onScroll = (value) => {
		// console.log(value);
		// clientHeight + scrollTop = scrollHeight
	};

	renderItem = (value, height) => {
		if (value.index > this.state.res.length - 1) return;
		var classList = ["v-list-item"];
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
				<div className="key">{this.state.res[value.index].score}</div>
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

		this.setState({ res, selectValue: res[value.index].value, selectScore: res[value.index].score }, () => {
			this.vlist.current.forceUpdateGrid();
		});
	}
}

export default ZSet;