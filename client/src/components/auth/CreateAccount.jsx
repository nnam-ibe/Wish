import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import _ from 'lodash';
import FetchUtil from '../../utils/fetchUtil.js';
import InputValidation from '../../utils/InputValidation.js';

const validField = { error: false, helperText: '' };

class CreateAccount extends Component {

	constructor(props) {
		super(props);

		this.state = {
			fields: {
				username: validField,
				email: validField,
				password: validField,
				confirmPassword: validField
			},
			showProgressBar: false
		};
	};

	createAccount = (e) => {
		e.preventDefault();
		this.setState({ showProgressBar: true });
		let args = {
			username: document.getElementById('username'),
			email: document.getElementById('email'),
			password: document.getElementById('password'),
			confirmPassword: document.getElementById('confirmPassword')
		};

		if ( !this._validateInputs(args) ) {
			this.setState({ showProgressBar: false });
			return;
		}

		FetchUtil.put(`/api/create/account`, {
			username: _.trim(args.username.value),
			email: args.email.value,
			password: args.password.value
		})
		.then(res => {
			if (res.ok) {
				return this.props.history.push('/login');
			}
			return res.json();
		})
		.then(data => {
			let fields = this.state.fields;
			if (_.includes(data.code, 'email')) {
				_.set(fields, 'email', { error: true, helperText: data.message });
			} else {
				_.set(fields, 'password', { error: true, helperText: data.message });
				_.set(fields, 'confirmPassword', { error: true, helperText: data.message });
			}
			this.setState({ fields, showProgressBar: false });
		})
		.catch(err => {
			let fields = this.state.fields;
			_.set(fields, 'email', { error: true, helperText: err.toString() });
			this.setState({ fields, showProgressBar: false });
		});
	};

	render() {
		let fields = this.state.fields;
		let progessBar = ( <LinearProgress/> );

		return (
			<div className='auth-component'>
				<Paper>
					{ this.state.showProgressBar && progessBar }
					<div className='auth-paper'>
						<form>
							<Typography variant='h6'>Create your Account</Typography>
							<TextField
								margin='dense'
								id='username'
								label='Username'
								error={fields.username.error}
								helperText={fields.username.helperText}
								fullWidth
								required
							/>
							<TextField
								margin='dense'
								id='email'
								label='Email Address'
								type='email'
								error={fields.email.error}
								helperText={fields.email.helperText}
								fullWidth
								required
							/>
							<TextField
								margin='dense'
								id='password'
								label='Password'
								type='password'
								error={fields.password.error}
								helperText={fields.password.helperText}
								fullWidth
								required
							/>
							<TextField
								margin='dense'
								id='confirmPassword'
								label='Confirm Password'
								type='password'
								error={fields.confirmPassword.error}
								helperText={fields.confirmPassword.helperText}
								fullWidth
								required
							/>
							<Button
								fullWidth
								type='submit'
								color='inherit'
								onClick={this.createAccount}>
								Create Account
							</Button>
						</form>
					</div>
				</Paper>
			</div>
		);
	}

	_validateInputs = (args) => {
		let validationResult = _.merge(
			InputValidation.validateUsernameElement(args.username),
			InputValidation.validateEmailElement(args.email),
			InputValidation.validatePasswordElementsAreEqual(args.password, args.confirmPassword),
			InputValidation.validatePasswordElement(args.password)
		);


		let currentFields = this.state.fields;

		let newFieldsState = _.reduce(currentFields, (acc, fieldValue, fieldKey) => {
				if (validationResult[fieldKey]) {
					acc[fieldKey] = validationResult[fieldKey];
				} else {
					acc[fieldKey] = validField;
				}
				return acc;
			}, {});
		this.setState({ fields: newFieldsState });
		return _.isEmpty(validationResult);
	}
};

export default CreateAccount;