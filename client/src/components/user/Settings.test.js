import React from 'react';
import { render, fireEvent, act, prettyDOM } from '@testing-library/react'

import Settings from './Settings.jsx';

import FirebaseWrapper from '../../utils/FirebaseWrapper.js';

describe('Settings', () => {
	it('user settings form shows up', () => {
		const { getByText } = render(<Settings history={[]}/>);
		expect(getByText('Username'));
		expect(getByText('Sales Tax'));
		expect(getByText('Default Increment'));
		expect(getByText('Default List'));
		expect(getByText('Add Taxes'));
		expect(getByText('Save Settings'));
	});
});