import React from 'react';
import { render, fireEvent, act } from '@testing-library/react'

import CreateAccount from './CreateAccount.jsx';
import FetchWrapper from '../../utils/FetchWrapper.js';

// mock api calls
let resolve, reject;
FetchWrapper.put = jest.fn(() => new Promise((_resolve, _reject) => {
	resolve = _resolve;
	reject = _reject;
}));

describe('CreateAccount', () => {
	it('CreateAccount appears', () => {
		const { getByText } = render(<CreateAccount />);
		expect(getByText('Create your Account'));
	});

	it('errors show up when fields are empty', () => {
		const { getByText, getByRole } = render(<CreateAccount />);

		fireEvent.click(getByRole('button'));
		expect(getByText('Username must be between 1 & 16 characters'));
		expect(getByText('Email cannot be empty'));
		expect(getByText('Password must have at least 6 characters'));
	});

	it('errors show up when passwords dont match', async () => {
		const usernameValue = 'johnny';
		const emailValue = 'sample@mail.ca';
		const passwordValue = '654321';
		const confirmPasswordValue = 'different';
		const { getByText, getByRole, container } = render(<CreateAccount />);

		fireEvent.change(container.querySelector('#username'), { target: { value: usernameValue } });
		fireEvent.change(container.querySelector('#email'), { target: { value: emailValue } });
		fireEvent.change(container.querySelector('#password'), { target: { value: passwordValue } });
		fireEvent.change(container.querySelector('#confirmPassword'), { target: { value: confirmPasswordValue } });
		fireEvent.click(getByRole('button'));
		expect(getByText('Passwords don\'t match'));
	});

	it('makes api call when it passes validation', async () => {
		const usernameValue = 'johnny';
		const emailValue = 'sample@mail.ca';
		const passwordValue = '654321';
		const { getByText, getByRole, container } = render(<CreateAccount {...{history: []}}/>);

		fireEvent.change(container.querySelector('#username'), { target: { value: usernameValue } });
		fireEvent.change(container.querySelector('#email'), { target: { value: emailValue } });
		fireEvent.change(container.querySelector('#password'), { target: { value: passwordValue } });
		fireEvent.change(container.querySelector('#confirmPassword'), { target: { value: passwordValue } });
		fireEvent.click(getByRole('button'));

		await act(async () => {
			resolve({
				ok: true
			});
		});

		expect(FetchWrapper.put.mock.calls[0][1].username).toBe(usernameValue);
		expect(FetchWrapper.put.mock.calls[0][1].email).toBe(emailValue);
		expect(FetchWrapper.put.mock.calls[0][1].password).toBe(passwordValue);
	});

	it('displays validation error message from api', async () => {
		const usernameValue = 'neverjohnny';
		const emailValue = 'happens@johnny.ca';
		const passwordValue = 'tools654321';
		const { getByText, getByRole, container } = render(<CreateAccount />);

		fireEvent.change(container.querySelector('#username'), { target: { value: usernameValue } });
		fireEvent.change(container.querySelector('#email'), { target: { value: emailValue } });
		fireEvent.change(container.querySelector('#password'), { target: { value: passwordValue } });
		fireEvent.change(container.querySelector('#confirmPassword'), { target: { value: passwordValue } });
		fireEvent.click(getByRole('button'));

		await act(async () => {
			resolve({
				json() {
					return { code: 'auth/email-already-in-use' }
				}
			});
		});

		expect(FetchWrapper.put.mock.calls[1][1].username).toBe(usernameValue);
		expect(FetchWrapper.put.mock.calls[1][1].email).toBe(emailValue);
		expect(FetchWrapper.put.mock.calls[1][1].password).toBe(passwordValue);
		expect(getByText('Email is already in use'));
	});

	it('displays promise failure reason', async () => {
		const usernameValue = 'neverjohnny';
		const emailValue = 'happens@johnny.ca';
		const passwordValue = 'tools654321';
		const { getByText, getByRole, container } = render(<CreateAccount />);

		fireEvent.change(container.querySelector('#username'), { target: { value: usernameValue } });
		fireEvent.change(container.querySelector('#email'), { target: { value: emailValue } });
		fireEvent.change(container.querySelector('#password'), { target: { value: passwordValue } });
		fireEvent.change(container.querySelector('#confirmPassword'), { target: { value: passwordValue } });
		fireEvent.click(getByRole('button'));

		const errorMessage = 'Sample error message';
		await act(async () => reject(errorMessage));

		expect(FetchWrapper.put.mock.calls[2][1].username).toBe(usernameValue);
		expect(FetchWrapper.put.mock.calls[2][1].email).toBe(emailValue);
		expect(FetchWrapper.put.mock.calls[2][1].password).toBe(passwordValue);
		expect(getByText('Sample error message'));
	});
});