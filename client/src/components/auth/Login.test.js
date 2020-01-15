import React from 'react';
import {render, fireEvent, act} from '@testing-library/react'

import Login from './Login.jsx';
const FirebaseWrapper = require('../../utils/FirebaseWrapper.js');

// mock api calls
let resolve, reject;
FirebaseWrapper.login = jest.fn(() => new Promise((_resolve, _reject) => {
	resolve = _resolve;
	reject = _reject;
}));

describe('Login', () => {
	it('login form appears', () => {
		const { getByText } = render(<Login />);
		expect(getByText('Email Address'));
		expect(getByText('Password'));
	});

	it('error helper texts shows up when fields are empty', () => {
		const emailEmptyMessage = 'Email cannot be empty';
		const passwordEmptyMessage = 'Password must have at least 6 characters';
		const { getByText, queryByText, getByRole } = render(<Login />);

		const emailHelperText = queryByText(emailEmptyMessage);
		const passwordHelperText = queryByText(passwordEmptyMessage);
		expect(emailHelperText).toBeNull();
		expect(passwordHelperText).toBeNull();

		fireEvent.click(getByRole('button'));
		expect(getByText(emailEmptyMessage));
		expect(getByText(passwordEmptyMessage));
	});

	it('password error message shows up when field has <6 chars', () => {
		const errorMessage = 'Password must have at least 6 characters';
		const { getByText, getByRole, container } = render(<Login />);

		fireEvent.change(container.querySelector('#password'), { target: { value: '12345' } });
		fireEvent.click(getByRole('button'));
		expect(getByText(errorMessage));
	});

	it('makes api call when validation requirements are met', async () => {
		const emailValue = 'sample@mail.com';
		const passwordValue = '123456';
		const { getByRole, container } = render(<Login {...{history: []}}/>);
		fireEvent.change(container.querySelector('#email'), { target: { value: emailValue } });
		fireEvent.change(container.querySelector('#password'), { target: { value: passwordValue } });
		fireEvent.click(getByRole('button'));

		await act(async () => {
			resolve();
		});

		expect(FirebaseWrapper.login.mock.calls[0][0].email).toBe(emailValue);
		expect(FirebaseWrapper.login.mock.calls[0][0].password).toBe(passwordValue);
	});

	it('displays error from firebase on email', async () => {
		const errorMessage = 'No account found';
		const emailValue = 'sample@mail.com';
		const passwordValue = '654321';
		const { getByText, getByRole, container } = render(<Login />);
		fireEvent.change(container.querySelector('#email'), { target: { value: emailValue } });
		fireEvent.change(container.querySelector('#password'), { target: { value: passwordValue } });
		fireEvent.click(getByRole('button'));

		await act(async () => {
			reject({ code: 'auth/user-not-found' });
		});

		expect(FirebaseWrapper.login.mock.calls[1][0].email).toBe(emailValue);
		expect(FirebaseWrapper.login.mock.calls[1][0].password).toBe(passwordValue);
		expect(getByText(errorMessage));
	});

	it('displays error from firebase on password', async () => {
		const errorMessage = 'Incorrect password';
		const emailValue = 'sample@mail.com';
		const passwordValue = '654321';
		const { getByText, getByRole, container } = render(<Login />);
		fireEvent.change(container.querySelector('#email'), { target: { value: emailValue } });
		fireEvent.change(container.querySelector('#password'), { target: { value: passwordValue } });
		fireEvent.click(getByRole('button'));

		await act(async () => {
			reject({ code: 'auth/wrong-password' });
		});

		expect(FirebaseWrapper.login.mock.calls[1][0].email).toBe(emailValue);
		expect(FirebaseWrapper.login.mock.calls[1][0].password).toBe(passwordValue);
		expect(getByText(errorMessage));
	});
});