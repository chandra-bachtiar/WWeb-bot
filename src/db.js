const mongo = require('mongodb')
const { MongoClient } = mongo;
const urlDB = process.env.URI;
const database = process.env.DATABASE
const client = new MongoClient(urlDB);
client.connect();
const mongodb = client.db(database);
module.exports = { mongodb };