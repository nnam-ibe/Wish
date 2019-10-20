import { act } from 'react-dom/test-utils';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { mount, shallow } from 'enzyme';

import CreateAccount from './CreateAccount.jsx';
import FetchWrapper from '../../utils/FetchWrapper.js';

Enzyme.configure({ adapter: new Adapter() });

// mock api calls
let resolve, reject;
FetchWrapper.put = jest.fn(() => new Promise((_resolve, _reject) => {
	resolve = _resolve;
	reject = _reject;
}));

describe('CreateAccount', () => {
	it('CreateAccount appears', () => {
		const component = shallow(<CreateAccount />);
		expect(component.find('.create-account-form')).toHaveLength(1);
	});

	it('errors show up when fields are empty', () => {
		const component = mount(<CreateAccount />);
		expect(component.find('#username-helper-text')).toHaveLength(0);
		expect(component.find('#email-helper-text')).toHaveLength(0);
		expect(component.find('#password-helper-text')).toHaveLength(0);
		component.find('#create-account-form-button')
			.hostNodes()
			.simulate('click', {
				preventDefault() {}
			});

		const usernameError = 'Username must be between 1 & 16 characters';
		const emailError = 'Email cannot be empty';
		const passwordError = 'Password must have at least 6 characters';
		expect(component.find('#username-helper-text').hostNodes().text()).toBe(usernameError);
		expect(component.find('#email-helper-text').hostNodes().text()).toBe(emailError);
		expect(component.find('#password-helper-text').hostNodes().text()).toBe(passwordError);
	});

	it('errors show up when passwords dont match', async () => {
		const usernameValue = 'johnny';
		const emailValue = 'johnny';
		const passwordValue = '654321';
		const confirmPasswordValue = 'different';
		const component = mount(<CreateAccount />);

		component.find('#username')
			.hostNodes()
			.simulate('change', { target: { value: usernameValue } });
		component.find('#email')
			.hostNodes()
			.simulate('change', { target: { value: emailValue } });
		component.find('#password')
			.hostNodes()
			.simulate('change', { target: { value: passwordValue } });
		component.find('#confirmPassword')
			.hostNodes()
			.simulate('change', { target: { value: confirmPasswordValue } });
		component.find('#create-account-form-button')
			.hostNodes()
			.simulate('click', { preventDefault() {} });

		const passwordError = 'Passwords don\'t match';
		expect(component.find('#confirmPassword-helper-text').hostNodes().text()).toBe(passwordError);
	});

	it('makes api call when it passes validation', async () => {
		const usernameValue = 'johnny';
		const emailValue = 'johnny';
		const passwordValue = '654321';
		const component = mount(<CreateAccount {...{history: []}}/>);

		component.find('#username')
			.hostNodes()
			.simulate('change', { target: { value: usernameValue } });
		component.find('#email')
			.hostNodes()
			.simulate('change', { target: { value: emailValue } });
		component.find('#password')
			.hostNodes()
			.simulate('change', { target: { value: passwordValue } });
		component.find('#confirmPassword')
			.hostNodes()
			.simulate('change', { target: { value: passwordValue } });
		component.find('#create-account-form-button')
			.hostNodes()
			.simulate('click', { preventDefault() {} });

		await act(async () => {
			resolve({
				ok: true
			});
		});

		expect(FetchWrapper.put.mock.calls[0][1].username).toBe(usernameValue);
		expect(FetchWrapper.put.mock.calls[0][1].email).toBe(emailValue);
		expect(FetchWrapper.put.mock.calls[0][1].password).toBe(passwordValue);
		expect(component.prop('history')[0]).toBe('/login');;
	});

	it('displays validation error message from api', async () => {
		const usernameValue = 'neverjohnny';
		const emailValue = 'happensjohnny';
		const passwordValue = 'tools654321';
		const component = mount(<CreateAccount />);

		component.find('#username')
			.hostNodes()
			.simulate('change', { target: { value: usernameValue } });
		component.find('#email')
			.hostNodes()
			.simulate('change', { target: { value: emailValue } });
		component.find('#password')
			.hostNodes()
			.simulate('change', { target: { value: passwordValue } });
		component.find('#confirmPassword')
			.hostNodes()
			.simulate('change', { target: { value: passwordValue } });
		component.find('#create-account-form-button')
			.hostNodes()
			.simulate('click', { preventDefault() {} });

		await act(async () => {
			resolve({
				json() {
					return { code: 'auth/email-already-in-use' }
				}
			});
		});
		component.update();

		expect(FetchWrapper.put.mock.calls[1][1].username).toBe(usernameValue);
		expect(FetchWrapper.put.mock.calls[1][1].email).toBe(emailValue);
		expect(FetchWrapper.put.mock.calls[1][1].password).toBe(passwordValue);

		const errorMessage = 'Email is already in use';
		expect(component.find('#email-helper-text').hostNodes().text()).toBe(errorMessage);
	});

	it('displays promise failure reason', async () => {
		const usernameValue = 'neverjohnny';
		const emailValue = 'happensjohnny';
		const passwordValue = 'tools654321';
		const component = mount(<CreateAccount />);

		component.find('#username')
			.hostNodes()
			.simulate('change', { target: { value: usernameValue } });
		component.find('#email')
			.hostNodes()
			.simulate('change', { target: { value: emailValue } });
		component.find('#password')
			.hostNodes()
			.simulate('change', { target: { value: passwordValue } });
		component.find('#confirmPassword')
			.hostNodes()
			.simulate('change', { target: { value: passwordValue } });
		component.find('#create-account-form-button')
			.hostNodes()
			.simulate('click', { preventDefault() {} });

		const errorMessage = 'Sample error message';
		await act(async () => reject(errorMessage));
		component.update();

		expect(FetchWrapper.put.mock.calls[2][1].username).toBe(usernameValue);
		expect(FetchWrapper.put.mock.calls[2][1].email).toBe(emailValue);
		expect(FetchWrapper.put.mock.calls[2][1].password).toBe(passwordValue);

		expect(component.find('#email-helper-text').hostNodes().text()).toBe(errorMessage);
	});
});