import React, { Component } from "react";

import PropTypes from "prop-types";

import { Button, IconButton, DialogActions, DialogContent, DialogTitle, Dialog, styled, DialogContentText } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

let Comfirm = {
	__view: null,
	open: (config = {}) => {
		Comfirm.__view.onOpen(config);
	},
	close: () => {
		Comfirm.__view.onClose();
	},
};

const BootstrapDialogTitle = (props) => {
	const { children, onClose, ...other } = props;
	return (
		<DialogTitle sx={{ m: 0, p: 2 }} {...other}>
			{children}
			{onClose ? (
				<IconButton
					aria-label="close"
					onClick={onClose}
					style={{
						position: "absolute",
						right: 8,
						top: 8,
						color: (theme) => theme.palette.grey[500],
					}}
				>
					<CloseIcon />
				</IconButton>
			) : null}
		</DialogTitle>
	);
};

BootstrapDialogTitle.propTypes = {
	children: PropTypes.node,
	onClose: PropTypes.func.isRequired,
};

// function ComfirmContainer(props) {
// 	let width = props.width === null ? 800 : parseInt(props.width);
// 	let height = props.height === null ? 500 : parseInt(props.height);
// 	let padding = parseInt(props.padding);

// 	const BootstrapDialog = styled(Dialog)(({ theme }) => ({
// 		"& .MuiDialogContent-root": {
// 			padding: padding !== null ? padding : theme.spacing(2),
// 		},
// 		"& .MuiDialogActions-root": {
// 			padding: theme.spacing(1),
// 		},
// 		"& .MuiPaper-root": {
// 			width: width,
// 			height: height + 64 + 52.5,
// 		},
// 		"& .MuiDialog-container": {
// 			width: "100%",
// 			height: "100%",
// 		},
// 	}));

// 	const [open, setOpen] = React.useState(false);

// 	return (
// 		<div>
// 			<BootstrapDialog
// 				// onClose={handleClose}
// 				aria-labelledby="customized-dialog-title"
// 				open={open}
// 				fullWidth={true}
// 				maxWidth={"lg"}
// 			>
// 				{props.title ? (
// 					<BootstrapDialogTitle style={{ height: 64 }} id="customized-dialog-title" onClose={props.onClose}>
// 						{props.title}
// 					</BootstrapDialogTitle>
// 				) : null}
// 				<DialogContent style={{ height: height, width: width }} dividers>
// 					{props.content}
// 				</DialogContent>
// 				{props.actions ? <DialogActions style={{ height: 52.5 }}>{props.actions}</DialogActions> : null}
// 			</BootstrapDialog>
// 		</div>
// 	);
// }

class ComfirmContainer extends Component {
	constructor(props) {
		super(props);
		Comfirm.__view = this;
	}

	state = { open: false };

	title = "";
	text = "";

	onOpen(config = {}) {
		this.width = config.width === undefined ? 800 : parseInt(config.width);
		this.height = config.height === undefined ? 500 : parseInt(config.height);
		this.padding = parseInt(config.padding);

		this.BootstrapDialog = styled(Dialog)(({ theme }) => ({
			"& .MuiDialogContent-root": {
				padding: this.padding !== undefined ? this.padding : theme.spacing(2),
			},
			"& .MuiDialogActions-root": {
				padding: theme.spacing(1),
			},
			"& .MuiPaper-root": {
				width: this.width,
				height: this.height + 64 + 52.5,
			},
			"& .MuiDialog-container": {
				width: "100%",
				height: "100%",
			},
		}));

		this.actions = config.actions;

		this.submit = () => {
			config.submit && config.submit();
			this.setState({ open: false });
		};
		this.cancel = () => {
			config.cancel && config.cancel();
			this.setState({ open: false });
		};

		this.title = config.title || "";
		this.text = config.text || "";

		this.setState({ open: true });
	}

	onClose() {
		this.setState({ open: false });
	}

	render() {
		return (
			<div>
				{this.state.open ? (
					<this.BootstrapDialog
						// onClose={handleClose}
						aria-labelledby="customized-dialog-title"
						open={this.state.open}
						fullWidth={true}
						maxWidth={"lg"}
					>
						{this.title ? (
							<BootstrapDialogTitle style={{ height: 64 }} id="customized-dialog-title" onClose={() => this.onClose()}>
								{this.title}
							</BootstrapDialogTitle>
						) : null}
						<DialogContent style={{ height: this.height, width: this.width }} dividers>
							{this.text}
						</DialogContent>
						{this.actions ? <DialogActions style={{ height: 52.5 }}>{this.actions}</DialogActions> : null}
					</this.BootstrapDialog>
				) : null}
			</div>
		);
	}
}

function ComfirmBox(props) {
	return (
		<div style={{ height: "100%", display: "flex", justifyContent: "space-around", alignItems: "center", flexDirection: "column" }}>
			{props.children}
		</div>
	);
}

export { ComfirmContainer, ComfirmBox, Comfirm };

// <Dialog fullScreen={false} fullWidth={true} open={this.state.open} aria-labelledby="responsive-dialog-title">
// 	<DialogTitle id="responsive-dialog-title">{this.title}</DialogTitle>
// 	<DialogContent>
// 		<DialogContentText>{this.text}</DialogContentText>
// 	</DialogContent>
// 	<DialogActions>
// 		<Button autoFocus onClick={() => this.cancel()}>
// 			cancel
// 		</Button>
// 		<Button onClick={() => this.submit()} autoFocus>
// 			submit
// 		</Button>
// 	</DialogActions>
// </Dialog>
