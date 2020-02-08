import Big from 'big.js';

export const getBig = (value) => {
	/* eslint-disable-next-line no-restricted-globals */
	if (isNaN(value) || value === null || value === '') return new Big(0);
	return new Big(value);
};

export const formatMoney = (amount) => String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const getNumber = (value) => {
	if (!value) return 0;
	return Number(value.toString());
};
