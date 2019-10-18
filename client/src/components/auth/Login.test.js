import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { mount, shallow } from 'enzyme';
import Login from './Login';

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
			.first()
			.simulate('click', {
				preventDefault() {}
			});

		const errorMessage = 'Email cannot be empty';
		expect(component.find('#email-helper-text').first().text()).toBe(errorMessage);
	});

	it('password error message shows up when field is empty', () => {
		const component = mount(<Login />);
		expect(component.find('#password-helper-text')).toHaveLength(0);
		component.find('#login-form-button')
			.first()
			.simulate('click', {
				preventDefault() {}
			});

		const errorMessage = 'Password must have at least 6 characters';
		expect(component.find('#password-helper-text').first().text()).toBe(errorMessage);
	});

	it('password error message shows up when field has <6 chars', () => {
		const component = mount(<Login />);
		expect(component.find('#password-helper-text')).toHaveLength(0);
		component.find('#password')
			.first()
			.simulate('change', { target: { value: '12345' } });

		component.find('#login-form-button')
			.first()
			.simulate('click', { preventDefault() {} });


		const errorMessage = 'Password must have at least 6 characters';
		expect(component.find('#password-helper-text').first().text()).toBe(errorMessage);
	});

	// it('shows proper error message', () => {
	// 	const component = mount(<Login />);
	// 	expect(component.find('#password-helper-text')).toHaveLength(0);
	// 	component.find('#email')
	// 		.first()
	// 		.simulate('change', { target: { value: 'john' } });
	// 	component.find('#password')
	// 		.first()
	// 		.simulate('change', { target: { value: '1234567' } });

	// 	component.find('#login-form-button')
	// 		.first()
	// 		.simulate('click', { preventDefault() {} });


	// 	const errorMessage = 'Password must have at least 6 characters';
	// 	expect(component.find('#password-helper-text').first().text()).toBe(errorMessage);
	// });
});