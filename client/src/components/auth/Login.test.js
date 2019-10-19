import { act } from 'react-dom/test-utils';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { mount, shallow } from 'enzyme';
import Login from './Login';
import FirebaseUtil from '../../utils/firebaseUtil.js';

Enzyme.configure({ adapter: new Adapter() });

// mock api calls
let resolve, reject;
FirebaseUtil.login = jest.fn(() => new Promise((_resolve, _reject) => {
	resolve = _resolve;
	reject = _reject;
}));

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

	it('makes api call when validation requirements are met', async () => {
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

		await act(async () => {
			resolve();
		});

		expect(FirebaseUtil.login.mock.calls[0][0].email).toBe(emailValue);
		expect(FirebaseUtil.login.mock.calls[0][0].password).toBe(passwordValue);
		expect(component.prop('history')[0]).toBe('/');
	});

	it('displays error from firebase on email', async () => {
		const emailValue = 'johnny';
		const passwordValue = '654321';
		const component = mount(<Login />);
		component.find('#email')
			.hostNodes()
			.simulate('change', { target: { value: emailValue } });
		component.find('#password')
			.hostNodes()
			.simulate('change', { target: { value: passwordValue } });
		component.find('#login-form-button')
			.hostNodes()
			.simulate('click', { preventDefault() {} });

		await act(async () => {
			reject({ code: 'auth/user-not-found' });
		});
		component.update();

		expect(FirebaseUtil.login.mock.calls[1][0].email).toBe(emailValue);
		expect(FirebaseUtil.login.mock.calls[1][0].password).toBe(passwordValue);

		const errorMessage = 'No account found';
		expect(component.find('#email-helper-text').hostNodes().text()).toBe(errorMessage);
	});

	it('displays error from firebase on password', async () => {
		const emailValue = 'anderson';
		const passwordValue = 'limaserver';
		const component = mount(<Login />);
		component.find('#email')
			.hostNodes()
			.simulate('change', { target: { value: emailValue } });
		component.find('#password')
			.hostNodes()
			.simulate('change', { target: { value: passwordValue } });
		component.find('#login-form-button')
			.hostNodes()
			.simulate('click', { preventDefault() {} });

		await act(async () => {
			reject({ code: 'auth/wrong-password' });
		});
		component.update();

		expect(FirebaseUtil.login.mock.calls[2][0].email).toBe(emailValue);
		expect(FirebaseUtil.login.mock.calls[2][0].password).toBe(passwordValue);

		const errorMessage = 'Incorrect password';
		expect(component.find('#password-helper-text').hostNodes().text()).toBe(errorMessage);
	});
});