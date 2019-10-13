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
				'defaultList',
				'defaultIncrement'
			],
			checkedFields: [
				'addTaxes'
			]
		};
	}

	componentDidMount() {
		this._getUserSettings();
	}

	componentWillUnmount() {
		this.onSnapshotUnsubscribe && this.onSnapshotUnsubscribe();
	}

	// Correct class names
	render() {
		let progessBar = ( <LinearProgress/> );
		let { username, tax, defaultList, defaultIncrement, addTaxes } = this.state.fields;

		return (
			<div className='Settings'>
				<div className='auth-component'>
					<Paper>
						{ this.state.showProgressBar && progessBar }
						<div className='auth-paper'>
							<form>
								<Typography variant='h6'>Account Settings</Typography>
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
									id='settings-form-default-increment'
									label={defaultIncrement.label}
									type='number'
									value={defaultIncrement.value}
									onChange={this.handleChange(defaultIncrement.id)}
									helperText={defaultIncrement.helperText}
									error={defaultIncrement.error}
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

	// TODO: Move to server, add server side validation
	saveSettings = () => {
		this.setState({ showProgressBar: true });

		const uid = firebaseUtil.getLocalUID();
		const path = `users/${uid}`;

		if (!this._validateInput()) return;

		const settings = _.reduce(this.state.fields, (acc, value, key) => {
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
			});
	}

	_validateInput = () => {
		const { username, tax } = this.state.fields, errors = {};
		if (_.isEmpty(_.trim(username.value))) {
			errors.username = {
				error: true,
				helperText: `Username cannot be empty`
			}
		}

		let err = InputValidation.validateTax(tax.value);
		if (err) {
			errors.tax = {
				error: true,
				helperText: err.message
			}
		}

		const newFieldsState = _.reduce(this.state.fields, (acc, value, key) => {
			if (errors[key]) {
				_.assign(acc[key], errors[key]);
			} else {
				_.assign(acc[key], validField);
			}
			return acc;
		}, this.state.fields);

		this.setState({ field: newFieldsState });
		return _.isEmpty(errors);
	}

	_getUserSettings = () => {
		const uid = firebaseUtil.getLocalUID();
		if (!uid) {
			this.props.history.push('/');
			return;
		}

		const path = `users/${uid}`;
		this.onSnapshotUnsubscribe = firebaseUtil.db.doc(path).onSnapshot((snapShot) => {
			if (!snapShot.exists) return;

			const { fields, valueFields, checkedFields } = this.state;
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
	defaultIncrement: {
		id: 'defaultIncrement',
		error: false,
		helperText: '',
		label: 'Default Increment',
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