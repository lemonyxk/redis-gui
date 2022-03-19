import React from "react";
import "./left.scss";
import { Button } from "@mui/material";
import { MenuItem as RMenuItem, Menu as RMenu } from "@material-ui/core";

import Divider from "@mui/material/Divider";
import message from "../../../tools/message";

var fn = (self) => {
	return (
		<RMenu
			anchorEl={self.state.onOpenMenu}
			open={!!self.state.onOpenMenu}
			onClose={() => self.closeMenu()}
			// MenuListself={{ "aria-labelledby": "basic-button" }}
			// getContentAnchorEl={null}
			anchorReference={"anchorPosition"}
			anchorPosition={{
				top: self.menuEvent ? self.menuEvent.pageY : 0,
				left: self.menuEvent ? self.menuEvent.pageX : 0,
			}}
			onContextMenuCapture={(e) => e.preventDefault()}
			className="left-menu"
			autoFocus={false}
		>
			<RMenuItem
				className="left-menu-list"
				onClick={() => {
					var node = self.findNode(self.selectedNodeID);
					if (node) {
						self.onNode(node);
					}
					self.closeMenu();
				}}
			>
				<Button size="small" className="normal-color">
					open
				</Button>
			</RMenuItem>
			<Divider />

			<RMenuItem
				className="left-menu-list"
				onClick={(e) => {
					e.stopPropagation();
					var node = self.findNode(self.selectedNodeID);
					let text = node.path;
					navigator.clipboard.writeText(text);
					self.closeMenu();
					message.success("copy success");
				}}
			>
				<Button size="small" className="normal-color">
					Copy Key
				</Button>
			</RMenuItem>
			<Divider />

			<RMenuItem
				className="left-menu-list"
				onClick={() => {
					self.refresh(self.selectedNodeID);
					self.closeMenu();
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
					self.start(self.state.db);
					self.closeMenu();
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
					// keyInfo.rename(self.selectedNodeID);
					self.closeMenu();
					self.openPopper(e);
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
					var n = self.findNode(self.selectedNodeID);
					if (!n) return;
					keyInfo.delete(n);
					self.closeMenu();
				}}
			>
				<Button size="small" className="error-color">
					delete
				</Button>
			</RMenuItem>
		</RMenu>
	);
};

export default fn;
