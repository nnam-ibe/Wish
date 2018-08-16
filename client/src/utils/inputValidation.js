let _ = require('lodash');

module.exports = {
	validateUsername: (usernameElement) => {
		let result = {};
		let username = _.trim(usernameElement.value);
		if (_.size(username) <= 0 || _.size(username) > 16 || !usernameElement.checkValidity() ) {
			result.username = {
				error: true,
				helperText: 'Username must be between 1 & 16 characters'
			};
		}
		return result;
	},

	validateEmail: (emailElement) => {
		let result = {};
		if (!emailElement.checkValidity()) {
			result.email = {
				error: true,
				helperText: 'Enter a valid email'
			}
		}
		return result;
	},

	validatePassword: (passwordElement) => {
		let result = {};
		let password = passwordElement.value;
		if(!passwordElement.checkValidity()) {
			result.password = {
				error:  true,
				helperText: passwordElement.validationMessage
			};

		} else if (_.size(password) < 6) {
			result.password = {
				error: true,
				helperText: 'Password must have at 6 characters'
			}
		}
		return result;
	},

	validatePasswordsAreEqual: (passwordElement, confirmElement) => {
		let result = {};
		let password = passwordElement.value;
		let confirm = confirmElement.value;

		if (password !== confirm) {
			const passResult = {
				error:  true,
				helperText: 'Passwords don\'t match'
			};

			_.set(result, 'password', passResult);
			_.set(result, 'confirmPassword', passResult);
		}
		return result;
	},

	validateString: (value, fieldName, caption) => {
		let result = {};

		if (_.isEmpty(_.trim(value))) {
			result[fieldName] = {
				error: true,
				helperText: `${caption} cannot be empty`
			};
		}

		return result;
	},

	validateAmount: (amount, fieldName, caption) => {
		let result = {};

		if(_.isEmpty(_.trim(amount))) {
			result[fieldName] = {
				error: true,
				helperText: `${caption} cannot be empty`
			};
		}

		return result;
	}
};