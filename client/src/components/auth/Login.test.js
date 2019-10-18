import { act } from 'react-dom/test-utils';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { mount, shallow } from 'enzyme';
import Login from './Login';
import FirebaseUtil from '../../utils/firebaseUtil.js';

Enzyme.configure({ adapter: new Adapter() });

describe('Login', () => {
	it('login form appears', () => {
		const component = shallow(<Login />);
		expect(component.find('.login-form')).toHaveLength(1);
	});

	it('email error message shows up when field is empty', () => {
		const component = mount(<Login />);
		expect(component.find('#email-helper-text')).toHaveLength(0);
		component.find('#login-form-button')
			.hostNodes()
			.simulate('click', {
				preventDefault() {}
			});

		const errorMessage = 'Email cannot be empty';
		expect(component.find('#email-helper-text').hostNodes().text()).toBe(errorMessage);
	});

	it('password error message shows up when field is empty', () => {
		const component = mount(<Login />);
		expect(component.find('#password-helper-text')).toHaveLength(0);
		component.find('#login-form-button')
			.hostNodes()
			.simulate('click', {
				preventDefault() {}
			});

		const errorMessage = 'Password must have at least 6 characters';
		expect(component.find('#password-helper-text').hostNodes().text()).toBe(errorMessage);
	});

	it('password error message shows up when field has <6 chars', () => {
		const component = mount(<Login />);
		expect(component.find('#password-helper-text')).toHaveLength(0);
		component.find('#password')
			.hostNodes()
			.simulate('change', { target: { value: '12345' } });

		component.find('#login-form-button')
			.hostNodes()
			.simulate('click', { preventDefault() {} });

		const errorMessage = 'Password must have at least 6 characters';
		expect(component.find('#password-helper-text').hostNodes().text()).toBe(errorMessage);
	});

	it('makes api calls when validation requirements are met', () => {
		FirebaseUtil.login = jest.fn(() => Promise.resolve());
		const emailValue = 'john';
		const passwordValue = '123456';
		const component = mount(<Login {...{history: []}}/>);
		component.find('#email')
			.hostNodes()
			.simulate('change', { target: { value: emailValue } });
		component.find('#password')
			.hostNodes()
			.simulate('change', { target: { value: passwordValue } });

		component.find('#login-form-button')
			.hostNodes()
			.simulate('click', { preventDefault() {} });

		expect(FirebaseUtil.login.mock.calls.length).toBe(1);
		expect(FirebaseUtil.login.mock.calls[0][0].email).toBe(emailValue);
		expect(FirebaseUtil.login.mock.calls[0][0].password).toBe(passwordValue);
	});

	// it('displays error from firebase on email', () => {
	// 	FirebaseUtil.login = jest.fn(() => Promise.reject({ code: 'auth/user-not-found' }));
	// 	const emailValue = 'johnny';
	// 	const passwordValue = '654321';
	// 	const component = mount(<Login />);
	// 	// act(() => {
	// 		component.find('#email')
	// 			.hostNodes()
	// 			.simulate('change', { target: { value: emailValue } });
	// 		component.find('#password')
	// 			.hostNodes()
	// 			.simulate('change', { target: { value: passwordValue } });
	// 		component.find('#login-form-button')
	// 			.hostNodes()
	// 			.simulate('click', { preventDefault() {} });
	// 	// });

	// 	expect(FirebaseUtil.login.mock.calls.length).toBe(1);
	// 	expect(FirebaseUtil.login.mock.calls[0][0].email).toBe(emailValue);
	// 	expect(FirebaseUtil.login.mock.calls[0][0].password).toBe(passwordValue);

	// 	console.log(component.debug());
	// 	const errorMessage = 'No account found';
	// 	expect(component.find('#email-helper-text').hostNodes().text()).toBe(errorMessage);
	// });
});