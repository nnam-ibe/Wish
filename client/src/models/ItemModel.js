const Big = require('big.js');
const NumberFormatter = require('../utils/NumberFormatter');

class ItemModel {
	constructor(options) {
		this.addTaxes = Boolean(options.addTaxes);
		this.increment = NumberFormatter.getBig(options.increment);
		this.name = options.name;
		this.price = NumberFormatter.getBig(options.price);
		this.saved = NumberFormatter.getBig(options.saved);
		this.tax = options.tax;
		this.id = options.id;

		const taxValue = options.tax ? options.tax : 0;
		this.taxMultipler = 1 + (taxValue/100);
		return this.updateProgress();
	}

	incrementSaved() {
		this.saved = this.saved.plus(this.increment).round(2);
		return this.updateProgress();
	}

	decrementSaved() {
		this.saved = this.saved.minus(this.increment).round(2);
		if (this.saved < 0) this.saved = new Big(0);
		return this.updateProgress();
	}

	updateProgress() {
		const totalPrice = this.getPriceWithTaxAsBig();
		this.difference = totalPrice.minus(this.saved);
		if (this.difference < 0) this.difference = new Big(0);
		if (totalPrice > 0) {
			this.progress = this.saved.div(totalPrice).times(100);
		} else {
			this.progress = new Big(100);
		}
		if (this.progress > 100) this.progress = new Big(100);

		return this;
	}

	getAddTaxes() {
		return this.addTaxes;
	}

	setAddTaxes(val) {
		this.addTaxes = Boolean(val);
		return this.updateProgress();
	}

	getDifference() {
		return NumberFormatter.getNumber(this.difference);
	}

	getId() {
		return this.id;
	}

	setId(id) {
		this.id = id;
		return this;
	}

	getIncrement() {
		return NumberFormatter.getNumber(this.increment);
	}

	setIncrement(val) {
		this.increment = NumberFormatter.getBig(val);
		return this.updateProgress();
	}

	getName() {
		return this.name;
	}

	setName(val) {
		this.name = val;
		return this;
	}

	getPrice() {
		return NumberFormatter.getNumber(this.price);
	}

	getPriceWithTax() {
		return NumberFormatter.getNumber(this.getPriceWithTaxAsBig());
	}

	getPriceWithTaxAsBig() {
		if (!this.addTaxes) return this.price;
		return this.price.times(this.taxMultipler).round(2);
	}

	setPrice(val) {
		this.price = NumberFormatter.getBig(val);
		return this.updateProgress();
	}

	getSaved() {
		return NumberFormatter.getNumber(this.saved);
	}

	setSaved(val) {
		this.saved =  NumberFormatter.getBig(val);
		return this.updateProgress();
	}

	setTax(val) {
		const taxValue = NumberFormatter.getNumber(val);
		this.tax = taxValue;
		this.taxMultipler = 1 + (taxValue/100);
		return this.updateProgress();
	}

	valueOf() {
		return {
			addTaxes: this.addTaxes,
			increment: NumberFormatter.getNumber(this.increment),
			name: this.name,
			price: NumberFormatter.getNumber(this.price),
			saved: NumberFormatter.getNumber(this.saved),
			tax: this.tax,
			id: this.id
		}
	}

	toString() {
		return Object.entries(this.valueOf()).toString();
	}

	// creates a new object to defeat Object.is comparison
	// TODO: needs tests
	newRef() {
		return new ItemModel(this.valueOf());
	}
}

module.exports = ItemModel;