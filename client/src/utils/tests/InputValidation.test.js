const InputValidation = require('../InputValidation');

test('returns error when list name is falsy', () => {
	expect(InputValidation.validateListName()).toBeDefined();
	expect(InputValidation.validateListName('')).toBeDefined();
	expect(InputValidation.validateListName(null)).toBeDefined();
});

test('returns error when list name is has >36 chars', () => {
	const st = 'ABCDEFGHIJKLMNOPQRSTUVWZYZ1234567890_OVERFLOW';
	expect(InputValidation.validateListName(st)).toBeDefined();
});

test('no error with valid list name', () => {
	expect(InputValidation.validateListName('A')).toBeUndefined();
	expect(InputValidation.validateListName('ABCDEFGHIJKLMNOPQRSTUVWZYZ1234567890')).toBeUndefined();
});

test('returns error when username is falsy', () => {
	expect(InputValidation.validateUsername()).toBeDefined();
	expect(InputValidation.validateUsername('')).toBeDefined();
	expect(InputValidation.validateUsername(null)).toBeDefined();
});

test('returns error when username is >16 chars', () => {
	expect(InputValidation.validateUsername('MickJagger0123456')).toBeDefined();
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