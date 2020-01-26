import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';


/**
Props
	handleLoginClick(): handler for login/logout
	title: title of the page
	isLoggedIn: boolean log in value
	nav(route): navigate to route
* */
function Navbar(props) {
	const [anchorEl, setAnchorEl] = useState(null);
	const buttonLabel = props.isLoggedIn ? 'Logout' : 'Login';

	function handleClick(event) {
		setAnchorEl(event.currentTarget);
	}

	function handleClose() {
		setAnchorEl(null);
	}

	function handleSettingsClick() {
		handleClose();
		props.nav('/settings');
	}

	return (
		<div className="Navbar">
			<AppBar position="fixed" color="default">
				<Toolbar>
					<div className="display-flex width-100">
						<Typography variant="h6" color="inherit" className="flex-grow-1 text-align-left">
							<a href="/" className="no-a-style page-title">{props.title}</a>
						</Typography>
						<div>
							{
	props.isLoggedIn && (
	<div className="display-inline">
		<IconButton onClick={handleClick} role="dialog">
			<AccountCircle />
		</IconButton>
		<Menu
			id="menu-appbar"
			anchorEl={anchorEl}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			open={Boolean(anchorEl)}
			onClose={handleClose}
		>
			<MenuItem className="setting-item" onClick={handleSettingsClick}>Settings</MenuItem>
			<MenuItem onClick={handleClose}>My account</MenuItem>
		</Menu>
	</div>
	)
							}
							<Button color="inherit" className="display-flex" onClick={props.handleLoginClick}>{buttonLabel}</Button>
						</div>
					</div>
				</Toolbar>
			</AppBar>
		</div>
	);
}

export default Navbar;
