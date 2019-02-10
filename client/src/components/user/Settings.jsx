import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import InputValidation from '../../utils/InputValidation.js';
import firebaseUtil from '../../utils/firebaseUtil.js';
import _ from 'lodash';
import FormControlLabel from '@material-ui/core/FormControlLabel';

class Settings extends Component {

	constructor(props) {
		super(props);

		this.state = {
			showProgressBar: true,
			fields: formItemDefaults,
			valueFields: [
				'username',
				'tax',
				'defaultList'
			],
			checkedFields: [
				'addTaxes'
			]
		};
	}

	componentDidMount() {
		this._getUserSettings();
	}

	// Correct class names
	render() {
		let progessBar = ( <LinearProgress/> );
		let { username, tax, defaultList, addTaxes } = this.state.fields;

		return (
			<div className='Settings'>
				<div className='auth-component'>
					<Paper>
						{ this.state.showProgressBar && progessBar }
						<div className='auth-paper'>
							<form>
								<Typography variant='title'>Account Settings</Typography>
								<TextField
									id='settings-form-username'
									label={username.label}
									value={username.value}
									onChange={this.handleChange(username.id)}
									helperText={username.helperText}
									error={username.error}
									margin='dense'
									fullWidth
									required
								/>
								<TextField
									id='settings-form-tax'
									label={tax.label}
									type='number'
									value={tax.value}
									onChange={this.handleChange(tax.id)}
									helperText={tax.helperText}
									error={tax.error}
									margin='dense'
									fullWidth
									required
								/>
								<TextField
									id='settings-form-default-list'
									label={defaultList.label}
									value={defaultList.value}
									onChange={this.handleChange(defaultList.id)}
									helperText={defaultList.helperText}
									error={defaultList.error}
									margin='dense'
									fullWidth
									required
								/>
								<FormControlLabel
									control={
										<Switch
											id='settings-form-add-taxes'
											checked={addTaxes.checked}
											onChange={this.handleChange(addTaxes.id)}
											value='addTaxes'
										/>
									}
									label={addTaxes.label}
								/>
								<Button
									fullWidth
									color='primary'
									variant='contained'
									onClick={this.saveSettings}
									disabled={this.state.showProgressBar}>
									Save Settings
								</Button>
							</form>
						</div>
					</Paper>
				</div>
			</div>
		);
	}

	handleChange = name => event => {
		let { fields, valueFields } = this.state;

		if (_.includes(valueFields, name)) {
			fields[name].value = event.target.value;
		} else {
			fields[name].checked = event.target.checked;
		}

		this.setState({ fields });
	}

	saveSettings = () => {
		this.setState({ showProgressBar: true });

		var uid = firebaseUtil.getLocalUID();
		var path = `users/${uid}`;

		if (!this._validateInput()) return;

		var settings = _.reduce(this.state.fields, (acc, value, key) => {
			if (_.includes(this.state.valueFields, key)) {
				acc[key] = value.value;
			} else {
				acc[key] = value.checked;
			}

			return acc;
		}, {});

		firebaseUtil.db.doc(path).set(settings, { merge: true })
			.then(() => {
				this.setState({ showProgressBar: false });
				console.log("Saved successfully!")
			});
	}

	_validateInput = () => {
		let { username, tax } = this.state.fields;
		let validationResult = _.merge(
			InputValidation.validateString(username.value, username.id, username.label),
			InputValidation.validateTax(tax.value, tax.id, tax.label)
		);

		let newFieldsState = _.reduce(this.state.fields, (acc, value, key) => {
			if (validationResult[key]) {
				_.assign(acc[key], validationResult[key]);
				console.log();
			} else {
				_.assign(acc[key], validField);
			}
			return acc;
		}, this.state.fields);

		this.setState({ field: newFieldsState });
		return _.isEmpty(validationResult);
	}

	_getUserSettings = () => {
		var uid = firebaseUtil.getLocalUID();
		if (!uid) {
			this.props.history.push('/');
			return;
		}

		var path = `users/${uid}`;

		firebaseUtil.db.doc(path).onSnapshot((snapShot) => {
			if (!snapShot.exists) {
				return;
			}

			let { fields, valueFields, checkedFields } = this.state;

			_.forEach(valueFields, (field) => {
				fields[field].value = snapShot.data()[field];
			});

			_.forEach(checkedFields, (field) => {
				fields[field].checked = snapShot.data()[field];
			});

			this.setState({ fields, showProgressBar: false });
		});
	}
}

const validField = { helperText: '', error: false };

const formItemDefaults = {
	username: {
		id: 'username',
		error: false,
		helperText: '',
		label: 'Username',
		value: ''
	},
	tax: {
		id: 'tax',
		error: false,
		helperText: '',
		label: 'Sales Tax',
		value: ''
	},
	defaultList: {
		id: 'defaultList',
		error: false,
		helperText: '',
		label: 'Default List',
		value: ''
	},
	addTaxes: {
		id: 'addTaxes',
		checked: false,
		label: 'Add Taxes',
		value: 'addTaxes'
	}
};

export default Settings;