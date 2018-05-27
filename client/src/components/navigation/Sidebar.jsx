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
			uid: this.props.uid
		};
	}

	componentDidMount() {
		if (!this.state.uid) return;
		this._getLists(this.state.uid);
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.uid === this.props.uid) return;

		this._getLists(this.props.uid);
		this.setState({ uid: this.props.uid });
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
		db.doc(`users/${uid}`).onSnapshot((snapShot) => {
			if (!snapShot.exists) return;

			let activeLists = snapShot.data().activeLists;
			let listElements = _.map(activeLists, (listName) => {
				return (
					<ListItem button key={listName}>
						<ListItemText primary={listName} classes={{root: 'list-item'}}/>
					</ListItem>
				);
			});

			this.setState({ activeLists, listElements });
		});
	}
}

export default Sidebar