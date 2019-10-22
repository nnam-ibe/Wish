const Big = require('big.js');
const NumberFormatter = require('../utils/NumberFormatter');

export default class ItemModel {
	constructor(options) {
		this.addTaxes = options.addTaxes;
		this.increment = NumberFormatter.getBig(options.increment);
		this.name = options.name;
		this.price = NumberFormatter.getBig(options.price);
		this.saved = NumberFormatter.getBig(options.saved);
		this.tax = options.tax;
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
		this.difference = this.getPriceWithTax().minus(this.saved);
		if (this.difference < 0) this.difference = new Big(0);
		this.progress = this.saved.div(this.getPriceWithTax()).times(100);
		if (this.progress > 100) this.progress = new Big(100);

		return this;
	}

	getPriceWithTax() {
		if (!this.addTaxes) return this.price;
		return this.price.times((1 + (this.tax/100))).round(2);
	}

	valueOf() {
		return {
			addTaxes: this.addTaxes,
			increment: NumberFormatter.getNumber(this.increment),
			name: this.name,
			price: NumberFormatter.getNumber(this.price),
			saved: NumberFormatter.getNumber(this.saved),
			tax: this.tax
		}
	}

	toString() {
		return Object.entries(this.valueOf()).toString();
	}
}