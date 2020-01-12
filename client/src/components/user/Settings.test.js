import React from 'react';
import { render, fireEvent, act, prettyDOM } from '@testing-library/react'

import Settings from './Settings.jsx';
import UserContext from '../app/UserContext.jsx';
import FirebaseWrapper from '../../utils/FirebaseWrapper.js';

const userContext = {
	username: 'Harry Bosch',
	tax: 13,
	defaultList: 'Christmas Shopping',
	defaultIncrement: 50,
	addTaxes: false
};

describe('Settings', () => {
	it('user settings form shows up', () => {
		const { getByText } = render(
			<UserContext.Provider value={userContext}>
				<Settings history={[]}/>
			</UserContext.Provider>
		);

		expect(getByText('Username'));
		expect(getByText('Sales Tax'));
		expect(getByText('Default Increment'));
		expect(getByText('Default List'));
		expect(getByText('Add Taxes'));
		expect(getByText('Save Settings'));
	});
});