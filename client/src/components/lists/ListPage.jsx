import React, { Component } from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import _ from 'lodash';

import Item from './Item';
import ListItemForm from './ListItemForm';
import FirebaseWrapper from '../../utils/FirebaseWrapper';
import ItemModel from '../../models/ItemModel';
import * as FormFieldDefaults from '../../utils/FormFieldDefaults';

class ListPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			list: null,
			listItems: null,

			// Input Form State
			formItem: this.getFormItemDefault(),
			formItemModel: this.getDefaultFormItemModel(),
			itemFormIsOpen: false,
			isNewFormItem: true,
		};
	}

	componentDidMount() {
		this.getList(this.props.uid);
	}

	componentDidUpdate(prevProps) {
		const samePage = prevProps.match.params.page === this.props.match.params.page;
		const sameProps = this.props.uid === prevProps.uid;
		if (samePage && sameProps) return;

		this.getList(this.props.uid);
	}

	componentWillUnmount() {
		if (this.onSnapshotUnsubscribe) this.onSnapshotUnsubscribe();
	}

	// eslint-disable-next-line react/sort-comp
	render() {
		return (
			<div>
				<div>
					{this.state.listItems}
				</div>
				<div>
					<ListItemForm
						isOpen={this.state.itemFormIsOpen}
						closeForm={this.closeItemForm}
						getPagePath={this.getPagePath}
						item={this.state.formItemModel}
						fields={this.state.formItem}
						resetItemModel={this.resetFormItemModel}
						isNewItem={this.state.isNewFormItem}
					/>
				</div>
				<div>
					<Fab color="primary" className="list-fab" onClick={this.openItemForm}>
						<AddIcon />
					</Fab>
				</div>
			</div>
		);
	}

	openItemForm = () => {
		if (this.state.itemFormIsOpen) return;

		this.setState({
			itemFormIsOpen: true,
		});
	}

	closeItemForm = () => {
		if (!this.state.isNewFormItem) this.resetFormItemModel();

		this.setState({
			itemFormIsOpen: false,
		});
	}

	resetFormItemModel = () => {
		this.setState({
			formItem: this.getFormItemDefault(),
			formItemModel: this.getDefaultFormItemModel(),
			isNewFormItem: true,
		});
	}

	updateItem = (item) => {
		FirebaseWrapper.updateItem(this.getPagePath(), item);
	}

	editItem = (id) => {
		const item = _.find(this.state.list, { id });
		if (!item) return null;

		const itemToEdit = this.getFormItemDefault();
		const model = new ItemModel({
			...item,
			tax: this.props.userPrefs.tax,
		});
		return this.setState({
			formItemModel: model,
			itemFormIsOpen: true,
			formItem: itemToEdit,
			isNewFormItem: false,
		});
	}

	getList = (uid) => {
		if (!uid) {
			this.setState({ list: null, listItems: null });
			return;
		}

		this.onSnapshotUnsubscribe = FirebaseWrapper.db.doc(this.getPagePath())
			.onSnapshot((snapShot) => {
				if (!snapShot.exists) {
					this.setState({ list: null, listItems: null });
					return;
				}

				const list = snapShot.data().items;
				this.setListElements(list);
			});
	}

	getPagePath = () => `users/${this.props.uid}/active/${this.props.match.params.page}`

	setListElements = (list) => {
		const listItems = _.map(list, (item) => {
			const itemModel = new ItemModel({ ...item, tax: this.props.userPrefs.tax });
			return (
				<Item
					itemModel={itemModel}
					key={item.id}
					updateItem={this.updateItem}
					editItem={this.editItem}
				/>
			);
		});

		this.setState({ list, listItems });
	}

	getFormItemDefault = () => {
		const formDefaults = {
			nameField: FormFieldDefaults.nameDefault,
			priceField: FormFieldDefaults.priceDefault,
			savedField: FormFieldDefaults.savedDefault,
			incrementField: FormFieldDefaults.incrementDefault,
			addTaxesField: FormFieldDefaults.addTaxesDefault,
		};
		_.set(formDefaults, 'addTaxesField.checked', this.props.userPrefs.addTaxes);
		return _.set(formDefaults, 'incrementField.value', this.props.userPrefs.defaultIncrement);
	}

	getDefaultFormItemModel = () => new ItemModel({
		tax: this.props.userPrefs.tax,
		addTaxes: this.props.userPrefs.addTaxes,
		increment: this.props.userPrefs.defaultIncrement,
	})
}

export default ListPage;
