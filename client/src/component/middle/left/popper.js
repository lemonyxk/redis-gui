import React from "react";
import "./left.scss";
import { Input, Paper, InputLabel, FormControl } from "@mui/material";
import keyInfo from "../../../common/key";
import Popper from "../../../common/popper";

var fn = (self) => {
	return (
		<Popper
			open={!!self.state.onOpenPopper}
			onClose={() => {
				var v = self.findNode(self.selectedNodeID);
				if (v.path != self.popperValue) {
					keyInfo.rename(v, self.popperValue, false, false);
				}
				self.closePopper();
			}}
			anchorEl={self.state.onOpenPopper}
			transition
		>
			<Paper className="popper">
				<div>
					<FormControl fullWidth>
						<InputLabel variant="standard" htmlFor="uncontrolled-native">
							rename
						</InputLabel>
						<Input
							spellCheck={false}
							variant={"standard"}
							inputself={{ id: "uncontrolled-native" }}
							defaultValue={(() => {
								var v = self.findNode(self.selectedNodeID);
								var r = v ? v.path : "";
								self.popperValue = r;
								return r;
							})()}
							onChange={(e) => {
								self.popperValue = e.target.value;
							}}
							autoComplete="off"
							onClick={(e) => e.stopPropagation()}
							onKeyDown={(e) => {
								if (e.keyCode == 13) {
									var v = self.findNode(self.selectedNodeID);
									keyInfo.rename(v, self.popperValue, false, false);
									return self.closePopper();
								}
							}}
						/>
					</FormControl>
				</div>
			</Paper>
		</Popper>
	);
};

export default fn;
