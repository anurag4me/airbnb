const mongoose = require('mongoose')

const MONGO_URL = process.env.MONGO_URL;

const mongoConnect = () => mongoose.connect(MONGO_URL)

module.exports = mongoConnect;