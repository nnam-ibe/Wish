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

const db = firebase.firestore();
const localKey = 'WISH_LIST_KEY';
const auth = firebase.auth();
const uuidv4 = require('uuid/v4');
let _ = require('lodash');

module.exports = {
	db: db,
	localKey: localKey,

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

	saveNewItem: (path, data) => {
		_getItems(path).then((items) => {
			items.push(data);
			db.doc(path).set({ items }, { merge: true });
		});
	},

	updateItem: (path, item) => {
		_getItems(path).then((items) => {
			let index = _.findIndex(items, { id: item.id });

			items[index] = item;
			db.doc(path).set({ items }, { merge: true });
		});
	},

	deleteItem: (path, itemId) => {
		_getItems(path).then((items) => {
			let index = _.findIndex(items, { id: itemId });

			items.splice(index, 1);
			db.doc(path).set({ items }, { merge: true });
		});
	},

	getCurrentUser: () => {
		return auth.currentUser;
	},

	onAuthStateChanged: (callback) => {
		auth.onAuthStateChanged(callback);
	},

	// Local Storage
	getLocalUID: () => {
		return localStorage.getItem(localKey);
	},

	setLocalUID: (uid) => {
		localStorage.setItem(localKey, uid);
	},

	removeLocalUID: () => {
		localStorage.removeItem(localKey);
	},

	generateUUID: () => {
		return uuidv4();
	}

};

function _getItems (path) {
	return new Promise((resolve, reject) => {
		db.doc(path).get()
			.then((doc) => {
				if (!doc.exists) {
					resolve([]);
					return;
				}

				resolve(doc.data().items);
			});
	});
}

function _getErrorMessage (errorCode) {
	let result;
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




