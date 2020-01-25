/* eslint-disable consistent-return */
import _ from 'lodash';

export const validateListName = (listName) => {
	if (!listName) return new Error('Name is invalid');
	if (_.trim(listName).length <= 0) return new Error('Name cannot be empty');
	if (listName.length > 36) return new Error('Maximum of 36 characters allowed');
};

export const validateUsername = (val) => {
	const username = _.trim(val);
	if (_.size(username) <= 0 || _.size(username) > 16) {
		return new Error('Username must be between 1 & 16 characters');
	}
};

// Further email validation will be done by firebase
export const validateEmail = (val) => {
	const email = _.trim(val);
	if (_.isEmpty(email)) {
		return new Error('Email cannot be empty');
	}
	if (!email.includes('@')) {
		return new Error('Please enter a valid email');
	}
};

export const validatePasswordsAreEqual = (password, confirm) => {
	if (password !== confirm) {
		return new Error('Passwords don\'t match');
	}
};

export const validatePassword = (password) => {
	if (_.size(password) < 6) {
		return new Error('Password must have at least 6 characters');
	}
};

// assuming tax over 100% is invalid
export const validateTax = (val) => {
	const amount = _.trim(val);
	if (_.isEmpty(amount)) {
		return new Error('Tax cannot be empty');
	}

	if (Number.isNaN(amount)) {
		return new Error('Tax must be a valid number');
	}

	if (Number(amount) < 0 || Number(amount) > 100) {
		return new Error('Tax must be between 0 & 100');
	}
};

export const validateNumber = (val) => {
	if (Number.isNaN(parseFloat(val))) {
		return new Error('Please enter a valid number');
	}
};
