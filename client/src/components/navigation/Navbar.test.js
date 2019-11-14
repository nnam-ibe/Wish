import React from 'react';
import { render, fireEvent } from '@testing-library/react'

import Navbar from './Navbar';


describe('Navbar', () => {
	it('login button appears when not logged in', () => {
		const { getByText } = render(<Navbar />);
		expect(getByText('Login'));
	});

	it('logout button appears when logged in', () => {
		const { getByText } = render(<Navbar isLoggedIn={true}/>);
		expect(getByText('Logout')).toBeDefined();
	});

	it('title of page appears as expected', () => {
		const title = 'Title of page';
		const { getByText } = render(<Navbar title={title}/>);
		expect(getByText(title));
	});

	it('setting menu item appears when logged in', () => {
		const nav = jest.fn();
		const { getByText, getByRole } = render(<Navbar isLoggedIn={true} nav={nav}/>);
		fireEvent.click(getByRole('dialog'));
		expect(getByText('Settings'));
		fireEvent.click(getByText('Settings'));
		expect(nav.mock.calls.length).toBe(1);
	});
});