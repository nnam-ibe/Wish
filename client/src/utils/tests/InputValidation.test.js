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
	expect(InputValidation.validateEmail(' ')).toBeDefined();
	expect(InputValidation.validateEmail(null)).toBeDefined();
	expect(InputValidation.validateEmail()).toBeDefined();
});

test('returns error when password is <6 chars', () => {
	expect(InputValidation.validatePassword(' ')).toBeDefined();
	expect(InputValidation.validatePassword('12345')).toBeDefined();
	expect(InputValidation.validatePassword(null)).toBeDefined();
	expect(InputValidation.validatePassword()).toBeDefined();
});

test('no error when password is >=6 chars', () => {
	expect(InputValidation.validatePassword('123456')).toBeUndefined();
	expect(InputValidation.validatePassword(' 12345')).toBeUndefined();
});

test('returns error when tax amount isNaN', () => {
	expect(InputValidation.validateTax('A12')).toBeDefined();
	expect(InputValidation.validateTax('12%')).toBeDefined();
	expect(InputValidation.validateTax('')).toBeDefined();
	expect(InputValidation.validateTax(null)).toBeDefined();
	expect(InputValidation.validateTax()).toBeDefined();
});

test('returns error when tax amount is <0 || >100', () => {
	expect(InputValidation.validateTax(-1)).toBeDefined();
	expect(InputValidation.validateTax(101)).toBeDefined();
});

test('no error when tax is valid', () => {
	expect(InputValidation.validateTax(0)).toBeUndefined();
	expect(InputValidation.validateTax(50)).toBeUndefined();
	expect(InputValidation.validateTax(100)).toBeUndefined();
	expect(InputValidation.validateTax(' 100 ')).toBeUndefined();
});

test('no error when strings are equal', () => {
	expect(InputValidation.validatePasswordsAreEqual('value', 'value')).toBeUndefined();
});

test('returns error when strings are different', () => {
	expect(InputValidation.validatePasswordsAreEqual('value', 'VALUE')).toBeDefined();
	expect(InputValidation.validatePasswordsAreEqual('value', 'value ')).toBeDefined();
});