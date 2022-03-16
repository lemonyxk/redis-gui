import { toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

class Message {
	constructor() {
		this.config = {
			autoClose: 1000,
			type: toast.TYPE.INFO,
			hideProgressBar: true,
			position: toast.POSITION.TOP_CENTER,
			pauseOnHover: true,
			transition: Flip,
			// progress: 0.2,
		};
	}

	close() {
		toast.dismiss();
	}

	id = null;

	loading(msg) {
		if (this.id) {
			toast.dismiss(this.id);
		}

		const id = toast.loading(msg, this.config);
		this.id = id;
		return {
			done: function (msg) {
				toast.update(id, { render: msg, type: "success", isLoading: false });
				toast.dismiss(id);
			},
		};
	}

	cahceID = null;

	message(msg) {
		if (this.cahceID) {
			toast.dismiss(this.cahceID);
		}
		this.cahceID = toast(msg, { ...this.config, type: toast.TYPE.DEFAULT });
	}

	info(msg) {
		if (this.cahceID) {
			toast.dismiss(this.cahceID);
		}
		this.cahceID = toast(msg, { ...this.config, type: toast.TYPE.INFO });
	}

	error(msg) {
		if (this.cahceID) {
			toast.dismiss(this.cahceID);
		}
		this.cahceID = toast(msg, { ...this.config, type: toast.TYPE.ERROR });
	}

	success(msg) {
		if (this.cahceID) {
			toast.dismiss(this.cahceID);
		}
		this.cahceID = toast(msg, { ...this.config, type: toast.TYPE.SUCCESS });
	}

	warning(msg) {
		if (this.cahceID) {
			toast.dismiss(this.cahceID);
		}
		this.cahceID = toast(msg, { ...this.config, type: toast.TYPE.WARNING });
	}
}

export default new Message();
