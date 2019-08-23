const _ = require('lodash');

const NumberFormatter = {};

NumberFormatter.formatMoney = (amount) => {
	amount = _.toNumber(amount);
	if (isNaN(amount)) return 0;

	if (amount < 0) return 0;

	return _.round(amount, 2);
},

/*
* @param taxRate should be in percentage
*/
NumberFormatter.calculateTax = (amount, taxRate) => {
	if (taxRate < 0) return amount;
	if (amount < 0) return 0;
	var rawValue = (1 + (taxRate/100)) * amount;
	return NumberFormatter.formatMoney(rawValue);
}

module.exports = NumberFormatter;