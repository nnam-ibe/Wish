import React, { useState, useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { map } from 'lodash';
import UserContext from '../app/UserContext';

import InputValidation from '../../../../lib/utils/InputValidation';
import {
	stringDefault,
	addTaxesDefault,
	salesTaxDefault,
	incrementDefault
} from '../../utils/FormFieldDefaults';
import FetchWrapper from '../../utils/FetchWrapper';

/**
Props
	location: location object from Route
*/
function Settings(props) {
	const userContext = useContext(UserContext);
	const [showProgressBar, setShowProgressBar] = useState(false);
	const [usernameField, setUsernameField] = useState({
		...stringDefault,
		value: userContext.username
	});
	const [salesTaxField, setSalesTaxField] = useState({
		...salesTaxDefault,
		value: userContext.tax
	});
	const [defaultListField, setDefaultListField] = useState({
		...stringDefault,
		value: userContext.defaultList
	});
	const [defaultIncrementField, setDefaultIncrementField] = useState({
		...incrementDefault,
		value: userContext.defaultIncrement
	});
	const [addTaxesField, setAddTaxesField] = useState({
		...addTaxesDefault,
		checked: userContext.addTaxes
	});
	const activeLists = map(userContext.activeLists, list => <MenuItem value={list} key={list}>{list}</MenuItem>);
	const progessBar = <LinearProgress/>;

	const validateInput = () => {
		let isValid = true;
		let err = InputValidation.validateUsername(usernameField.value);
		if (err) {
			isValid = false;
			setUsernameField({
				...usernameField,
				error: true,
				helperText: err.message
			});
		}

		err = InputValidation.validateTax(salesTaxField.value);
		if (err) {
			isValid = false;
			setSalesTaxField({
				...salesTaxField,
				error: true,
				helperText: err.message
			});
		}

		return isValid;
	};

	const saveSettings = async () => {
		setShowProgressBar(true);
		const path = `/api/update/settings/${userContext.uid}`;

		if (!validateInput()) {
			setShowProgressBar(false);
			return;
		}

		const settings = {
			addTaxes: addTaxesField.checked,
			defaultIncrement: defaultIncrementField.value,
			defaultList: defaultListField.value,
			tax: salesTaxField.value,
			username: usernameField.value
		};

		const res = await FetchWrapper.post(path, settings);
		setShowProgressBar(false);
		if (res.ok) return;
		// TODO: Give feedback on form
	};


	return (
		<div className='Settings'>
			<div className='auth-component'>
				<Paper>
					{ showProgressBar && progessBar }
					<div className='auth-paper user-settings-form'>
						<form>
							<Typography variant='h6'>Account Settings</Typography>
							<TextField
								id='settings-form-username'
								label='Username'
								value={usernameField.value}
								onChange={e => setUsernameField({
									...usernameField,
									value: e.target.value
								})}
								helperText={usernameField.helperText}
								error={usernameField.error}
								margin='dense'
								fullWidth
								required
							/>
							<TextField
								id='settings-form-tax'
								label='Sales Tax'
								type='number'
								value={salesTaxField.value}
								onChange={e => setSalesTaxField({
									...salesTaxField,
									value: e.target.value
								})}
								helperText={salesTaxField.helperText}
								error={salesTaxField.error}
								margin='dense'
								fullWidth
								required
							/>
							<TextField
								id='settings-form-default-increment'
								label='Default Increment'
								type='number'
								value={defaultIncrementField.value}
								onChange={e => setDefaultIncrementField({
									...defaultIncrementField,
									value: e.target.value
								})}
								helperText={defaultIncrementField.helperText}
								error={defaultIncrementField.error}
								margin='dense'
								fullWidth
								required
							/>
							<FormControl required fullWidth>
								<InputLabel id='settings-form-default-list-input-label'>
									Default List
								</InputLabel>
								<Select
									labelid='settings-form-default-list-input-label'
									value={defaultListField.value}
									onChange={e => setDefaultListField({
										...defaultListField,
										value: e.target.value
									})}
									>
										{activeLists}
								</Select>
							</FormControl>
							<FormControlLabel
								id='settings-form-taxes-form-control'
								control={
									<Switch
										id='settings-form-add-taxes'
										checked={addTaxesField.checked}
										onChange={e => setAddTaxesField({
											...addTaxesField,
											checked: e.target.checked
										})}
										value='addTaxes'
									/>
								}
								label='Add Taxes'
							/>
							<Button
								fullWidth
								color='primary'
								variant='contained'
								onClick={saveSettings}
								disabled={showProgressBar}>
								Save Settings
							</Button>
						</form>
					</div>
				</Paper>
			</div>
		</div>
	);
}

export default Settings;