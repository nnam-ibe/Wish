import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import { Route } from 'react-router-dom';
import Navbar from '../navigation/Navbar';
import Login from '../auth/Login';
import CreateAccount from '../auth/CreateAccount';
import Settings from '../user/Settings';
import Sidebar from '../navigation/Sidebar';
import ListPage from '../lists/ListPage';
import UserContext from './UserContext';
import FirebaseWrapper from '../../utils/FirebaseWrapper';

function App(props) {
	const [uid, setUID] = useState();
	const [userPrefs, setUserPrefs] = useState();
	const prevUID = usePrevious(uid);
	const userContext = { ...userPrefs, uid };

	useEffect(() => FirebaseWrapper.onAuthStateChanged((user) => {
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
	}));

	useEffect(() => {
		if (!uid) return;
		FirebaseWrapper.db.doc(`users/${uid}`).onSnapshot((snapshot) => {
			if (!snapshot.exists) return;

			const prefs = snapshot.data();
			setUserPrefs(prefs);
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
		<div className="App">
			<UserContext.Provider value={userContext}>
				<Navbar
					handleLoginClick={handleLoginClick}
					title="Wish List"
					nav={navigateToRoute}
					isLoggedIn={Boolean(uid)}
				/>
				<Route
					path="/"
					render={(renderProps) => {
						const sideProps = { ...renderProps, uid, userPrefs };
						if (!userPrefs) return (<div />);

						return (<Sidebar {...sideProps} />);
					}}
				/>
				<div className="content">
					<Route
						exact
						path="/lists/:page"
						render={(renderProps) => {
							if (!userPrefs) return (<div />);

							const listProps = { ...renderProps, uid, userPrefs };
							return (<ListPage {...listProps} />);
						}}
					/>
					<Route exact path="/login" component={Login} />
					<Route exact path="/create_account" component={CreateAccount} />
					<Route exact path="/settings" component={Settings} />
				</div>
			</UserContext.Provider>
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
