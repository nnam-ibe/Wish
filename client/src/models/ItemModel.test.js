import ItemModel from './ItemModel';

const val = {
	addTaxes: false,
	increment: 50,
	name: 'Item Name',
	price: 100,
	saved: 50,
	tax: 15,
};

it('increments & decrements saved correctly', () => {
	const item = new ItemModel(val);
	item.incrementSaved();
	expect(item.getSaved()).toBe(100);
	item.decrementSaved();
	expect(item.getSaved()).toBe(50);
});

it('correctly calculates difference', () => {
	const item = new ItemModel(val);
	expect(item.getDifference()).toBe(50);
	item.setSaved(20);
	expect(item.getDifference()).toBe(80);
});

it('correctly calculates taxes', () => {
	const item = new ItemModel({ ...val, addTaxes: true });
	expect(item.getPriceWithTax()).toBe(115);
	expect(item.getPricePreTax()).toBe(100);
	item.setTax(30);
	expect(item.getPriceWithTax()).toBe(130);
	expect(item.getPricePreTax()).toBe(100);
});

it('returns correct valueOf', () => {
	const item1 = new ItemModel(val);
	const res = item1.valueOf();
	expect(res.addTaxes).toBe(val.addTaxes);
	expect(res.increment).toBe(val.increment);
	expect(res.name).toBe(val.name);
	expect(res.price).toBe(val.price);
	expect(res.saved).toBe(val.saved);
	expect(res.tax).toBe(val.tax);
});
