import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import _ from 'lodash';
import ListNamePopover from '../lists/ListNamePopover';

class Sidebar extends Component {

	constructor(props) {
		super(props);

		this.state = {
			listElements: null,
			activeItem: null,
			listNamePopoverAnchorEl: null,
			editMode: this.props.location.pathname === '/settings'
		};
	}

	componentDidUpdate(prevProps, prevState) {
		const newEditMode = this.props.location.pathname === '/settings';
		const editModeSame = newEditMode === this.state.editMode;
		if (!editModeSame) {
			this.setState({ editMode: newEditMode });
		}
	}

	render() {
		return (
			<Drawer variant='permanent' classes={{paper: 'side-bar'}}>
				<ListNamePopover
					anchorEl={this.state.listNamePopoverAnchorEl}
					popoverClose={() => this.setState({ listNamePopoverAnchorEl: null })}
					uid={this.props.uid}
				/>
				<div>
					<Button color='primary' variant='outlined' onClick={this.newListClick}>
						New List
					</Button>
				</div>
				<div>
					<List>
						{ this._setListElements() }
					</List>
				</div>
			</Drawer>
		);
	}

	itemClicked = page => () => {
		this.props.history.push(`/lists/${page}`);
	}

	newListClick = (event) => {
		this.setState({ listNamePopoverAnchorEl: event.currentTarget });
	}

	_setListElements = () => {
		const listpath = '/lists/';
		let activeItem = '';
		if (this.props.location.pathname.indexOf(listpath) === 0) {
			activeItem = this.props.location.pathname.slice(listpath.length);
		}

		return _.map(this.props.userPrefs.activeLists, (listName) => {
			let classes = { root: 'list-item' };
			if (listName === activeItem) classes.root += ' sb-active-item';

			return (
				<ListItem button key={listName} onClick={this.itemClicked(listName)}>
					<ListItemText primary={listName} classes={classes}/>
					{ this.state.editMode && (
						<IconButton>
							<MoreVertIcon />
						</IconButton>
					)}
				</ListItem>
			);
		});
	}
}

export default Sidebar