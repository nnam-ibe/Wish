import './App.css';
import React, { Component } from 'react';
import {Route} from 'react-router-dom'
import Navbar from '../navigation/Navbar.jsx';
import {BrowserRouter} from 'react-router-dom';
import Login from '../auth/Login.jsx';
import CreateAccount from '../auth/CreateAccount.jsx';
// import * as firebase from 'firebase';

class App extends Component {
	state = {
		reponse: ''
	};

	render() {
		return (
			<BrowserRouter>
				<div className='App'>
					<Route path='/' component={Navbar}/>
					<Route exact path='/login' component={Login}/>
					<Route exact path='/create_account' component={CreateAccount}/>
				</div>
			</BrowserRouter>
		);
	}
}

export default App;
