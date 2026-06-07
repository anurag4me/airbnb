const mongodb = require("mongodb")

const MongoClient = mongodb.MongoClient;

const MONGO_URL = "mongodb+srv://anurag4me:anurag4me@cluster0.r7owp1k.mongodb.net/?appName=Cluster0";

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(MONGO_URL).then(client => {
    callback();
    _db = client.db('airbnb')
  }).catch(err => {
    console.log("Error while connecting to mongo", err)
  });
}

const getDB = () => {
  if(!_db) {
    throw new Error('Mongo not connect')
  }
  return _db;
}

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;