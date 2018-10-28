import './App.css';
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Navbar from '../navigation/Navbar.jsx';
import Login from '../auth/Login.jsx';
import CreateAccount from '../auth/CreateAccount.jsx';
import Sidebar from '../navigation/Sidebar.jsx';
import ListPage from '../lists/ListPage.jsx';
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

				if (this.props.location.pathname === '/') {
					this.props.history.push('/lists/Main');
				}
			} else {
				firebaseUtil.removeLocalUID();
				this.setState({ uid: null });
				this.props.history.push('/');
			}
		})
	}

	render() {
		const uid = this.state.uid;
		const defaultList = this.state.defaultList;

		return (
			<div className='App'>
				<Route path='/' component={Navbar}/>
				<Route path='/' render={(props) => {
					const sideProps = {...props, uid, defaultList};
					return (<Sidebar {...sideProps}/>);
				}}/>
				<div className='content'>
					<Route exact path='/lists/:page' render={(props) => {
						const listProps = {...props, uid};
						return (<ListPage {...listProps}/>);
					}}/>
					<Route exact path='/login' component={Login}/>
					<Route exact path='/create_account' component={CreateAccount}/>
				</div>
			</div>
		);
	}
}

export default App;
