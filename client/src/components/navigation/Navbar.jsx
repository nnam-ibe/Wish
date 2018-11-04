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

class Navbar extends Component {

	constructor(props) {
		super(props);
		let buttonLabel = 'Login';

		if (firebaseUtil.getCurrentUser()) buttonLabel = 'Logout';

		this.state = {
			buttonLabel: buttonLabel,
			isLoggedIn: false,
			userMenuAnchor: null,
			userMenuOpen: false
		};
	}

	componentDidMount() {
		firebaseUtil.onAuthStateChanged((user) => {
			if (user) {
				this.setLoggedInState();
			} else {
				this.setLoggedOutState();
			}
		});
	}

	onClickLogin = () => {
		if (this.state.isLoggedIn) {
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
						<div className='display-flex width-100'>
							<Typography variant='h6' color='inherit' className='flex-grow-1 text-align-left'>
								<a href='/' className='no-a-style'>Title</a>
							</Typography>
							<div>
								{
									this.state.isLoggedIn && (
										<IconButton onClick={this._openUserMenu}>
											<AccountCircle />
											<UserMenu
												anchorEl={this.state.userMenuAnchor}
												open={this.state.userMenuOpen}
												onClose={this._closeUserMenu}
											/>
										</IconButton>
									)
								}
								<Button color='inherit' className='display-flex' onClick={this.onClickLogin}>{buttonLabel}</Button>
							</div>
						</div>
					</Toolbar>
				</AppBar>
			</div>
		);
	}

	setLoggedInState = () => this.setState({ buttonLabel: 'Logout', isLoggedIn: true });

	setLoggedOutState = () => this.setState({ buttonLabel: 'Login', isLoggedIn: false });

	_openUserMenu = (event) => {
		this.setState({
			userMenuAnchor: event.currentTarget,
			userMenuOpen: true
		})
	}

	// State is not being set here for some reason
	_closeUserMenu = () => {
		this.setState({
			userMenuAnchor: null,
			userMenuOpen: false
		});
	}
}

export default Navbar;

function UserMenu (props) {
	return (
		<Menu
			id="menu-appbar"
			anchorEl={props.anchorEl}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			open={props.open}
			onClose={props.onClose}
		>
			<MenuItem onClick={props.onClose}>Profile</MenuItem>
			<MenuItem onClick={props.onClose}>My account</MenuItem>
		</Menu>

	);
}