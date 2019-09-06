const moment = require('moment');

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

module.exports = Logger;