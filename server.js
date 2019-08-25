const express = require('express');
const admin = require('firebase-admin');
const _ = require('lodash');
const path = require('path');
const bodyParser = require('body-parser');
const InputValidation = require('./client/src/utils/InputValidation');

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
		return res.status(400).send({ error: 'No uid provided' });
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

// TODO: Fix error handling mess
app.post('/api/create/new_list/:uid', jsonParser, async (req, res) => {
	const { listName } = req.body;
	try {
		InputValidation.validateListName(listName);
	} catch (err) {
		return res.status(400).send({ error: 'Invalid name' });
	}

	var snapShot = await firestore.doc(`users/${req.params.uid}`).get();
	const userInfo = snapShot.data();
	if (!userInfo) {
		return res.status(400).send({ error: 'User does not exist' });
	}

	if (userInfo.activeLists.length > 25) {
		return res.status(400).send({ error: 'Cannot create more than 25 lists' });
	}

	if (userInfo.activeLists.includes(listName)) {
		return res.status(400).send({ error: 'Name already exists' });
	}

	userInfo.activeLists.push(listName);
	try {
		await firestore.doc(`users/${req.params.uid}`).set(userInfo);
	} catch (err) {
		return res.status(500).send({ error: err.message });
	}
	res.send({ valid: true });
});

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

app.listen(port, () => console.log(`Listening on port ${port}`));