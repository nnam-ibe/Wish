const Big = require('big.js');
const NumberFormatter = {};

NumberFormatter.getBig = (value) => {
	if (isNaN(value)) return new Big(0);
	return new Big(value);
};

// TODO: Nearing extintion
NumberFormatter.toFixedTwo = (value) => {
	let result = Number(value);
	if (isNaN(value)) return 0;
	if (value < 0) return 0;

	return value.toFixed(2);
};

// TODO: Needs tests
NumberFormatter.formatMoney = (amount) => {
	return String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/*
* @param taxRate should be in percentage
*/
NumberFormatter.calculateTax = (amount, taxRate) => {
	if (amount < 0) return 0;
	if (taxRate < 0) return amount;
	var rawValue = (1 + (taxRate/100)) * amount;
	return NumberFormatter.toFixedTwo(rawValue);
};

module.exports = NumberFormatter;