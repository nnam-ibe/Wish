import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow } from 'enzyme';

import Settings from './Settings';

Enzyme.configure({ adapter: new Adapter() });

const props = { history: [] };

describe('Settings', () => {
	it('user settings form shows up', () => {
		const component = shallow(<Settings {...props}/>);
		expect(component.find('.user-settings-form')).toHaveLength(1);
	});

	it ('username shows up', () => {
		const component = shallow(<Settings {...props}/>);
		expect(component.find('#settings-form-username')).toHaveLength(1);
	});

	it ('tax shows up', () => {
		const component = shallow(<Settings {...props}/>);
		expect(component.find('#settings-form-tax')).toHaveLength(1);
	});

	it ('default-increment shows up', () => {
		const component = shallow(<Settings {...props}/>);
		expect(component.find('#settings-form-default-increment')).toHaveLength(1);
	});

	it ('default-list shows up', () => {
		const component = shallow(<Settings {...props}/>);
		expect(component.find('#settings-form-default-list')).toHaveLength(1);
	});

	it ('add-taxes shows up', () => {
		const component = shallow(<Settings {...props}/>);
		expect(component.find('#settings-form-taxes-form-control')).toHaveLength(1);
	});

});