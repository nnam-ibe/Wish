import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import _ from 'lodash';
import LinearProgress from '@material-ui/core/LinearProgress';
import FirebaseWrapper from '../../utils/FirebaseWrapper.js';
import InputValidation from '../../utils/InputValidation';
import { emailDefault, passwordDefault } from '../../utils/FormFieldDefaults';

function Login(props) {
	const [email, setEmail] = useState(emailDefault);
	const [password, setPassword] = useState(passwordDefault);
	const [showProgressBar, setShowProgressBar] = useState(false);
	const progessBar = <LinearProgress/>;

	function handleLoginClick(e) {
		e.preventDefault();
		setShowProgressBar(true);
		if (validateInputs()) return setShowProgressBar(false);

		FirebaseWrapper.login({
			email: _.trim(email.value),
			password: password.value
		})
		.then(() => {
			setShowProgressBar(false);
			props.history.push('/');
		})
		.catch((err) => {
			setShowProgressBar(false);
			if (!err.code) return;

			const message = FirebaseWrapper.getErrorMessage(err.code);
			if (_.includes(err.code, 'password')) {
				setPassword({ ...password, error: true, helperText: message });
			} else {
				setEmail({ ...email, error: true, helperText: message })
			}
		});
	}

	function validateInputs() {
		let isInvalid = false;
		let err = InputValidation.validateEmail(email.value);
		if (err) {
			isInvalid = true;
			setEmail({
				...email,
				error: true,
				helperText: err.message
			});
		} else if (email.error) {
			setEmail({
				...email,
				error: false,
				helperText: ''
			});
		}

		err = InputValidation.validatePassword(password.value);
		if (err) {
			isInvalid = true;
			setPassword({
				...password,
				error: true,
				helperText: err.message
			});
		} else if (password.error) {
			setPassword({
				...password,
				error: false,
				helperText: ''
			});
		}

		return isInvalid;
	}

	return (
		<div className='auth-component'>
			<Paper>
				{ showProgressBar && progessBar }
				<div className='auth-paper login-form'>
					<form>
						<TextField
							margin='dense'
							id='email'
							label='Email Address'
							type='email'
							error={email.error}
							helperText={email.helperText}
							value={email.value}
							onChange={(e) => setEmail({...email, value: e.target.value})}
							fullWidth
						/>
						<TextField
							margin='dense'
							id='password'
							label='Password'
							type='password'
							error={password.error}
							helperText={password.helperText}
							value={password.value}
							onChange={(e) => setPassword({...password, value: e.target.value})}
							fullWidth
						/>
						<Button
							id='login-form-button'
							fullWidth
							type='submit'
							color='inherit'
							onClick={handleLoginClick}>
							Login
						</Button>
					</form>
					<Typography>
						Not registered?
						<a href='/create_account'> Create an account</a>
					</Typography>
				</div>
			</Paper>
		</div>
	);
};

export default Login;