class Utils {
	after(time) {
		return new Promise((resolve) => setTimeout(resolve, time));
	}
}

export default new Utils();
