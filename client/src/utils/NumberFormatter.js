var _ = require('lodash');

module.exports = {
	formatMoney: (amount) => {
		amount = _.toNumber(amount);
		if (isNaN(amount)) return 0;

		amount = _.round(amount, 2);
		if (Number.isSafeInteger(amount)) amount = _.round(amount, 0);

		return amount;
	}
};