const mongoose = require('mongoose');
const connectionString = process.env.DATABASE_URL;

mongoose.connect(connectionString, { useNewUrlParser: true });
const db = mongoose.connection;
module.exports = db;