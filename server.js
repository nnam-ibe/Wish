const express = require('express');
const admin = require('firebase-admin');
const _ = require('lodash');

const serviceAccount = require('/Users/nnamdi/Downloads/wish-9d5fa-firebase-adminsdk-hy8fy-213c498d11.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://wish-9d5fa.firebaseio.com'
});

const app = express();
const port = process.env.PORT || 5000;

app.get('/api/hello', (req, res) => {
	res.send({ express: 'Hello From Express' });
});

app.get('/api/firebase', (req, res) => {
	let firestore = admin.firestore();
	firestore.collection('test').get().then(snapshot => {
		var result = _.map(snapshot.docs, (doc) => {
			return doc.data();
		});
		res.send(result[0]);
	});
});

app.listen(port, () => console.log(`Listening on port ${port}`));