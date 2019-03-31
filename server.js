const express = require('express');
const admin = require('firebase-admin');
const _ = require('lodash');
const path = require('path');
var bodyParser = require('body-parser');

const serviceAccount = require('./firebase-config/admin-config.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://wish-9d5fa.firebaseio.com'
});

const app = express();
const port = process.env.PORT || 5500;
const jsonParser = bodyParser.json();
const firestore = admin.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

app.post('/api/create_account', jsonParser, (req, res) => {
	let body = req.body;
	if (!_.has(body, 'uid')) {
		res.status(400).send({ message: 'No uid provided' });
		return;
	}

	let uid = body.uid;

	firestore.doc(`users/${uid}`).set({
		addTaxes: true,
		defaultList: 'Main',
		defaultIncrement: 200,
		tax: 13,
		username: body.username,
		activeLists: ['Main']
	}).then(() => {
		res.send(['all good']);
	}).catch((err) => {
		console.error(err);
	});
});

app.post('/api/logger', jsonParser, (req, res) => {
	let body = req.body;
	if (!_.has(body, 'message')) {
		return res.status(400).send({ message: 'No message provided'});
	}

	res.send(['all good']);
});

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

app.listen(port, () => console.log(`Listening on port ${port}`));