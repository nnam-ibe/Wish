import moment from 'moment';

class Logger {
	constructor(fileId) {
		this.fileId = fileId;
	}

	info(...args) {
		console.log(moment().format(), `[${this.fileId}]`, ...args);
	}

	error(...args) {
		console.error(new Date(), `[${this.fileId}]`, ...args);
	}
}

export default Logger;
