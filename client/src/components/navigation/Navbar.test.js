import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { mount, render, shallow } from 'enzyme';

import Navbar from './Navbar';

Enzyme.configure({ adapter: new Adapter() });

describe('Navbar', () => {
	it('login button appears when not logged in', () => {
		const component = shallow(<Navbar />);
		const loginButton = component.find('.btn-login');
		expect(loginButton).toHaveLength(1);
		expect(loginButton.text()).toBe('Login');
	});

	it('logout button appears when logged in', () => {
		const component = shallow(<Navbar isLoggedIn={true}/>);
		const logoutButton = component.find('.btn-login');
		expect(logoutButton).toHaveLength(1);
		expect(logoutButton.text()).toBe('Logout');
	});

	it('title of page appears as expected', () => {
		const title = 'Title of page';
		const component = shallow(<Navbar title={title}/>);
		const titleElement = component.find('.page-title');
		expect(titleElement).toHaveLength(1);
		expect(titleElement.text()).toBe(title);
	});

	it ('setting menu item appears when logged in', () => {
		const nav = jest.fn();
		const component = shallow(<Navbar isLoggedIn={true} nav={nav}/>);
		component.find('#menu-appbar').simulate('click');

		const settingMenu = component.find('.setting-item');
		expect(settingMenu).toHaveLength(1);
		settingMenu.simulate('click');
		expect(nav.mock.calls.length).toBe(1);
	});
});