const admin = require('firebase-admin');
const serviceOptions = require('./options.admin.js');

admin.initializeApp({
	credential: admin.credential.cert(serviceOptions),
	databaseURL: 'https://wish-9d5fa.firebaseio.com'
});

const firestore = admin.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

exports.auth = admin.auth;
exports.firestore = firestore;