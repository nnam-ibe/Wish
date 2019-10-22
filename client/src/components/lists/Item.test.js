import React from 'react';
import {render, fireEvent} from '@testing-library/react'

import Item from './Item.jsx';
import ItemModel from '../../models/ItemModel.js';


const model = new ItemModel({
	addTaxes: false,
	increment: 7,
	name: 'sample name',
	price: 50,
	saved: 10,
	tax: 30
});

describe('Item', () => {
	it('item appears', () => {
		const { getByText } = render(<Item itemModel={model}/>);
		expect(getByText('sample name')).toBeDefined();
	});

	it('values display correctly - no tax', () => {
		const { getByText } = render(<Item itemModel={model}/>);

		expect(getByText('sample name')).toBeDefined();
		expect(getByText('$10')).toBeDefined();
		expect(getByText('$50')).toBeDefined();
		expect(getByText('$40')).toBeDefined();
	});

	it('values display correctly - with tax', () => {
		const taxedModel = new ItemModel({...model.valueOf(), addTaxes: true});
		const { getByText } = render(<Item itemModel={taxedModel}/>);

		expect(getByText('sample name')).toBeDefined();
		expect(getByText('$10')).toBeDefined();
		expect(getByText('$65')).toBeDefined();
		expect(getByText('$55')).toBeDefined();
	});

	it('values display correctly - when props change', () => {
		const { getByText, rerender } = render(<Item itemModel={model}/>);

		expect(getByText('sample name')).toBeDefined();
		expect(getByText('$10')).toBeDefined();
		expect(getByText('$50')).toBeDefined();
		expect(getByText('$40')).toBeDefined();

		const itemModel = new ItemModel({
			addTaxes: true,
			increment: 7,
			name: 'TESTNAME',
			price: 70,
			saved: 10,
			tax: 30
		});

		rerender(<Item itemModel={itemModel}/>);
		expect(getByText('TESTNAME')).toBeDefined();
		expect(getByText('$10')).toBeDefined();
		expect(getByText('$91')).toBeDefined();
		expect(getByText('$81')).toBeDefined();
	});

	it('can decrement saved amount', async () => {
		const {getAllByText, getByTestId, getByText} = render(<Item itemModel={model} updateItem={jest.fn()}/>);
		expect(getByText('sample name')).toBeDefined();
		expect(getByText('$10')).toBeDefined();
		expect(getByText('$50')).toBeDefined();
		expect(getByText('$40')).toBeDefined();

		fireEvent.click(getByTestId('item-decrement-button'));
		expect(getByText('$3')).toBeDefined();
		expect(getByText('$50')).toBeDefined();
		expect(getByText('$47')).toBeDefined();

		fireEvent.click(getByTestId('item-decrement-button'));
		expect(getByText('$0')).toBeDefined();
		expect(getAllByText('$50')).toHaveLength(2);
		expect(getAllByText('$50')).toHaveLength(2);
	});

	it('can increment saved amount', async () => {
		const incrementModel = new ItemModel({
			addTaxes: true,
			increment: 85,
			name: 'sample name',
			price: 70,
			saved: 10,
			tax: 30
		});
		const {getByTestId, getByText} = render(<Item itemModel={incrementModel} updateItem={jest.fn()}/>);
		fireEvent.click(getByTestId('item-increment-button'));

		expect(getByText('sample name')).toBeDefined();
		expect(getByText('$95')).toBeDefined();
		expect(getByText('$91')).toBeDefined();
		expect(getByText('$0')).toBeDefined();
	});
});
