const mongoose = require('mongoose')

const MONGO_URL = "mongodb+srv://anurag4me:anurag4me@cluster0.r7owp1k.mongodb.net/airbnb?appName=Cluster0";

const mongoConnect = () => mongoose.connect(MONGO_URL)

module.exports = mongoConnect;