import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow } from 'enzyme';

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
});