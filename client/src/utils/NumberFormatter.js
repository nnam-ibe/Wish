const Big = require('big.js');
const NumberFormatter = {};

NumberFormatter.getBig = (value) => {
	if (isNaN(value) || value === null || value === '') return new Big(0);
	return new Big(value);
};

NumberFormatter.formatMoney = (amount) => {
	return String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

NumberFormatter.getNumber = (value) => {
	if (!value) return 0;
	return Number(value.toString());
};

module.exports = NumberFormatter;