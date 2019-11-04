const Big = require('big.js');
const NumberFormatter = require('../utils/NumberFormatter');

class ItemModel {
	constructor(options) {
		this.addTaxes = options.addTaxes;
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
		this.difference = this.getPriceWithTaxAsBig().minus(this.saved);
		if (this.difference < 0) this.difference = new Big(0);
		this.progress = this.saved.div(this.getPriceWithTaxAsBig()).times(100);
		if (this.progress > 100) this.progress = new Big(100);

		return this;
	}

	getDifference() {
		return NumberFormatter.getNumber(this.difference);
	}

	getId() {
		return this.id;
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

	getSaved() {
		return NumberFormatter.getNumber(this.saved);
	}

	setId(id) {
		this.id = id;
		return this;
	}

	setIncrement(value) {
		this.increment = NumberFormatter.getBig(value);
		return this.updateProgress();
	}

	setSaved(value) {
		this.saved =  NumberFormatter.getBig(value);
		return this.updateProgress();
	}

	setTax(value) {
		const taxValue = NumberFormatter.getNumber(value);
		this.taxMultipler = 1 + (taxValue/100);
		this.tax
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
}

module.exports = ItemModel;