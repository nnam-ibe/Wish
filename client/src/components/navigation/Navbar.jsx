import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import firebaseUtil from '../../utils/firebaseUtil.js';

class Navbar extends Component {

	constructor(props) {
		super(props);
		var buttonLabel = 'Login';

		if (firebaseUtil.getCurrentUser()) buttonLabel = 'Logout';

		this.state = {
			buttonLabel: buttonLabel
		};
	}

	componentDidMount() {
		firebaseUtil.onAuthStateChanged((user) => {
			if (user) {
				this.setState({ buttonLabel: 'Logout' });
			} else {
				this.setState({ buttonLabel: 'Login' });
			}
		})
	}

	onClickLogin = () => {
		if (firebaseUtil.getCurrentUser()) {
			firebaseUtil.logout().then(() => {
				this.setState({ buttonLabel: 'Login' });
				this.props.history.push('/login');
			});
		} else if (this.props.location.pathname !== '/login') {
			this.props.history.push('/login');
		}
	}

	render() {
		let buttonLabel = this.state.buttonLabel;

		return (
			<div className='Navbar'>
				<AppBar position='fixed' color='default'>
					<Toolbar>
						<Typography variant='title' color='inherit'>
							<a href='/' className='no-a-style'>Title</a>
						</Typography>
						<Button color='inherit' className='pull-right' onClick={this.onClickLogin}>{buttonLabel}</Button>
					</Toolbar>
				</AppBar>
			</div>
		);
	}
}

export default Navbar;