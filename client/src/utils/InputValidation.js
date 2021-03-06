/* eslint-disable consistent-return */
import _ from 'lodash';

const InputValidation = {
	validateListName(listName) {
		if (!listName) return new Error('Name is invalid');
		if (_.trim(listName).length <= 0) return new Error('Name cannot be empty');
		if (listName.length > 36) return new Error('Maximum of 36 characters allowed');
	},

	validateUsername(val) {
		const username = _.trim(val);
		if (_.size(username) <= 0 || _.size(username) > 16) {
			return new Error('Username must be between 1 & 16 characters');
		}
	},

	// Further email validation will be done by firebase
	validateEmail(val) {
		const email = _.trim(val);
		if (_.isEmpty(email)) {
			return new Error('Email cannot be empty');
		}
		if (!email.includes('@')) {
			return new Error('Please enter a valid email');
		}
	},

	validatePasswordsAreEqual(password, confirm) {
		if (password !== confirm) {
			return new Error('Passwords don\'t match');
		}
	},

	validatePassword(password) {
		if (_.size(password) < 6) {
			return new Error('Password must have at least 6 characters');
		}
	},

	// assuming tax over 100% is invalid
	validateTax(val) {
		const amount = _.trim(val);
		if (_.isEmpty(amount)) {
			return new Error('Tax cannot be empty');
		}

		/* eslint-disable-next-line no-restricted-globals */
		if (isNaN(amount)) {
			return new Error('Tax must be a valid number');
		}

		if (Number(amount) < 0 || Number(amount) > 100) {
			return new Error('Tax must be between 0 & 100');
		}
	},

	validateNumber(val) {
		/* eslint-disable-next-line no-restricted-globals */
		if (isNaN(parseFloat(val))) {
			return new Error('Please enter a valid number');
		}
	},
};

export default InputValidation;
