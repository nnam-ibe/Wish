import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import FirebaseUtil from '../../utils/firebaseUtil.js';
import NumberFormat from 'react-number-format';
import NumberFormatter from '../../utils/NumberFormatter.js';
import InputValidation from '../../utils/InputValidation.js';
import _ from 'lodash';

class ListItemForm extends Component {

	constructor(props) {
		super(props);
		this.state = {
			item: _.cloneDeep(itemDefaults)
		};
	}

	render() {
		let { name, price, saved, increment, addTaxes } = this.state.item;

		return	(
			<div className='item-form'>
				{this.props.isOpen && (
					<Paper>
						<div className='item-form-paper-title display-flex'>
							<div className='item-form-paper-title-text'>
								<Typography color='inherit'>Add New Item</Typography>
							</div>
							<CloseIcon onClick={this.props.closeForm}/>
						</div>
						<Divider />
						<div className='item-form-paper-body'>
							<TextField
								id='item-form-name'
								label={name.label}
								value={name.value}
								onChange={this.handleChange('name')}
								margin='dense'
								autoFocus={true}
								error={name.error}
								helperText={name.helperText}
								fullWidth
							/>
							<div>
								<TextField
									id='item-form-price'
									label={price.label}
									value={price.value}
									onChange={this.handleChange('price')}
									margin='dense'
									InputProps={{ inputComponent: CurrencyFormat }}
									className='item-form-price'
									error={price.error}
									helperText={price.helperText}
								/>
								<TextField
									id='item-form-saved'
									label={saved.label}
									value={saved.value}
									onChange={this.handleChange('saved')}
									margin='dense'
									InputProps={{ inputComponent: CurrencyFormat }}
									className='item-form-saved'
									error={saved.error}
									helperText={saved.helperText}
								/>
							</div>
							<div className='item-form-third-row'>
								<TextField
									id='item-form-increment'
									label={increment.label}
									value={increment.value}
									onChange={this.handleChange('increment')}
									margin='dense'
									InputProps={{ inputComponent: CurrencyFormat }}
									className='item-form-increment'
									error={increment.error}
									helperText={increment.helperText}
								/>
								<div className='display-inline item-form-add-taxes'>
									<label htmlFor='item-form-add-taxes-switch'>{addTaxes.label}</label>
									<Switch
										id='item-form-add-taxes-switch'
										checked={addTaxes.checked}
										onChange={this.handleChange('addTaxes')}
										value={addTaxes.value}
									/>
								</div>
							</div>
							<div className='item-form-fourth-row'>
								<Button color='primary' variant='raised' onClick={this.addNewItem}>Add Item</Button>
							</div>
						</div>
					</Paper>
				)}
			</div>
		)
	}


	handleChange = name => event => {
		let item = this.state.item;

		if (name === 'addTaxes') {
			item[name].checked = event.target.checked;
		} else {
			item[name].value = event.target.value;
		}

		this.setState({
			item: item
		})
	}

	addNewItem = () => {
		var valid = this._validateItem(this.state.item);
		if (!valid) return;

		let { name, price, saved, increment, addTaxes } = this.state.item;


		let item = {
			id: FirebaseUtil.generateUUID(),
			name: name.value,
			price: NumberFormatter.formatMoney(price.value),
			saved: NumberFormatter.formatMoney(saved.value),
			increment: NumberFormatter.formatMoney(increment.value),
			addTaxes: addTaxes.checked
		};

		FirebaseUtil.saveNewItem(this.props.getPagePath(), item);
		this.props.closeForm();
		this.setState({ item: _.cloneDeep(itemDefaults) });
	}

	_validateItem(item) {
		let { name, price, increment } = this.state.item;

		let validationResult = _.merge(
			InputValidation.validateString(name.value, 'name', name.label ),
			InputValidation.validateAmount(price.value, 'price', price.label),
			InputValidation.validateAmount(increment.value, 'increment', increment.label)
		);

		let updatedItem = this.state.item;
		_.forEach(validationResult, (value, key) => {
			_.assign(updatedItem[key], value);
		});

		_.forEach(updatedItem, (value, key) => {
			if (validationResult[key]) {
				_.assign(updatedItem[key], validationResult[key]);
			} else {
				_.assign(updatedItem[key], validField);
			}
		});

		this.setState({ item: updatedItem });
		return _.isEmpty(validationResult);
	}
}

const validField = { helperText: '', error: false };

const itemDefaults = {
	name: {
		error: false,
		helperText: '',
		label: 'Name',
		value: ''
	},
	price: {
		error: false,
		helperText: '',
		label: 'Price',
		value: ''
	},
	saved: {
		error: false,
		helperText: '',
		label: 'Saved',
		value: ''
	},
	increment: {
		error: false,
		helperText: '',
		label: 'Increment',
		value: '200'
	},
	addTaxes: {
		checked: false,
		label: 'Add Taxes',
		value: 'addTaxes'
	}
};

export default ListItemForm;


function CurrencyFormat (props) {
	const { inputRef, onChange, ...other } = props;

	return (
		<NumberFormat
			{...other}
			ref={inputRef}
			onValueChange={values => {
				onChange({
					target: { value: values.value }
				})
			}}
			thousandSeparator
			decimalScale={2}
			allowNegative={false}
			prefix='$'
		/>
	);
}