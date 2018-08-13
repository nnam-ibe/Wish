import React, { Component } from 'react';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { db } from '../../utils/firebaseUtil.js';
import _ from 'lodash';

class Sidebar extends Component {

	constructor(props) {
		super(props);

		this.state = {
			activeLists: null,
			listElements: null,
			activeItem: null
		};
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.uid === this.props.uid) return;

		this._getLists(this.props.uid);
	}

	itemClicked = page => () => {
		this.props.history.push(`/lists/${page}`);
		this._setListElements(this.state.activeLists, page);
	}

	render() {
		return (
			<Drawer variant='permanent' classes={{paper: 'side-bar'}}>
				<div>
					<List>
						{this.state.listElements}
					</List>
				</div>
			</Drawer>
		);
	}

	_getLists = (uid) => {
		if (!uid) {
			this.setState({ activeLists: null, listElements: null });
			return;
		}

		db.doc(`users/${uid}`).onSnapshot((snapShot) => {
			if (!snapShot.exists) return;

			let activeLists = snapShot.data().activeLists;
			let defaultList = snapShot.data().defaultList;

			this.setState({ activeLists });
			this._setListElements(activeLists, this._getActiveItem(defaultList));
		});
	}

	_setListElements = (activeLists, activeItem) => {
		let listElements = _.map(activeLists, (listName) => {
			let classes = { root: 'list-item' };
			if (listName === activeItem) classes.root += ' sb-active-item';

			return (
				<ListItem button key={listName} onClick={this.itemClicked(listName)}>
					<ListItemText primary={listName} classes={classes}/>
				</ListItem>
			);
		});

		this.setState({ listElements });
	}

	_getActiveItem = (defaultList) => {
		const item = this.state.activeItem ? this.state.activeItem : defaultList;
		this.setState({ activeItem: item });
		return item;
	}
}

export default Sidebar