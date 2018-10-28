import './App.css';
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Navbar from '../navigation/Navbar.jsx';
import Login from '../auth/Login.jsx';
import CreateAccount from '../auth/CreateAccount.jsx';
import Sidebar from '../navigation/Sidebar.jsx';
import ListPage from '../lists/ListPage.jsx';
import FirebaseUtil from '../../utils/firebaseUtil.js';

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			uid: null,
			userPrefs: {}
		}
	}

	componentDidMount() {
		FirebaseUtil.onAuthStateChanged((user) => {
			if (user) {
				FirebaseUtil.setLocalUID(user.uid);
				this.setState({ uid: user.uid });

				if (this.props.location.pathname === '/') {
					this.props.history.push('/lists/Main');
				}

				this._getUserPrefs(user.uid);

			} else {
				FirebaseUtil.removeLocalUID();
				this.setState({ uid: null });
				this.props.history.push('/');
			}
		})
	}

	render() {
		const uid = this.state.uid;
		const userPrefs = this.state.userPrefs;

		return (
			<div className='App'>
				<Route path='/' component={Navbar}/>
				<Route path='/' render={(props) => {
					const sideProps = {...props, uid, userPrefs};
					return (<Sidebar {...sideProps}/>);
				}}/>
				<div className='content'>
					<Route exact path='/lists/:page' render={(props) => {
						const listProps = {...props, uid, userPrefs};
						return (<ListPage {...listProps}/>);
					}}/>
					<Route exact path='/login' component={Login}/>
					<Route exact path='/create_account' component={CreateAccount}/>
				</div>
			</div>
		);
	}

	_getUserPrefs = (uid) => {
		FirebaseUtil.db.doc(`users/${uid}`).onSnapshot((snapshot) => {
			if (!snapshot.exists) return;

			this.setState({ userPrefs: snapshot.data() });
		});
	}
}

export default App;
