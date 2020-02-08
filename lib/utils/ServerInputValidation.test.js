import {
	validateListName,
	validateUsername,
	validateEmail,
	validatePassword,
	validateTax,
} from './ServerInputValidation';

const usernameError = 'Username must be between 1 & 16 characters';

describe('List Name', () => {
	it('returns error when list name is falsy', () => {
		expect(validateListName().message).toBe('Name is invalid');
		expect(validateListName(null).message).toBe('Name is invalid');
		expect(validateListName('').message).toBe('Name is invalid');
		expect(validateListName('  ').message).toBe('Name cannot be empty');
	});

	it('returns error when list name is has >36 chars', () => {
		const st = 'ABCDEFGHIJKLMNOPQRSTUVWZYZ1234567890_OVERFLOW';
		expect(validateListName(st).message).toBe('Maximum of 36 characters allowed');
	});

	it('no error with valid list name', () => {
		expect(validateListName('A')).toBeUndefined();
		expect(validateListName('ABCDEFGHIJKLMNOPQRSTUVWZYZ1234567890')).toBeUndefined();
	});
});

describe('Username', () => {
	it('returns error when username is falsy', () => {
		expect(validateUsername().message).toBe(usernameError);
		expect(validateUsername('').message).toBe(usernameError);
		expect(validateUsername(null).message).toBe(usernameError);
	});

	it('returns error when username is >16 chars', () => {
		expect(validateUsername('MickJagger0123456').message).toBe(usernameError);
	});

	it('no error when username is valid', () => {
		expect(validateUsername('MickJagger')).toBeUndefined();
		expect(validateUsername('MickJagger012345')).toBeUndefined();
		expect(validateUsername('  MickJagger012345  ')).toBeUndefined();
		expect(validateUsername('1')).toBeUndefined();
	});
});

describe('Email', () => {
	it('returns error when email is falsy', () => {
		expect(validateEmail(' ').message).toBe('Email cannot be empty');
		expect(validateEmail(null).message).toBe('Email cannot be empty');
		expect(validateEmail().message).toBe('Email cannot be empty');
	});

	it('email should have @ symbol', () => {
		expect(validateEmail('james').message).toBe('Please enter a valid email');
		expect(validateEmail('james@mail')).toBeUndefined();
	});
});

describe('Password', () => {
	it('returns error when password is <6 chars', () => {
		expect(validatePassword(' ').message).toBe('Password must have at least 6 characters');
		expect(validatePassword('12345').message).toBe('Password must have at least 6 characters');
		expect(validatePassword(null).message).toBe('Password must have at least 6 characters');
		expect(validatePassword().message).toBe('Password must have at least 6 characters');
	});

	it('no error when password is >=6 chars', () => {
		expect(validatePassword('123456')).toBeUndefined();
		expect(validatePassword(' 12345')).toBeUndefined();
	});
});

describe('Tax', () => {
	it('returns error when tax amount isNaN', () => {
		expect(validateTax('A12').message).toBe('Tax must be a valid number');
		expect(validateTax('12%').message).toBe('Tax must be a valid number');
		expect(validateTax('').message).toBe('Tax cannot be empty');
		expect(validateTax(null).message).toBe('Tax cannot be empty');
		expect(validateTax().message).toBe('Tax cannot be empty');
	});

	it('returns error when tax amount is <0 || >100', () => {
		expect(validateTax(-1).message).toBe('Tax must be between 0 & 100');
		expect(validateTax(101).message).toBe('Tax must be between 0 & 100');
	});

	it('no error when tax is valid', () => {
		expect(validateTax(0)).toBeUndefined();
		expect(validateTax(50)).toBeUndefined();
		expect(validateTax(100)).toBeUndefined();
		expect(validateTax(' 100 ')).toBeUndefined();
	});
});
