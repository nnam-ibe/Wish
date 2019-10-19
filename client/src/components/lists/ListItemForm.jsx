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
import _ from 'lodash';

class ListItemForm extends Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		let { name, price, saved, increment, addTaxes } = this.props.item;
		let formTitleText = this.props.isNewItem ? 'Add New Item' : 'Update Item'

		return	(
			<div className='item-form'>
				{this.props.isOpen && (
					<Paper>
						<div className='item-form-paper-title display-flex'>
							<div className='item-form-paper-title-text'>
								<Typography color='inherit'>{formTitleText}</Typography>
							</div>
							<CloseIcon onClick={this.props.closeForm}/>
						</div>
						<Divider />
						<div className='item-form-paper-body'>
							<TextField
								id='item-form-name'
								label='Name'
								value={name.value}
								onChange={this.props.handleChange('name')}
								margin='dense'
								autoFocus={true}
								error={name.error}
								helperText={name.helperText}
								fullWidth
							/>
							<div>
								<TextField
									id='item-form-price'
									label='Price'
									value={price.value}
									onChange={this.props.handleChange('price')}
									margin='dense'
									InputProps={{ inputComponent: CurrencyFormat }}
									className='item-form-price'
									error={price.error}
									helperText={price.helperText}
								/>
								<TextField
									id='item-form-saved'
									label='Saved'
									value={saved.value}
									onChange={this.props.handleChange('saved')}
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
									label='Increment'
									value={increment.value}
									onChange={this.props.handleChange('increment')}
									margin='dense'
									InputProps={{ inputComponent: CurrencyFormat }}
									className='item-form-increment'
									error={increment.error}
									helperText={increment.helperText}
								/>
								<div className='display-inline item-form-add-taxes'>
									<label htmlFor='item-form-add-taxes-switch'>Add Taxes</label>
									<Switch
										id='item-form-add-taxes-switch'
										checked={addTaxes.checked}
										onChange={this.props.handleChange('addTaxes')}
										value={addTaxes.value}
									/>
								</div>
							</div>
							<div className='item-form-fourth-row'>
								{
									this.props.isNewItem ? (
										<Button color='primary' variant='contained' onClick={this.saveItem}>Add Item</Button>
									) : (
										<div>
											<Button color='primary' variant='contained' onClick={this.saveItem} className="mr-10">Save Item</Button>
											<Button color='secondary' variant='contained' onClick={this.deleteItem}>Delete Item</Button>
										</div>
									)
								}
							</div>
						</div>
					</Paper>
				)}
			</div>
		)
	}

	saveItem = () => {
		let valid = this._validateItem(this.props.item);
		if (!valid) return;

		let { name, price, saved, increment, addTaxes } = this.props.item;

		let item = {
			name: name.value,
			price: NumberFormatter.toFixedTwo(price.value),
			saved: NumberFormatter.toFixedTwo(saved.value),
			increment: NumberFormatter.toFixedTwo(increment.value),
			addTaxes: addTaxes.checked
		};

		if (this.props.isNewItem) {
			item.id = FirebaseUtil.generateUUID();
			FirebaseUtil.saveNewItem(this.props.getPagePath(), item);
		} else {
			item.id = this.props.itemId;
			FirebaseUtil.updateItem(this.props.getPagePath(), item);
		}

		this.props.closeForm();
		this.props.resetItem();
	}

	deleteItem = () => {
		FirebaseUtil.deleteItem(this.props.getPagePath(), this.props.itemId);
		this.props.closeForm();
		this.props.resetItem();
	}

	_validateItem = (item) => {
		const { name, price, increment } = this.props.item, errors = {};

		if (_.isEmpty(_.trim(name.value))) {
			errors.name = {
				error: true,
				helperText: 'Name cannot be empty'
			};
		}
		if (_.isEmpty(_.trim(price.value))) {
			errors.price = {
				error: true,
				helperText: 'Price cannot be empty'
			}
		}
		if (_.isEmpty(_.trim(increment.value))) {
			errors.increment = {
				error: true,
				helperText: 'Increment cannot be empty'
			}
		}

		let updatedItem = this.props.item;
		_.forEach(errors, (value, key) => {
			_.assign(updatedItem[key], value);
		});

		_.forEach(updatedItem, (value, key) => {
			if (errors[key]) {
				_.assign(updatedItem[key], errors[key]);
			} else {
				_.assign(updatedItem[key], validField);
			}
		});

		this.setState({ item: updatedItem });
		return _.isEmpty(errors);
	}
}

// TODO: Update to use central valid field
const validField = { helperText: '', error: false };

export default ListItemForm;


function CurrencyFormat (props) {
	const { onChange, inputRef, ...other } = props;

	return (
		<NumberFormat
			{...other}
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