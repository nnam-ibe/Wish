const NumberFormatter = require('../NumberFormatter');

test('getBig handles NaN', () => {
	expect(NumberFormatter.getBig().toString()).toBe('0');
	expect(NumberFormatter.getBig(null).toString()).toBe('0');
	expect(NumberFormatter.getBig('03R23').toString()).toBe('0');
});

test('getBig returns right number', () => {
	expect(NumberFormatter.getBig(12372).toString()).toBe('12372');
	expect(NumberFormatter.getBig(-3423.454).toString()).toBe('-3423.454');
	expect(NumberFormatter.getBig('509').toString()).toBe('509');
	expect(NumberFormatter.getBig(0).toString()).toBe('0');
	expect(NumberFormatter.getBig(-0).toString()).toBe('0');
	expect(NumberFormatter.getBig('-0').toString()).toBe('0');
});

test('formatMoney', () => {
	expect(NumberFormatter.formatMoney('1432.35')).toBe('1,432.35');
	expect(NumberFormatter.formatMoney('98.35')).toBe('98.35');
	expect(NumberFormatter.formatMoney(2321432.35)).toBe('2,321,432.35');
	expect(NumberFormatter.formatMoney(43)).toBe('43');
});

test('getNumber', () => {
	expect(NumberFormatter.getNumber(43)).toBe(43);
	expect(NumberFormatter.getNumber('435.56')).toBe(435.56);
	expect(NumberFormatter.getNumber(-0)).toBe(0);
	expect(NumberFormatter.getNumber(0)).toBe(0);
});