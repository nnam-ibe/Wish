import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import _ from 'lodash';
import FetchUtil from '../../utils/fetchUtil';
import FirebaseUtil from '../../utils/firebaseUtil';
import InputValidation from '../../utils/InputValidation';
import { emailDefault, passwordDefault, usernameDefault } from '../../utils/FormFieldDefaults';

function CreateAccount(props) {
	const [username, setUsername] = useState(usernameDefault);
	const [email, setEmail] = useState(emailDefault);
	const [password, setPassword] = useState(passwordDefault);
	const [confirmPassword, setConfirmPassword] = useState(passwordDefault);
	const [showProgressBar, setShowProgressBar] = useState(false);
	const progessBar = <LinearProgress/>;

	function handleCreateClick(e) {
		e.preventDefault();
		setShowProgressBar(true);

		if (validateInputs()) return setShowProgressBar(false);

		FetchUtil.put(`/api/create/account`, {
			username: _.trim(username.value),
			email: _.trim(email.value),
			password: password.value
		})
		.then(res => {
			setShowProgressBar(false);
			if (res.ok) {
				return props.history.push('/login');
			}
			return res.json();
		})
		.then(err => {
			const message = FirebaseUtil.getErrorMessage(err.code);
			if (_.includes(err.code, 'password')) {
				setPassword({ ...password, error: true, helperText: message });
			} else {
				setEmail({ ...email, error: true, helperText: message })
			}
		})
		.catch(err => {
			setEmail({ ...email, error: true, helperText: err.toString() });
		});
	}

	function validateInputs() {
		let isInvalid = false;
		let err = InputValidation.validateUsername(username.value);
		if (err) {
			isInvalid = true;
			setUsername({
				...username,
				error: true,
				helperText: err.message
			});
		} else if (username.error) {
			setUsername({
				...username,
				error: false,
				helperText: ''
			});
		}

		err = InputValidation.validateEmail(email.value);
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

		err = InputValidation.validatePasswordsAreEqual(password.value, confirmPassword.value);
		if (err) {
			isInvalid = true;
			setPassword({
				...password,
				error: true,
				helperText: err.message
			});
			setConfirmPassword({
				...confirmPassword,
				error: true,
				helperText: err.message
			});
		} else if (confirmPassword.error) {
			setPassword({
				...password,
				error: false,
				helperText: ''
			});
			setConfirmPassword({
				...confirmPassword,
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
				<div className='auth-paper create-account-form'>
					<form>
						<Typography variant='h6'>Create your Account</Typography>
						<TextField
							margin='dense'
							id='username'
							label='Username'
							error={username.error}
							value={username.value}
							helperText={username.helperText}
							onChange={(e) => setUsername({...username, value: e.target.value})}
							fullWidth
							required
						/>
						<TextField
							margin='dense'
							id='email'
							label='Email Address'
							type='email'
							error={email.error}
							value={email.value}
							helperText={email.helperText}
							onChange={(e) => setEmail({...email, value: e.target.value})}
							fullWidth
							required
						/>
						<TextField
							margin='dense'
							id='password'
							label='Password'
							type='password'
							error={password.error}
							value={password.value}
							helperText={password.helperText}
							onChange={(e) => setPassword({...password, value: e.target.value})}
							fullWidth
							required
						/>
						<TextField
							margin='dense'
							id='confirmPassword'
							label='Confirm Password'
							type='password'
							error={confirmPassword.error}
							value={confirmPassword.value}
							helperText={confirmPassword.helperText}
							onChange={(e) => setConfirmPassword({...confirmPassword, value: e.target.value})}
							fullWidth
							required
						/>
						<Button
							fullWidth
							id='create-account-form-button'
							type='submit'
							color='inherit'
							onClick={handleCreateClick}>
							Create Account
						</Button>
					</form>
				</div>
			</Paper>
		</div>
	);
}

export default CreateAccount;