import React, { Component } from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import _ from 'lodash';

import Item from './Item.jsx';
import FirebaseWrapper from '../../utils/FirebaseWrapper.js';
import ListItemForm from './ListItemForm.jsx';
import ItemModel from '../../models/ItemModel.js';
import FormFieldDefaults from '../../utils/FormFieldDefaults.js';

class ListPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			list: null,
			listItems: null,

			// Input Form State
			formItem: this._getFormItemDefault(),
			formItemModel: new ItemModel({
				addTaxes: props.userPrefs.addTaxes,
				increment: props.userPrefs.defaultIncrement
			}),
			itemFormIsOpen: false,
			isNewFormItem: true,
			formItemId: null
		};
	}

	componentDidMount() {
		this._getList(this.props.uid);
	}

	componentDidUpdate(prevProps, prevState) {
		let samePage = prevProps.match.params.page === this.props.match.params.page;
		let sameProps = this.props.uid === prevProps.uid
		if (samePage && sameProps) return;

		this._getList(this.props.uid);
	}

	componentWillUnmount() {
		this.onSnapshotUnsubscribe && this.onSnapshotUnsubscribe();
	}

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
						getPagePath={this._getPagePath}
						item={this.state.formItemModel}
						fields={this.state.formItem}
						resetItem={this.resetFormItem}
						isNewItem={this.state.isNewFormItem}
						itemId={this.state.formItemId}
					/>
				</div>
				<div>
					<Fab color='primary' className='list-fab' onClick={this.openItemForm}>
						<AddIcon />
					</Fab>
				</div>
			</div>
		)
	}

	openItemForm = () => {
		if (this.state.itemFormIsOpen) return;

		this.setState({
			itemFormIsOpen: true
		})
	}

	closeItemForm = () => {
		if (!this.state.isNewFormItem) this.resetFormItem();

		this.setState({
			itemFormIsOpen: false
		})
	}

	resetFormItem = () => {
		this.setState({
			formItem: this._getFormItemDefault(),
			isNewFormItem: true,
			formItemId: null
		});
	}

	_updateItem = (item) => {
		FirebaseWrapper.updateItem(this._getPagePath(), item);
	}

	_editItem = (id) => {
		let item = _.find(this.state.list, { id: id });
		if (!item) return null;

		let itemToEdit = this._getFormItemDefault();
		let values = ['addTaxes', 'increment', 'name', 'price', 'saved'];

		_.forEach(values, (key) => {
			if (key === 'addTaxes') {
				itemToEdit[key].checked = item[key];
				return;
			}

			itemToEdit[key].value = item[key];
		});

		this.setState({
			itemFormIsOpen: true,
			formItem: itemToEdit,
			isNewFormItem: false,
			formItemId: id
		});
	}

	_getList = (uid) => {
		if (!uid) {
			this.setState({ list: null, listItems: null });
			return;
		}

		this.onSnapshotUnsubscribe = FirebaseWrapper.db.doc(this._getPagePath()).onSnapshot((snapShot) => {
			if (!snapShot.exists) {
				this.setState({ list: null, listItems: null });
				return;
			}

			let list = snapShot.data().items;
			this._setListElements(list);
		});
	}

	_getPagePath = () => {
		return `users/${this.props.uid}/active/${this.props.match.params.page}`;
	}

	_setListElements = (list) => {
		const listItems = _.map(list, (item) => {
			const itemModel = new ItemModel({...item, tax: this.props.userPrefs.tax});
			return ( <Item itemModel={itemModel} key={item.id} updateItem={this._updateItem} editItem={this._editItem} id={item.id}/> );
		});

		this.setState({ list, listItems });
	}

	_getFormItemDefault = () => {
		const formDefaults = {
			nameField: FormFieldDefaults.nameDefault,
			priceField: FormFieldDefaults.priceDefault,
			savedField: FormFieldDefaults.savedDefault,
			incrementField: FormFieldDefaults.incrementDefault,
			addTaxesField: FormFieldDefaults.addTaxesDefault
		};
		_.set(formDefaults, 'addTaxesField.checked', this.props.userPrefs.addTaxes);
		return _.set(formDefaults, 'incrementField.value', this.props.userPrefs.defaultIncrement);
	}

	getDefaultFormItemModel = () => {
		return new ItemModel({
			addTaxes: this.props.userPrefs.addTaxes,
			increment: this.props.userPrefs.defaultIncrement
		});
	}
}

export default ListPage;