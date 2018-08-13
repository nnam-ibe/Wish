import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import Item from './Item.jsx';
import NumberFormat from 'react-number-format';
import { db } from '../../utils/firebaseUtil.js';
import _ from 'lodash';


const newItemDefault = {
	name: '',
	price: '',
	saved: '',
	increment: '200',
	addTaxes: false
};

class ListPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			list: null,
			listItems: null,
			newItem: newItemDefault,
			showNewItemForm: false
		};
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
				This is indeed a page of lists.<br/>
				From your {this.props.match.params.page} list.
				<div>
					{this.state.listItems}
				</div>
				{this.state.showNewItemForm && (
					<div className='list-new-item'>
						<Paper className='list-new-item-paper'>
							<div className='list-new-item-paper-title display-flex'>
								<div className='list-item-title-text'>
									<Typography color='inherit'>Add New Item</Typography>
								</div>
								<CloseIcon onClick={this.toggleNewItemForm}/>
							</div>
							<Divider />
							<div className='list-new-item-paper-body'>
								<TextField
									id='new-item-name'
									label='Name'
									value={this.state.newItem.name}
									onChange={this.handleChange('name')}
									margin='dense'
									autoFocus={true}
									fullWidth
								/>
								<div>
									<TextField
										id='new-item-price'
										label='Price'
										value={this.state.newItem.price}
										onChange={this.handleChange('price')}
										margin='dense'
										InputProps={{ inputComponent: CurrencyFormat }}
										className='new-item-price'
									/>
									<TextField
										id='new-item-saved'
										label='Already Saved'
										value={this.state.newItem.saved}
										onChange={this.handleChange('saved')}
										margin='dense'
										InputProps={{ inputComponent: CurrencyFormat }}
										className='new-item-saved'
									/>
								</div>
								<div className='new-item-third-row'>
									<TextField
										id='new-item-increment'
										label='Increment Amount'
										value={this.state.newItem.increment}
										onChange={this.handleChange('increment')}
										margin='dense'
										InputProps={{ inputComponent: CurrencyFormat }}
										className='new-item-increment'
									/>
									<div className='display-inline new-item-add-taxes'>
										<label htmlFor='new-item-add-taxes-switch'>Add Taxes</label>
										<Switch
											id='new-item-add-taxes-switch'
											checked={this.state.newItem.addTaxes}
											onChange={this.handleChange('addTaxes')}
											value='addTaxes'
										/>
									</div>
								</div>
								<div className='new-item-fourth-row'>
									<Button color='primary' variant='raised'>Add Item</Button>
								</div>
							</div>
						</Paper>
					</div>
				)}
				<div>
					<Button variant='fab' color='primary' className='list-fab' onClick={this.toggleNewItemForm}>
						<AddIcon />
					</Button>
				</div>
			</div>
		)
	}

	handleChange = name => event => {
		let newItem = this.state.newItem;

		if (name === 'addTaxes') {
			newItem[name] = event.target.checked;
		} else {
			newItem[name] = event.target.value;
		}

		this.setState({
			newItem: newItem
		})
	}

	toggleNewItemForm = () => {
		this.setState({
			showNewItemForm: !this.state.showNewItemForm
		})
	}

	_getList = (uid) => {
		if (!uid) {
			this.setState({ list: null });
			return;
		}

		db.doc(`users/${uid}/active/${this.props.match.params.page}`).onSnapshot((snapShot) => {
			if (!snapShot.exists) {
				this.setState({ lists: null });
				this.setState({ listItems: null });
				return;
			}

			var list = snapShot.data().items;
			this.setState({ list });
			this._setListElements(list);
		});
	}

	_setListElements = (list) => {
		let listItems = _.map(list, (item) => {
			item.key = item.id;
			return (
				<Item {...item}/>
			);
		});

		this.setState({ listItems });
	}
}

	function CurrencyFormat (props) {
		const { inputRef, onChange, ...other } = props;

		return (
			<NumberFormat
				{...other}
				ref={inputRef}
				onValueChange={values => {
					onChange({
						target: { value: values.value }
					})
				}}
				thousandSeparator
				prefix='$'
			/>
		);
	}

export default ListPage;
