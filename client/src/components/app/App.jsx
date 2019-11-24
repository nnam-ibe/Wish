import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import { Route } from 'react-router-dom';
import Navbar from '../navigation/Navbar.jsx';
import Login from '../auth/Login.jsx';
import CreateAccount from '../auth/CreateAccount.jsx';
import Settings from '../user/Settings.jsx';
import Sidebar from '../navigation/Sidebar.jsx';
import ListPage from '../lists/ListPage.jsx';
import FirebaseWrapper from '../../utils/FirebaseWrapper.js';

function App(props) {
	const [uid, setUID] = useState();
	const [userPrefs, setUserPrefs] = useState();
	const prevUID = usePrevious(uid);

	useEffect(() => {
		return FirebaseWrapper.onAuthStateChanged((user) => {
			if (user) {
				FirebaseWrapper.setLocalUID(user.uid);
				setUID(user.uid);
			} else {
				if (!uid && !userPrefs) return;

				FirebaseWrapper.removeLocalUID();
				setUID(null);
				setUserPrefs(null);
				props.history.push('/');
			}
		});
	});

	useEffect(() => {
		if (!uid) return;
		return FirebaseWrapper.db.doc(`users/${uid}`).onSnapshot((snapshot) => {
			if (!snapshot.exists) return;

			const userPrefs = snapshot.data();
			setUserPrefs(userPrefs);
			if (uid !== prevUID) {
				navigateToRoute(`/lists/${userPrefs.defaultList}`);
			}
		});
	});

	async function handleLoginClick() {
		if (uid) {
			await FirebaseWrapper.logout();
			navigateToRoute('/login');
		} else if (props.location.pathname !== '/login') {
			navigateToRoute('/login');
		}
	}

	function navigateToRoute(route) {
		props.history.push(route);
	}

	return (
		<div className='App'>
			<Navbar
				handleLoginClick={handleLoginClick}
				title='Wish List'
				nav={navigateToRoute}
				isLoggedIn={Boolean(uid)}
			/>
			<Route path='/' render={(props) => {
				const sideProps = {...props, uid, userPrefs };
				if (!userPrefs) return (<div></div>);

				return (<Sidebar {...sideProps}/>);
			}}/>
			<div className='content'>
				<Route exact path='/lists/:page' render={(props) => {
					if (!userPrefs) return (<div></div>);

					const listProps = {...props, uid, userPrefs};
					return (<ListPage {...listProps}/>);
				}}/>
				<Route exact path='/login' component={Login}/>
				<Route exact path='/create_account' component={CreateAccount}/>
				<Route exact path='/settings' component={Settings}/>
			</div>
		</div>
	);
}

function usePrevious(value) {
	const ref = useRef();
	useEffect(() => {
		ref.current = value;
	});
	return ref.current;
}

export default App;
