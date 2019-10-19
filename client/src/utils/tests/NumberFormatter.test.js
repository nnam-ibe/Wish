const NumberFormatter = require('../NumberFormatter');

test('rounds to two decimal places', () => {
	expect(NumberFormatter.toFixedTwo(1398.56459)).toBe(1398.56);
});

test('corrertly rounds', () => {
	expect(NumberFormatter.toFixedTwo(1398.44499)).toBe(1398.44);
	expect(NumberFormatter.toFixedTwo(1398.9994)).toBe(1399);
	expect(NumberFormatter.toFixedTwo(1398.0199)).toBe(1398.02);
});

test('truncates zeros', () => {
	expect(NumberFormatter.toFixedTwo(1398.0000)).toBe(1398);
	expect(NumberFormatter.toFixedTwo(1398.00001)).toBe(1398);
});

test('converts string to integer', () => {
	expect(NumberFormatter.toFixedTwo('1398.0000')).toBe(1398);
	expect(typeof NumberFormatter.toFixedTwo('1398.0000')).toBe('number');
});

test('returns 0 when for non numbers', () => {
	expect(NumberFormatter.toFixedTwo(NaN)).toBe(0);
	expect(NumberFormatter.toFixedTwo('Number')).toBe(0);
	expect(NumberFormatter.toFixedTwo('Number350')).toBe(0);
	expect(NumberFormatter.toFixedTwo('350Number350')).toBe(0);
});

test('taxes correctly', () => {
	expect(NumberFormatter.calculateTax(100, 13)).toBe(113);
	expect(NumberFormatter.calculateTax(75.89, 15)).toBe(87.27);
});

test('returns amount unchanged when taxRate < 0%', () => {
	expect(NumberFormatter.calculateTax(20, -200)).toBe(20);
	expect(NumberFormatter.calculateTax(20, -0.02)).toBe(20);
});

test('returns 0 when amount less than 0', () => {
	expect(NumberFormatter.calculateTax(-2.34, 13)).toBe(0);
	expect(NumberFormatter.calculateTax(-0.04, 13)).toBe(0);
});