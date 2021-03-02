// Initialize Firebase and Firestore
const admin = require('firebase-admin');
// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config();

admin.initializeApp({
	credential: admin.credential.cert(JSON.parse(process.env.serviceKey)),
});

const db = admin.firestore();

module.exports = db;