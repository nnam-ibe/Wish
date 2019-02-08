import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import _ from 'lodash';
import firebaseUtil from '../../utils/firebaseUtil.js';
import fetchUtil from '../../utils/fetchUtil.js';
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

		firebaseUtil.createAccount({
			username: _.trim(args.username.value),
			email: args.email.value,
			password: args.password.value,
			confirmPassword: args.confirmPassword.value
		})
		.catch((err) => {
			this.setState({ showProgressBar: false });

			if (_.includes(err.code, 'email')) {
				let fields = this.state.fields;
				_.set(fields, 'email', { error: true, helperText: err.message });
				this.setState({ fields });
			} else if (_.includes(err.code, 'password')) {
				let fields = this.state.fields;
				_.set(fields, 'password', { error: true, helperText: err.message });
				_.set(fields, 'confirmPassword', { error: true, helperText: err.message });
				this.setState({ fields });
			}
			return Promise.reject(err);
		})
		.then((uid) => {
			return Promise.resolve(
				fetchUtil.put('/api/create_account', { uid: uid, username: args.username.value })
			);
		})
		.then((response) => {
			this.setState({ showProgressBar: false });

			if (response.status === 200 && firebaseUtil.getCurrentUser()) {
				this.props.history.push('/');
			}
		})
		.catch((err) => {
			this.setState({ showProgressBar: false });

			console.error(err);
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
							<Typography variant='title'>Create your Account</Typography>
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