import express, { Application } from "express";
import path from "path";
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import { authenticateToken } from "./middelwares/authentication";

dotenv.config();
const app: Application = express();

const PORT = process.env.PORT || 5000;

const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH || './db-credentials/serviceAccountKey.json';
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_REALTIME_DATABASE_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET_URL
});

app.use(express.json())
app.use(express.urlencoded({extended : true}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
    next();
  }
);

app.use(authenticateToken);

app.use('/static', express.static(path.join(__dirname, 'public')));

app.use('/', require('./controllers'));

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT} ...`);
})