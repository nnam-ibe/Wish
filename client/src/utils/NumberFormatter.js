const _ = require('lodash');

module.exports = {
	formatMoney: (amount) => {
		amount = _.toNumber(amount);
		if (isNaN(amount)) return 0;

		if (amount < 0) return 0;

		return _.round(amount, 2);
	},

	/*
	* @param taxRate should be in percentage
	*/
	calculateTax: (amount, taxRate) => {
		return (1 + (taxRate/100)) * amount;
	}
};