import { Comfirm } from "../common/comfirm";
import message from "../tools/message";
import event from "../tools/event";
import { Button } from "@mui/material";
import Api from "../tools/api";
import Left from "../component/middle/left/left";
import Right from "../component/middle/right/right";

let keyInfo = {
	delete: (node) => {
		Comfirm.open({
			width: "400px",
			height: "100px",
			title: "Delete Key",
			text: `Are you sure delete ${node.path} ?`,
			actions: (
				<div>
					<Button onClick={() => Comfirm.close()}>cancel</Button>
					<Button
						onClick={async () => {
							// delete redis key
							let cmd = ["DEL", node.path];
							let res = await Api.do(cmd);
							if (res.msg == "1") {
								event.emitComponent(Left, "left-refresh", node);
								event.emitComponent(Right, "right-closeKey", node);
								message.success("delete success");
							} else {
								message.error(res.msg);
							}
							Comfirm.close();
						}}
					>
						submit
					</Button>
				</div>
			),
		});
	},

	rename: (node, changePath, openRight = true, closeRight = true) => {
		Comfirm.open({
			width: "400px",
			height: "100px",
			title: "Rename Key",
			text: `Are you sure rename ${node.path} to ${changePath}?`,
			actions: (
				<div>
					<Button onClick={() => Comfirm.close()}>cancel</Button>
					<Button
						onClick={async () => {
							// rename redis key
							if (changePath == node.path) {
								message.error("no change");
								Comfirm.close();
								return;
							}
							let cmd = ["RENAME", node.path, changePath];
							let res = await Api.do(cmd);
							if (res.msg == "OK") {
								closeRight && event.emitComponent(Right, "right-closeKey", node);
								event.emitComponent(Left, "left-rename", { ...node, changePath: changePath });
								openRight && event.emitComponent(Right, "right-activeKey", { ...node, path: changePath });
								message.success("rename success");
							} else {
								message.error(res.msg);
							}
							Comfirm.close();
						}}
					>
						submit
					</Button>
				</div>
			),
		});
	},
};

export default keyInfo;
