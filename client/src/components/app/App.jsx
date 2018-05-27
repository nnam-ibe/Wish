import './App.css';
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Navbar from '../navigation/Navbar.jsx';
import Login from '../auth/Login.jsx';
import CreateAccount from '../auth/CreateAccount.jsx';
import Sidebar from '../navigation/Sidebar.jsx';
import firebaseUtil from '../../utils/firebaseUtil.js';

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			uid: null
		}
	}

	componentDidMount() {
		firebaseUtil.onAuthStateChanged((user) => {
			if (user) {
				firebaseUtil.setLocalUID(user.uid);
				this.setState({ uid: user.uid });
			} else {
				firebaseUtil.removeLocalUID();
				this.setState({ uid: null });
				this.props.history.push('/');
			}
		})
	}

	render() {
		return (
			<div className='App'>
				<Route path='/' component={Navbar}/>
				<Route path='/' render={(props) => <Sidebar {...props} uid={this.state.uid}/>}/>
				<div className='content'>
					<Route exact path='/login' component={Login}/>
					<Route exact path='/create_account' component={CreateAccount}/>
				</div>
			</div>
		);
	}
}

export default App;
