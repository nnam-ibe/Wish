import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import NumberFormat from 'react-number-format';
import _ from 'lodash';

import FirebaseWrapper from '../../utils/FirebaseWrapper.js';

class ListItemForm extends Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const item = this.props.item;
		const { nameField, priceField, savedField, incrementField, addTaxesField } = this.props.fields;
		const formTitle = this.props.isNewItem ? 'Add New Item' : 'Update Item'

		return	(
			<div className='item-form'>
				{this.props.isOpen && (
					<Paper>
						<div className='item-form-paper-title display-flex'>
							<div className='item-form-paper-title-text'>
								<Typography color='inherit'>{formTitle}</Typography>
							</div>
							<CloseIcon onClick={this.props.closeForm}/>
						</div>
						<Divider />
						<div className='item-form-paper-body'>
							<TextField
								id='item-form-name'
								label='Name'
								value={item.getName()}
								onChange={(event) => item.setName(event.target.value)}
								margin='dense'
								autoFocus={true}
								error={nameField.error}
								helperText={nameField.helperText}
								fullWidth
							/>
							<div>
								<TextField
									id='item-form-price'
									label='Price'
									value={item.getPrice()}
									onChange={(event) => item.setPrice(event.target.value)}
									margin='dense'
									InputProps={{ inputComponent: CurrencyFormat }}
									className='item-form-price'
									error={priceField.error}
									helperText={priceField.helperText}
								/>
								<TextField
									id='item-form-saved'
									label='Saved'
									value={item.getSaved()}
									onChange={(event) => item.setSaved(event.target.value)}
									margin='dense'
									InputProps={{ inputComponent: CurrencyFormat }}
									className='item-form-saved'
									error={savedField.error}
									helperText={savedField.helperText}
								/>
							</div>
							<div className='item-form-third-row'>
								<TextField
									id='item-form-increment'
									label='Increment'
									value={item.getIncrement()}
									onChange={(event) => item.setIncrement(event.target.value)}
									margin='dense'
									InputProps={{ inputComponent: CurrencyFormat }}
									className='item-form-increment'
									error={incrementField.error}
									helperText={incrementField.helperText}
								/>
								<div className='display-inline item-form-add-taxes'>
									<label htmlFor='item-form-add-taxes-switch'>Add Taxes</label>
									<Switch
										id='item-form-add-taxes-switch'
										checked={item.getAddTaxes()}
										onChange={(event) => item.setAddTaxes(event.target.checked)}
										value={addTaxesField.value}
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
		const item = this.props.item;
		const valid = this._validateItem(item);
		if (!valid) return;

		if (this.props.isNewItem) {
			item.setId(FirebaseWrapper.generateUUID());
			FirebaseWrapper.saveNewItem(this.props.getPagePath(), item.valueOf());
		} else {
			FirebaseWrapper.updateItem(this.props.getPagePath(), item.valueOf());
		}

		this.props.closeForm();
		this.props.resetItem();
	}

	deleteItem = () => {
		FirebaseWrapper.deleteItem(this.props.getPagePath(), this.props.item.getId());
		this.props.closeForm();
		this.props.resetItem();
	}

	_validateItem = (item) => {
		const errors = {};

		if (_.isEmpty(_.trim(item.getName()))) {
			errors.nameField = {
				error: true,
				helperText: 'Name cannot be empty'
			};
		}
		if (_.isEmpty(_.trim(item.getPrice()))) {
			errors.priceField = {
				error: true,
				helperText: 'Price cannot be empty'
			}
		}
		if (_.isEmpty(_.trim(item.getIncrement()))) {
			errors.incrementField = {
				error: true,
				helperText: 'Increment cannot be empty'
			}
		}

		const updatedItem = this.props.item;
		_.forEach(updatedItem, (value, key) => {
			if (errors[key]) {
				_.assign(updatedItem[key], errors[key]);
			} else {
				_.assign(updatedItem[key], { helperText: '', error: false });
			}
		});

		return _.isEmpty(errors);
	}
}

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