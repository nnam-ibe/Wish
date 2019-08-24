import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import _ from 'lodash';

class Sidebar extends Component {

	constructor(props) {
		super(props);

		this.state = {
			listElements: null,
			activeItem: null
		};
	}

	componentDidMount() {
		let defaultList = this.props.userPrefs.defaultList;
		this._setListElements(this.props.userPrefs.activeLists, this._getActiveItem(defaultList));
	}

	componentDidUpdate(prevProps, prevState) {
		let isEqual = _.isEqual(prevProps.userPrefs.activeLists, this.props.userPrefs.activeLists);
		if (isEqual) return;

		let defaultList = this.props.userPrefs.defaultList;
		this._setListElements(this.props.userPrefs.activeLists, this._getActiveItem(defaultList));
	}

	itemClicked = page => () => {
		this.props.history.push(`/lists/${page}`);
		this.props.updateCurrentList(page);
		this._setListElements(this.props.userPrefs.activeLists, page);
	}

	render() {
		return (
			<Drawer variant='permanent' classes={{paper: 'side-bar'}}>
				<div>
					<Button color='primary' variant='outlined'>New List</Button>
				</div>
				<div>
					<List>
						{this.state.listElements}
					</List>
				</div>
			</Drawer>
		);
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