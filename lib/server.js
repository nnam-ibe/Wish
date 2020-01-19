import express from 'express';
import { auth, firestore } from '../firebase-admin/config.js';
import { assign } from 'lodash';
import { resolve } from 'path';
import { json } from 'body-parser';
import { validateListName, validateUsername, validateTax, validateNumber } from './utils/InputValidation';
import Logger from './utils/Logger';
const logger = new Logger('server.js');

const app = express();
const port = process.env.PORT || 5500;
const jsonParser = json();

app.post('/api/create/account', jsonParser, (req, res, next) => {
	let uid;
	auth().createUser({
		email: req.body.email,
		emailVerified: false,
		password: req.body.password,
		displayName: req.body.username,
		disabled: false
	})
	.then((userRecord) => {
		uid = userRecord.uid;
		return firestore.doc(`users/${uid}`).set({
			addTaxes: true,
			defaultList: 'Main',
			defaultIncrement: 200,
			tax: 13,
			username: req.body.username,
			activeLists: ['Main']
		});
	})
	.then(() => {
		logger.info(`Created new user ${uid}`);
		res.send({ valid: true });
	})
	.catch(function(error) {
		logger.error(error);
		res.status(400).send(error);
	});
});

app.post('/api/create/new_list/:uid', jsonParser, async (req, res) => {
	const { listName } = req.body;
	const err = validateListName(listName);
	if (err) {
		return res.status(400).send({ error: err.message });
	}

	const snapShot = await firestore.doc(`users/${req.params.uid}`).get();
	if (!snapShot.exists) {
		return res.status(400).send({ error: 'User does not exist' });
	}
	const userInfo = snapShot.data();

	if (userInfo.activeLists.length > 25) {
		return res.status(400).send({ error: 'Cannot create more than 25 lists' });
	}

	if (userInfo.activeLists.includes(listName)) {
		return res.status(400).send({ error: 'List already exists' });
	}

	userInfo.activeLists.push(listName);
	try {
		await firestore.doc(`users/${req.params.uid}`).set(userInfo);
	} catch (err) {
		return res.status(500).send({ error: err.message });
	}
	res.send({ valid: true });
});

app.post('/api/update/settings/:uid', jsonParser, async(req, res) => {
const { addTaxes, username, tax, defaultIncrement, defaultList } = req.body;
	const err = validateUsername(username) ||
		validateTax(tax) ||
		validateNumber(defaultIncrement) ||
		validateListName(defaultList);

	if (err) {
		return res.status(400).send({ error: err.message });
	}

	const snapShot = await firestore.doc(`users/${req.params.uid}`).get();
	if (!snapShot.exists) {
		return res.status(400).send({ error: 'User does not exist' });
	}

	const userInfo = snapShot.data();
	if (!userInfo.activeLists.includes(defaultList)) {
		return res.status(400).send({ error: `List "${defaultList}" does not exist` });
	}

	assign(userInfo, { addTaxes, username, tax, defaultIncrement, defaultList });
	try {
		await firestore.doc(`users/${req.params.uid}`).set(userInfo);
	} catch (err) {
		return res.status(500).send({ error: err.message });
	}
	res.send({ valid: true });
});

app.delete('/api/delete/list/:listName/:uid', jsonParser, async (req, res) => {
	const snapShot = await firestore.doc(`users/${req.params.uid}`).get();
	if (!snapShot.exists) {
		return res.status(400).send({ error: 'User does not exist' });
	}
	const userInfo = snapShot.data();
	if (req.params.listName === userInfo.defaultList) {
		return res.status(400).send({ error: 'Cannot delete your default list' });
	}
	const listIndex = userInfo.activeLists.indexOf(req.params.listName);
	if (listIndex === -1) {
		return res.status(400).send({ error: 'Could not find list' });
	}
	userInfo.activeLists.splice(listIndex, 1);
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
		res.sendFile(resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

const server = app.listen(port, () => logger.info(`Listening on port ${port}`));

export default server;