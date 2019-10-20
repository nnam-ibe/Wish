import { act } from 'react-dom/test-utils';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { mount, render, shallow } from 'enzyme';

import Item from './Item.jsx';
import ItemModel from '../../models/ItemModel.js';

Enzyme.configure({ adapter: new Adapter() });

const model = new ItemModel({
	addTaxes: false,
	increment:7,
	name: 'sample name',
	price: 50,
	saved: 10,
	tax: 30
});

const updateItem = jest.fn();

describe('Item', () => {
	it('item appears', () => {
		const component = shallow(<Item itemModel={model}/>);
		expect(component.find('.item-div')).toHaveLength(1);
		expect(component.find('.item-progress-bar')).toHaveLength(1);
	});

	it('values display correctly - no tax', () => {
		const component = shallow(<Item itemModel={model}/>);
		expect(component.find('.item-name').hostNodes().text()).toBe(model.name);
		expect(component.find('.item-saved-value').text()).toBe(`$${model.saved}`);
		expect(component.find('.item-price-value').text()).toBe(`$${model.price}`);
		expect(component.find('.item-difference-value').text()).toBe(`$${40}`);
	});

	it('values display correctly - with tax', () => {
		const taxedModel = new ItemModel({...model.valueOf(), addTaxes: true});
		const component = shallow(<Item itemModel={taxedModel}/>);
		expect(component.find('.item-name').hostNodes().text()).toBe(model.name);
		expect(component.find('.item-saved-value').text()).toBe(`$${model.saved}`);
		expect(component.find('.item-price-value').text()).toBe(`$${65}`);
		expect(component.find('.item-difference-value').text()).toBe(`$${40}`);
	});

	it('values display correctly - when props change', () => {
		const component = mount(<Item itemModel={model}/>);
		expect(component.find('.item-name').hostNodes().text()).toBe(model.name);
		expect(component.find('.item-saved-value').hostNodes().text()).toBe(`$${model.saved}`);
		expect(component.find('.item-price-value').hostNodes().text()).toBe(`$${model.price}`);
		expect(component.find('.item-difference-value').hostNodes().text()).toBe(`$${40}`);

		const taxedModel = new ItemModel({...model.valueOf(), addTaxes: true});
		component.setProps({ itemModel: taxedModel });
		expect(component.find('.item-name').hostNodes().text()).toBe(model.name);
		expect(component.find('.item-saved-value').hostNodes().text()).toBe(`$${model.saved}`);
		expect(component.find('.item-price-value').hostNodes().text()).toBe(`$${65}`);
		expect(component.find('.item-difference-value').hostNodes().text()).toBe(`$${40}`);
	});


	// it('can decrement saved amount', () => {
	// 	const component = mount(<Item itemModel={model} updateItem={updateItem}/>);
	// 	expect(component.find('.item-name').hostNodes().text()).toBe(model.name);
	// 	expect(component.find('.item-saved-value').hostNodes().text()).toBe(`$${model.saved}`);
	// 	expect(component.find('.item-price-value').hostNodes().text()).toBe(`$${model.price}`);
	// 	expect(component.find('.item-difference-value').hostNodes().text()).toBe(`$${40}`);

	// 	component.find('.item-decrement-button')
	// 		.hostNodes()
	// 		.simulate('click', { preventDefault() {} });

	// 	expect(component.find('.item-name').hostNodes().text()).toBe(model.name);
	// 	expect(component.find('.item-saved-value').hostNodes().text()).toBe(`$3`);
	// 	expect(component.find('.item-price-value').hostNodes().text()).toBe(`$${model.price}`);
	// 	expect(component.find('.item-difference-value').hostNodes().text()).toBe(`$${47}`);

	// 	component.find('.item-decrement-button')
	// 		.hostNodes()
	// 		.simulate('click', { preventDefault() {} });
	// 	component.update();

	// 	expect(component.find('.item-name').hostNodes().text()).toBe(model.name);
	// 	expect(component.find('.item-saved-value').hostNodes().text()).toBe(`$0`);
	// 	expect(component.find('.item-price-value').hostNodes().text()).toBe(`$${model.price}`);
	// 	expect(component.find('.item-difference-value').hostNodes().text()).toBe(`$${50}`);
	// });

	// it('can increment saved amount', () => {
	// 	const component = mount(<Item itemModel={model} updateItem={updateItem}/>);
	// 	expect(component.find('.item-name').hostNodes().text()).toBe(model.name);
	// 	expect(component.find('.item-saved-value').hostNodes().text()).toBe(`$${model.saved}`);
	// 	expect(component.find('.item-price-value').hostNodes().text()).toBe(`$${model.price}`);
	// 	expect(component.find('.item-difference-value').hostNodes().text()).toBe(`$${40}`);

	// 	component.find('.item-increment-button')
	// 		.hostNodes()
	// 		.simulate('click', { preventDefault() {} });

	// 	expect(component.find('.item-name').hostNodes().text()).toBe(model.name);
	// 	expect(component.find('.item-saved-value').hostNodes().text()).toBe(`$17`);
	// 	expect(component.find('.item-price-value').hostNodes().text()).toBe(`$${model.price}`);
	// 	expect(component.find('.item-difference-value').hostNodes().text()).toBe(`$${33}`);

	// 	const incrementModel = new ItemModel({...model.valueOf(), increment: 50});
	// 	component.setProps({ itemModel: incrementModel, updateItem });
	// 	component.find('.item-increment-button')
	// 		.hostNodes()
	// 		.simulate('click', { preventDefault() {} });

	// 	expect(component.find('.item-name').hostNodes().text()).toBe(model.name);
	// 	expect(component.find('.item-saved-value').hostNodes().text()).toBe(`$67`);
	// 	expect(component.find('.item-price-value').hostNodes().text()).toBe(`$${model.price}`);
	// 	expect(component.find('.item-difference-value').hostNodes().text()).toBe(`$0`);
	// });
});
