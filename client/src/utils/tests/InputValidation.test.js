const InputValidation = require('../InputValidation');

const usernameError = 'Username must be between 1 & 16 characters';

test('returns error when list name is falsy', () => {
	expect(InputValidation.validateListName().message).toBe('Name is invalid');
	expect(InputValidation.validateListName(null).message).toBe('Name is invalid');
	expect(InputValidation.validateListName('').message).toBe('Name is invalid');
	expect(InputValidation.validateListName('  ').message).toBe('Name cannot be empty');
});

test('returns error when list name is has >36 chars', () => {
	const st = 'ABCDEFGHIJKLMNOPQRSTUVWZYZ1234567890_OVERFLOW';
	expect(InputValidation.validateListName(st).message).toBe('Maximum of 36 characters allowed');
});

test('no error with valid list name', () => {
	expect(InputValidation.validateListName('A')).toBeUndefined();
	expect(InputValidation.validateListName('ABCDEFGHIJKLMNOPQRSTUVWZYZ1234567890')).toBeUndefined();
});

test('returns error when username is falsy', () => {
	expect(InputValidation.validateUsername().message).toBe(usernameError);
	expect(InputValidation.validateUsername('').message).toBe(usernameError);
	expect(InputValidation.validateUsername(null).message).toBe(usernameError);
});

test('returns error when username is >16 chars', () => {
	expect(InputValidation.validateUsername('MickJagger0123456').message).toBe(usernameError);
});

test('no error when username is valid', () => {
	expect(InputValidation.validateUsername('MickJagger')).toBeUndefined();
	expect(InputValidation.validateUsername('MickJagger012345')).toBeUndefined();
	expect(InputValidation.validateUsername('  MickJagger012345  ')).toBeUndefined();
	expect(InputValidation.validateUsername('1')).toBeUndefined();
});

test('returns error when email is falsy', () => {
	expect(InputValidation.validateEmail(' ').message).toBe('Email cannot be empty');
	expect(InputValidation.validateEmail(null).message).toBe('Email cannot be empty');
	expect(InputValidation.validateEmail().message).toBe('Email cannot be empty');
});

test('email should have @ symbol', () => {
	expect(InputValidation.validateEmail('james').message).toBe('Please enter a valid email');
	expect(InputValidation.validateEmail('james@mail')).toBeUndefined();
});

test('returns error when password is <6 chars', () => {
	expect(InputValidation.validatePassword(' ').message).toBe('Password must have at least 6 characters');
	expect(InputValidation.validatePassword('12345').message).toBe('Password must have at least 6 characters');
	expect(InputValidation.validatePassword(null).message).toBe('Password must have at least 6 characters');
	expect(InputValidation.validatePassword().message).toBe('Password must have at least 6 characters');
});

test('no error when password is >=6 chars', () => {
	expect(InputValidation.validatePassword('123456')).toBeUndefined();
	expect(InputValidation.validatePassword(' 12345')).toBeUndefined();
});

test('returns error when tax amount isNaN', () => {
	expect(InputValidation.validateTax('A12').message).toBe('Tax must be a valid number');
	expect(InputValidation.validateTax('12%').message).toBe('Tax must be a valid number');
	expect(InputValidation.validateTax('').message).toBe('Tax cannot be empty');
	expect(InputValidation.validateTax(null).message).toBe('Tax cannot be empty');
	expect(InputValidation.validateTax().message).toBe('Tax cannot be empty');
});

test('returns error when tax amount is <0 || >100', () => {
	expect(InputValidation.validateTax(-1).message).toBe('Tax must be between 0 & 100');
	expect(InputValidation.validateTax(101).message).toBe('Tax must be between 0 & 100');
});

test('no error when tax is valid', () => {
	expect(InputValidation.validateTax(0)).toBeUndefined();
	expect(InputValidation.validateTax(50)).toBeUndefined();
	expect(InputValidation.validateTax(100)).toBeUndefined();
	expect(InputValidation.validateTax(' 100 ')).toBeUndefined();
});

test('no error when strings are equal', () => {
	expect(InputValidation.validatePasswordsAreEqual('value', 'value')).toBeUndefined();
	expect(InputValidation.validatePasswordsAreEqual('1234', '1234')).toBeUndefined();
});

test('returns error when strings are different', () => {
	expect(InputValidation.validatePasswordsAreEqual('value', 'VALUE').message).toBe('Passwords don\'t match');
	expect(InputValidation.validatePasswordsAreEqual('value', 'value ').message).toBe('Passwords don\'t match');
	expect(InputValidation.validatePasswordsAreEqual('1234', '12345').message).toBe('Passwords don\'t match');
});