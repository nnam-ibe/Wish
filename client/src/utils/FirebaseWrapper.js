import { initializeApp, firestore, auth as _auth } from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import uuidv4 from 'uuid/v4';
import { findIndex } from 'lodash';

const config = {
	apiKey: "AIzaSyBZytWKyXy7KDn99yM9UXjJz8RAVLpRQfE",
	authDomain: "wish-9d5fa.firebaseapp.com",
	databaseURL: "https://wish-9d5fa.firebaseio.com",
	projectId: "wish-9d5fa",
	storageBucket: "wish-9d5fa.appspot.com",
	messagingSenderId: "760376786906"
};
initializeApp(config);

const db = firestore();
const localKey = 'WISH_LIST_KEY';
const auth = _auth();


const FirebaseWrapper = {
	db,
	localKey,
	getErrorMessage,

	createAccount(options) {
		return auth.createUserWithEmailAndPassword(options.email, options.password)
			.then((cred) => {
				return cred.user.uid;
			})
			.catch((err) => {
				const message = getErrorMessage(err.code);

				if (message) err.message = message;
				Promise.reject(err);
			});
	},

	login(options) {
		return auth.signInWithEmailAndPassword(options.email, options.password)
			.catch((err) => {
				const message = getErrorMessage(err.code);

				if (message) err.message = message;
				Promise.reject(err);
			});
	},

	logout() {
		return auth.signOut();
	},

	saveNewItem(path, data) {
		data.id = uuidv4();
		return _getItems(path).then((items) => {
			items.push(data);
			db.doc(path).set({ items }, { merge: true });
		});
	},

	updateItem(path, item) {
		return _getItems(path).then((items) => {
			const index = findIndex(items, { id: item.id });

			items[index] = item;
			db.doc(path).set({ items }, { merge: true });
		});
	},

	deleteItem(path, itemId) {
		return _getItems(path).then((items) => {
			const index = findIndex(items, { id: itemId });

			items.splice(index, 1);
			db.doc(path).set({ items }, { merge: true });
		});
	},

	getCurrentUser() {
		return auth.currentUser;
	},

	onAuthStateChanged(callback) {
		return auth.onAuthStateChanged(callback);
	},

	// Local Storage
	getLocalUID() {
		return localStorage.getItem(localKey);
	},

	setLocalUID(uid) {
		localStorage.setItem(localKey, uid);
	},

	removeLocalUID() {
		localStorage.removeItem(localKey);
	},

	generateUUID() {
		return uuidv4();
	}
};

async function _getItems (path) {
	const doc = await db.doc(path).get();
	if(!doc.exists) return[];

	return doc.data().items;
}

function getErrorMessage (errorCode) {
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
			result = null;
	}
	return result;
}

export default FirebaseWrapper;