import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import _ from 'lodash';
import ConfirmModal from '../modals/ConfirmModal';
import ListNamePopover from '../lists/ListNamePopover';

/**
Props
	uid: user id
	userPrefs:
		activeLists: List of items to appear in the sidebar
	location
		pathname: base name of the current location path
*/

class Sidebar extends Component {

	constructor(props) {
		super(props);

		this.state = {
			listElements: null,
			activeItem: null,
			listNamePopoverAnchorEl: null,
			listNamePopoverValue: '',
			editMode: this.props.location.pathname === '/settings',
			confirmModalOpen: false,
			confirmModalMessage: ''
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
					intialName={this.state.listNamePopoverValue}
					uid={this.props.uid}
				/>
				<div>
					<Button className='btn-new-list' color='primary' variant='outlined' onClick={this.listnamePopoverClick('')}>
						New List
					</Button>
				</div>
				<div>
					<List>
						{ this.getSidebarList() }
					</List>
				</div>
			</Drawer>
		);
	}

	getSidebarList = () => {
		const listpath = '/lists/';
		let activeItem = '';
		if (this.props.location.pathname.indexOf(listpath) === 0) {
			activeItem = this.props.location.pathname.slice(listpath.length);
		}

		return _.map(this.props.userPrefs.activeLists, (listName) => {
			let classes = { root: 'list-item sidebar-list-item-div' };
			if (listName === activeItem) classes.root += ' sb-active-item';

			return (
				<ListItem button key={listName} classes={{ root: 'sidebar-list-item' }}>
					<ListItemText primary={listName} classes={classes} onClick={this.itemClicked(listName)}/>
					{ this.state.editMode && (
						<div>
							<IconButton onClick={this.deleteList(listName)}>
								<DeleteIcon />
							</IconButton>
							<ConfirmModal
								buttonLabels={{
									confirm: { text: 'Delete', color: 'secondary' },
									decline: { text: 'Cancel', color: 'primary' }
								}}
								buttonVariant='contained'
								open={this.state.confirmModalOpen}
								message={this.state.confirmModalMessage}
								handleClose={this.state.confirmModalCallback}
							/>
						</div>
					)}
				</ListItem>
			);
		});
	}

	itemClicked = page => () => {
		this.props.history.push(`/lists/${page}`);
	}

	listnamePopoverClick = (name, override) => (event) => {
		this.setState({
			listNamePopoverAnchorEl: event.currentTarget,
			listNamePopoverValue: name
		});
	}

	deleteList = name => () => {
		this.setState({
			confirmModalOpen: true,
			confirmModalMessage: `Delete ${name}?`,
			confirmModalCallback: deleteConfirmed => async event => {
				if (deleteConfirmed) {
					await fetch(`/api/delete/list/${name}/${this.props.uid}`, {
						method: 'delete'
					});
				}
				this.setState({ confirmModalOpen: false, confirmModalCallback: null });
			}
		});
	}
}

export default Sidebar