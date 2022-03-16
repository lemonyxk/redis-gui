import * as React from "react";
import PropTypes from "prop-types";

import { IconButton, DialogActions, DialogContent, DialogTitle, Dialog, styled } from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";

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

export default function CustomizedDialogs(props) {
	let width = props.width === null ? 800 : parseInt(props.width);
	let height = props.height === null ? 500 : parseInt(props.height);
	let padding = parseInt(props.padding);

	const BootstrapDialog = styled(Dialog)(({ theme }) => ({
		"& .MuiDialogContent-root": {
			padding: padding !== null ? padding : theme.spacing(2),
		},
		"& .MuiDialogActions-root": {
			padding: theme.spacing(1),
		},
		"& .MuiPaper-root": {
			width: width,
			height: height + 64 + 52.5,
		},
		"& .MuiDialog-container": {
			width: "100%",
			height: "100%",
		},
	}));

	const [open, setOpen] = React.useState(true);

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>
			<BootstrapDialog
				// onClose={handleClose}
				aria-labelledby="customized-dialog-title"
				open={open}
				fullWidth={true}
				maxWidth={"lg"}
			>
				{props.title ? (
					<BootstrapDialogTitle style={{ height: 64 }} id="customized-dialog-title" onClose={props.onClose}>
						{props.title}
					</BootstrapDialogTitle>
				) : null}
				<DialogContent style={{ height: height, width: width }} dividers>
					{props.content}
				</DialogContent>
				{props.actions ? <DialogActions style={{ height: 52.5 }}>{props.actions}</DialogActions> : null}
			</BootstrapDialog>
		</div>
	);
}
