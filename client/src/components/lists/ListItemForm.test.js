// import React from 'react';
// import {render, fireEvent} from '@testing-library/react'

// import ListItemForm from './ListItemForm.jsx';
// import ItemModel from '../../models/ItemModel.js';

// const model = new ItemModel({
// 	addTaxes: false,
// 	increment: 7,
// 	name: 'sample name',
// 	price: 50,
// 	saved: 10,
// 	tax: 30
// });

// describe('ListItemForm', () => {
// 	it('Form appears', () => {
// 		const { getByText } = render(<ListItemForm isNewItem={true} item={model}/>);
// 		expect(getByText('Add New Item')).toBeDefined();
// 		expect(getByText('Name')).toBeDefined();
// 		expect(getByText('Price')).toBeDefined();
// 		expect(getByText('Saved')).toBeDefined();
// 		expect(getByText('Increment')).toBeDefined();
// 		expect(getByText('Add Taxes')).toBeDefined();
// 	});
// });
