import React, { useState, useEffect } from 'react';
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

function ListItemForm(props) {
	const [item, setItem] = useState(props.item);
	const [isOpen, setIsOpen] = useState(props.isOpen);
	const [fields, setFields] = useState(props.fields);
	const formTitle = props.isNewItem ? 'Add New Item' : 'Update Item';

	useEffect(() => {
		setItem(props.item);
	}, [props.item]);

	useEffect(() => {
		setIsOpen(props.isOpen);
	}, [props.isOpen]);

	useEffect(() => {
		setFields(props.fields);
	}, [props.fields]);

	async function saveItem() {
		const isValid = validateItem();
		if (!isValid) return;

		if (props.isNewItem) {
			await FirebaseWrapper.saveNewItem(props.getPagePath(), item.valueOf());
		} else {
			await FirebaseWrapper.updateItem(props.getPagePath(), item.valueOf());
		}

		props.closeForm();
		props.resetItemModel();
	}

	async function deleteItem() {
		await FirebaseWrapper.deleteItem(props.getPagePath(), item.getId());
		props.closeForm();
		props.resetItemModel();
	}

	function validateItem() {
		const newFieldsState = { ...fields };
		let err, isValid = true;

		if (_.isEmpty(_.trim(item.getName()))) {
			isValid = false;
			err = {
				error: true,
				helperText: 'Name cannot be empty'
			};
		}
		newFieldsState.nameField = nextState(fields.nameField, err);

		setFields(newFieldsState);
		return isValid;
	}

	return	(
		<div className='item-form'>
			{isOpen && (
				<Paper>
					<div className='item-form-paper-title display-flex'>
						<div className='item-form-paper-title-text'>
							<Typography color='inherit'>{formTitle}</Typography>
						</div>
						<CloseIcon onClick={props.closeForm}/>
					</div>
					<Divider />
					<div className='item-form-paper-body'>
						<TextField
							id='item-form-name'
							label='Name'
							value={item.getName()}
							onChange={(event) => setItem(item.setName(event.target.value).newRef())}
							margin='dense'
							autoFocus={true}
							error={fields.nameField.error}
							helperText={fields.nameField.helperText}
							fullWidth
							required
						/>
						<div>
							<TextField
								id='item-form-price'
								label='Price'
								value={item.getPricePreTax()}
								onChange={(event) => setItem(item.setPrice(event.target.value).newRef())}
								margin='dense'
								InputProps={{ inputComponent: CurrencyFormat }}
								className='item-form-price'
								error={fields.priceField.error}
								helperText={fields.priceField.helperText}
								required
							/>
							<TextField
								id='item-form-saved'
								label='Saved'
								value={item.getSaved()}
								onChange={(event) => setItem(item.setSaved(event.target.value).newRef())}
								margin='dense'
								InputProps={{ inputComponent: CurrencyFormat }}
								className='item-form-saved'
								error={fields.savedField.error}
								helperText={fields.savedField.helperText}
								required
							/>
						</div>
						<div className='item-form-third-row'>
							<TextField
								id='item-form-increment'
								label='Increment'
								value={item.getIncrement()}
								onChange={(event) => setItem(item.setIncrement(event.target.value).newRef())}
								margin='dense'
								InputProps={{ inputComponent: CurrencyFormat }}
								className='item-form-increment'
								error={fields.incrementField.error}
								helperText={fields.incrementField.helperText}
								required
							/>
							<div className='display-inline item-form-add-taxes'>
								<label htmlFor='item-form-add-taxes-switch'>Add Taxes</label>
								<Switch
									id='item-form-add-taxes-switch'
									checked={item.getAddTaxes()}
									onChange={(event) => setItem(item.setAddTaxes(event.target.checked).newRef())}
									value={fields.addTaxesField.value}
								/>
							</div>
						</div>
						<div className='item-form-fourth-row'>
							{
								props.isNewItem ? (
									<Button color='primary' variant='contained' onClick={saveItem}>Add Item</Button>
								) : (
									<div>
										<Button color='primary' variant='contained' onClick={saveItem} className="mr-10">Save Item</Button>
										<Button color='secondary' variant='contained' onClick={deleteItem}>Delete Item</Button>
									</div>
								)
							}
						</div>
					</div>
				</Paper>
			)}
		</div>
	);
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

function nextState(prevState, err) {
	if (err) {
		prevState = {
			...prevState,
			error: true,
			helperText: err.helperText
		};
	} else if (prevState.error) {
		prevState = {
			...prevState,
			error: false,
			helperText: ''
		};
	}
	return prevState;
}