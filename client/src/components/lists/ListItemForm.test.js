import React from 'react';
import {render, fireEvent} from '@testing-library/react'

import FormFieldDefaults from '../../utils/FormFieldDefaults.js';
import ListItemForm from './ListItemForm.jsx';
import ItemModel from '../../models/ItemModel.js';

const model = new ItemModel({
	addTaxes: false,
	increment: 7,
	name: 'sample name',
	price: 50,
	saved: 10,
	tax: 30
});

const formFields = {
	nameField: FormFieldDefaults.nameDefault,
	priceField: FormFieldDefaults.priceDefault,
	savedField: FormFieldDefaults.savedDefault,
	incrementField: FormFieldDefaults.incrementDefault,
	addTaxesField: FormFieldDefaults.addTaxesDefault
};

const props = {
	isNewItem: true,
	item: model,
	fields: formFields,
	isOpen: true
};

describe('ListItemForm', () => {
	it('renders form', () => {
		const { getByText } = render(<ListItemForm {...props}/>);
		expect(getByText('Add New Item')).toBeDefined();
		expect(getByText('Name')).toBeDefined();
		expect(getByText('Price')).toBeDefined();
		expect(getByText('Saved')).toBeDefined();
		expect(getByText('Increment')).toBeDefined();
		expect(getByText('Add Taxes')).toBeDefined();
	});
});