import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import firebaseUtil from '../../utils/firebaseUtil.js';

class Settings extends Component {

	constructor(props) {
		super(props);

		this.state = {
			fields: {
				addTaxes: true,
				defaultList: 'Main',
				tax: 13,
				username: ''
			}
		};
	}

	componentDidMount() {
		var uid = firebaseUtil.getLocalUID();
		console.log('This is your uid', uid);
		this._getUserSettings(uid);
	}

	render() {

		return (
			<div className='Settings'>
				Putting Settings Form Here
			</div>
		);
	}

	_getUserSettings = (uid) => {
		if (!uid) {
			this.props.history.push('/');
			return;
		}

		var path = `users/${uid}`;

		firebaseUtil.db.doc(path).onSnapshot((snapShot) => {
			if (!snapShot.exists) {
				return;
			}

			this.setState({
				addTaxes: snapShot.data().addTaxes,
				defaultList: snapShot.data().defaultList,
				tax: snapShot.data().tax,
				username: snapShot.data().username
			})
		});
	}
}

export default Settings;