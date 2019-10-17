import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { mount, shallow } from 'enzyme';

import Sidebar from './Sidebar';

Enzyme.configure({ adapter: new Adapter() });

const props = {
	location: {
		pathname: '/lists/List1'
	},
	userPrefs: {
		activeLists: ['List1', 'List2', 'List3']
	}
};

describe('Sidebar', () => {
	it('new list button appears', () => {
		const component = shallow(<Sidebar {...props}/>);
		const newlistButton = component.find('.btn-new-list');
		expect(newlistButton).toHaveLength(1);
		expect(newlistButton.text()).toBe('New List');
	});

	it('list items appear', () => {
		const component = mount(<Sidebar {...props}/>);
		const newlistButton = component.find('.sidebar-list-item-div');
		expect(newlistButton).toHaveLength(3);
	});

	it('Delete button does not show up when not in /settings', () => {
		const component = mount(<Sidebar {...props}/>);
		const newlistButton = component.find('.sidebar-delete-button');
		expect(newlistButton).toHaveLength(0);
	});

	it('Delete button shows up for each item when in /settings', () => {
		const noEditProps = {...props, ...{ location: { pathname: '/settings' }}};
		const component = mount(<Sidebar {...noEditProps}/>);
		const newlistButton = component.find('.sidebar-delete-button');
		expect(newlistButton).toHaveLength(3);
	});
});