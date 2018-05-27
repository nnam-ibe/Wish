import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import firebaseUtil from '../../utils/firebaseUtil.js';
import _ from 'lodash';
import LinearProgress from '@material-ui/core/LinearProgress';
import inputValidation from '../../utils/inputValidation.js';

const validField = { error: false, helperText: '' };

class Login extends Component {

	constructor(props) {
		super(props);
		this.state = {
			fields: {
				email: validField,
				password: validField
			},
			showProgressBar: false
		};
	};

	login = () => {
		this.setState({ showProgressBar: true });

		let args = {
			email: document.getElementById('email'),
			password: document.getElementById('password')
		};

		if ( !this._validateInputs(args) ) {
			this.setState({ showProgressBar: false });
			return;
		}

		let email = _.trim(args.email.value);
		let password = args.password.value;

		firebaseUtil.login({ email, password})
			.then(() => {
				this.setState({ showProgressBar: false });
				this.props.history.push('/');
			})
			.catch((err) => {
				this.setState({ showProgressBar: false });
				if (!_.has(err, 'code')) {
					console.error(err);
					return;
				}

				if (_.includes(err.code, 'email') || _.includes(err.code, 'user')) {
					let fields = this.state.fields;
					_.set(fields, 'email', { error: true, helperText: err.message });
					this.setState({ fields });
				} else if (_.includes(err.code, 'password')) {
					let fields = this.state.fields;
					_.set(fields, 'password', { error: true, helperText: err.message });
					_.set(fields, 'confirmPassword', { error: true, helperText: err.message });
					this.setState({ fields });
				}
			});
	}

	render() {
		let fields = this.state.fields;
		let progessBar = ( <LinearProgress/> );

		return (
			<div className='auth-component'>
				<Paper>
					{ this.state.showProgressBar && progessBar }
					<div className='auth-paper'>
						<TextField
							margin='dense'
							id='email'
							label='Email Address'
							type='email'
							error={fields.email.error}
							helperText={fields.email.helperText}
							fullWidth
						/>
						<TextField
							margin='dense'
							id='password'
							label='Password'
							type='password'
							error={fields.password.error}
							helperText={fields.password.helperText}
							fullWidth
						/>
						<Button fullWidth color='inherit' onClick={this.login}>Login</Button>
						<Typography>Not registered? <a href='/create_account'>Create an account</a></Typography>
					</div>
				</Paper>
			</div>
		);
	}

	_validateInputs = (args) => {
		let validationResult = _.merge(
			inputValidation.validateEmail(args.email),
			inputValidation.validatePassword(args.password)
		);

		let currentFields = this.state.fields;

		let newFieldsState = _.reduce(currentFields, function(acc, fieldValue, fieldKey) {
				if (validationResult[fieldKey]) {
					acc[fieldKey] = validationResult[fieldKey];
				} else {
					acc[fieldKey] = validField;
				}
				return acc;
			}, {});
		this.setState({ fields: newFieldsState });
		return _.size(validationResult) === 0;
	}

	_validateInputs = (args) => {
		let fields = {};

		if (!args.email.checkValidity()) {
			fields.email = {
				error: true,
				helperText: 'Enter a valid email'
			}
		}

		if(!args.password.checkValidity()) {
			const passState = {
				error:  true,
				helperText: args.password.validationMessage
			};
			_.set(fields, 'password', passState);
		}

		let currentFields = this.state.fields;

		let newFieldsState = _.reduce(currentFields, function(acc, fieldValue, fieldKey) {
				if (fields[fieldKey]) {
					acc[fieldKey] = fields[fieldKey];
				} else {
					acc[fieldKey] = validField;
				}
				return acc;
			}, {});
		this.setState({ fields: newFieldsState });
		return _.size(fields) === 0;
	}
};

export default Login;