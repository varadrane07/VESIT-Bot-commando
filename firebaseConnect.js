// Initialize Firebase and Firestore
const admin = require('firebase-admin');
const ServiceAccount = require('./firestore/firebaseKey.json');

admin.initializeApp({
	credential: admin.credential.cert(ServiceAccount),
});

const db = admin.firestore();

module.exports = db;