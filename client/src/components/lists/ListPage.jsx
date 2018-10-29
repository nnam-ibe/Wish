import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Item from './Item.jsx';
import FirebaseUtil from '../../utils/firebaseUtil.js';
import ListItemForm from './ListItemForm.jsx';
import _ from 'lodash';

class ListPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			list: null,
			listItems: null,

			// Input Form State
			formItem: this._getFormItemDefault(),
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
						item={this.state.formItem}
						handleChange={this.handleFormItemChange}
						resetItem={this.resetFormItem}
						isNewItem={this.state.isNewFormItem}
						itemId={this.state.formItemId}
					/>
				</div>
				<div>
					<Button variant='fab' color='primary' className='list-fab' onClick={this.openItemForm}>
						<AddIcon />
					</Button>
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

	handleFormItemChange = name => event => {
		let item = this.state.formItem;

		if (name === 'addTaxes') {
			item[name].checked = event.target.checked;
		} else {
			item[name].value = event.target.value;
		}

		this.setState({ formItem: item });
	}

	resetFormItem = () => {
		this.setState({
			formItem:  this._getFormItemDefault(),
			isNewFormItem: true,
			formItemId: null
		});
	}

	_updateItem = (item) => {
		FirebaseUtil.updateItem(this._getPagePath(), item);
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

		FirebaseUtil.db.doc(this._getPagePath()).onSnapshot((snapShot) => {
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
		let listItems = _.map(list, (item) => {
			return ( <Item {...item} key={item.id} updateItem={this._updateItem} editItem={this._editItem} tax={this.props.userPrefs.tax}/> );
		});

		this.setState({ list, listItems });
	}

	_getFormItemDefault = () => _.cloneDeep(formItemDefaults)
}

export default ListPage;

const formItemDefaults = {
	name: {
		error: false,
		helperText: '',
		label: 'Name',
		value: ''
	},
	price: {
		error: false,
		helperText: '',
		label: 'Price',
		value: ''
	},
	saved: {
		error: false,
		helperText: '',
		label: 'Saved',
		value: ''
	},
	increment: {
		error: false,
		helperText: '',
		label: 'Increment',
		value: '200'
	},
	addTaxes: {
		checked: false,
		label: 'Add Taxes',
		value: 'addTaxes'
	}
};