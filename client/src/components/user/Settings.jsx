import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import AccountCircle from '@material-ui/icons/AccountCircle';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import firebaseUtil from '../../utils/firebaseUtil.js';

import FormControlLabel from '@material-ui/core/FormControlLabel';

class Settings extends Component {

	constructor(props) {
		super(props);

		this.state = {
			fields: {
				addTaxes: true,
				defaultList: 'Main',
				tax: 13,
				username: '',
				showProgressBar: true
			}
		};
	}

	componentDidMount() {
		var uid = firebaseUtil.getLocalUID();
		this._getUserSettings(uid);
	}

	// Correct class names
	// bind fields properly
	// Wats up with hitting enter?
	render() {
		let progessBar = ( <LinearProgress/> );
		let fields = this.state.fields;

		return (
			<div className='Settings'>
				<div className='auth-component'>
					<Paper>
						{ this.state.showProgressBar && progessBar }
						<div className='auth-paper'>
							<form>
								<Typography variant='title'>Account Settings</Typography>
								<TextField
									margin='dense'
									id='username'
									label='Username'
									value={fields.username}
									fullWidth
									required
								/>
								<TextField
									margin='dense'
									id='tax'
									label='Sales Tax'
									type='number'
									value={fields.tax}
									fullWidth
									required
								/>
								<TextField
									margin='dense'
									id='default-list'
									label='Default List'
									value={fields.defaultList}
									fullWidth
									required
								/>
								<FormControlLabel
									control={
										<Switch
											id='add-taxes'
											checked={fields.addTaxes}
											value='addTaxes'
										/>
									}
									label='Add Taxes'
								/>
								<Button
									fullWidth
									type='submit'
									color='inherit'
									onClick={this.createAccount}>
									Create Account
								</Button>
							</form>
						</div>
					</Paper>
				</div>
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

			var fields = {
				addTaxes: snapShot.data().addTaxes,
				defaultList: snapShot.data().defaultList,
				tax: snapShot.data().tax,
				username: snapShot.data().username,
				showProgressBar: false
			};

			this.setState({ fields });
		});
	}
}

export default Settings;