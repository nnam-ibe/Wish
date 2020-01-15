import React from 'react';
import {render, fireEvent} from '@testing-library/react'

import ListItemForm from './ListItemForm.jsx';
const FirebaseWrapper = require('../../utils/FirebaseWrapper.js');
const FormFieldDefaults = require('../../utils/FormFieldDefaults.js');
const ItemModel = require('../../models/ItemModel.js');

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
	it('renders new form', () => {
		const { getByText } = render(<ListItemForm {...props}/>);
		expect(getByText('Add New Item')).toBeDefined();
		expect(getByText('Name')).toBeDefined();
		expect(getByText('Price')).toBeDefined();
		expect(getByText('Saved')).toBeDefined();
		expect(getByText('Increment')).toBeDefined();
		expect(getByText('Add Taxes')).toBeDefined();
	});

	it('renders existing form', () => {
		const updateItemProps = {...props, isNewItem: false};
		const { getByText } = render(<ListItemForm {...updateItemProps}/>);
		expect(getByText('Update Item')).toBeDefined();
		expect(getByText('Name')).toBeDefined();
		expect(getByText('Price')).toBeDefined();
		expect(getByText('Saved')).toBeDefined();
		expect(getByText('Increment')).toBeDefined();
		expect(getByText('Add Taxes')).toBeDefined();
		expect(getByText('Save Item')).toBeDefined();
		expect(getByText('Delete Item')).toBeDefined();
	});

	it('submits new item', () => {
		const formProps = {
			...props,
			getPagePath: jest.fn(),
			closeForm: jest.fn(),
			resetItemModel: jest.fn()
		};
		FirebaseWrapper.saveNewItem = jest.fn();
		const { getByText } = render(<ListItemForm {...formProps}/>);
		fireEvent.click(getByText('Add Item'));
		expect(FirebaseWrapper.saveNewItem.mock.calls.length).toBe(1);
		expect(FirebaseWrapper.saveNewItem.mock.calls[0][1].addTaxes).toBe(false);
		expect(FirebaseWrapper.saveNewItem.mock.calls[0][1].increment).toBe(7);
		expect(FirebaseWrapper.saveNewItem.mock.calls[0][1].name).toBe('sample name');
		expect(FirebaseWrapper.saveNewItem.mock.calls[0][1].price).toBe(50);
		expect(FirebaseWrapper.saveNewItem.mock.calls[0][1].saved).toBe(10);
		expect(FirebaseWrapper.saveNewItem.mock.calls[0][1].tax).toBe(30);
	});

	it('updates existing item', () => {
		const formProps = {
			...props,
			isNewItem: false,
			getPagePath: jest.fn(),
			closeForm: jest.fn(),
			resetItemModel: jest.fn()
		};
		FirebaseWrapper.updateItem = jest.fn();
		const { getByText, container } = render(<ListItemForm {...formProps}/>);
		fireEvent.change(container.querySelector('#item-form-name'), { target: { value: 'Updated Name' } });
		fireEvent.change(container.querySelector('#item-form-price'), { target: { value: '$100' } });
		fireEvent.change(container.querySelector('#item-form-saved'), { target: { value: '$15' } });
		fireEvent.click(getByText('Save Item'));

		expect(FirebaseWrapper.updateItem.mock.calls.length).toBe(1);
		expect(FirebaseWrapper.updateItem.mock.calls[0][1].addTaxes).toBe(false);
		expect(FirebaseWrapper.updateItem.mock.calls[0][1].increment).toBe(7);
		expect(FirebaseWrapper.updateItem.mock.calls[0][1].name).toBe('Updated Name');
		expect(FirebaseWrapper.updateItem.mock.calls[0][1].price).toBe(100);
		expect(FirebaseWrapper.updateItem.mock.calls[0][1].saved).toBe(15);
		expect(FirebaseWrapper.updateItem.mock.calls[0][1].tax).toBe(30);
	});
});