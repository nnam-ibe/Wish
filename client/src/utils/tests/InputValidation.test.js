const InputValidation = require('../../utils/InputValidation');

test('throws error when name is falsy', () => {
	expect(() => {
		InputValidation.validateListName();
	}).toThrow();
	expect(() => {
		InputValidation.validateListName('');
	}).toThrow();
	expect(() => {
		InputValidation.validateListName(null);
	}).toThrow();
});

test('throws error when name is has >36 chars', () => {
	const st = 'ABCDEFGHIJKLMNOPQRSTUVWZYZ1234567890_OVERFLOW';
	expect(() => {
		InputValidation.validateListName(st);
	}).toThrow();
});

test('no error with valid string', () => {
	expect(InputValidation.validateListName('A')).toBeUndefined();
	expect(InputValidation.validateListName('ABCDEFGHIJKLMNOPQRSTUVWZYZ1234567890')).toBeUndefined();
});