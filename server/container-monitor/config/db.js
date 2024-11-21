require('dotenv').config();

const admin = require("firebase-admin");

//let serviceAccount = require(path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH));
let serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://health-endpoint-monitoring-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.database();

module.exports = db;
