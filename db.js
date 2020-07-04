const admin = require('firebase-admin');

const serviceAccount = require('./firebase-config');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DB_URL
});


const db = admin.firestore();

module.exports = db;