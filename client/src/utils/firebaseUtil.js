const config = {
	apiKey: "AIzaSyBZytWKyXy7KDn99yM9UXjJz8RAVLpRQfE",
	authDomain: "wish-9d5fa.firebaseapp.com",
	databaseURL: "https://wish-9d5fa.firebaseio.com",
	projectId: "wish-9d5fa",
	storageBucket: "wish-9d5fa.appspot.com",
	messagingSenderId: "760376786906"
 };

const firebase = require('firebase/app');
firebase.initializeApp(config);
require('firebase/firestore');
require('firebase/auth');

// const db = firebase.firestore();
const auth = firebase.auth();

module.exports = {
	createAccount: (options) => {
		return new Promise((resolve, reject) => {
			auth.createUserWithEmailAndPassword(options.email, options.password)
				.then((cred) => {
					resolve(cred.user.uid);
				})
				.catch((err) => {
					let message = _getErrorMessage(err.code);

					if (message) {
						err.message = message;
					}
					reject(err);
				});
		});
	},

	login: (options) => {
		return new Promise((resolve, reject) => {
			auth.signInWithEmailAndPassword(options.email, options.password)
				.then((userCred) => {
					resolve(userCred);
				})
				.catch((err) => {
					let message = _getErrorMessage(err.code);

					if (message) {
						err.message = message;
					}
					reject(err);
				});
		});
	},

	logout: () => {
		return Promise.resolve(auth.signOut());
	},

	isLoggedIn: () => {
		return auth.currentUser;
	},

	onAuthStateChanged: (callback) => {
		auth.onAuthStateChanged(callback);
	}
};


function _getErrorMessage (errorCode) {
	var result;
	switch (errorCode) {
		case 'auth/email-already-in-use':
			result = 'Email is already in use';
			break;
		case 'auth/invalid-email':
			result = 'Enter a valid email';
			break;
		case 'auth/user-disabled':
			result = 'Account has been disabled';
			break;
		case 'auth/user-not-found':
			result = 'No account found';
			break;
		case 'auth/wrong-password':
			result = 'Incorrect password';
			break;
		default:
			result =  null;
	}
	return result;
}




