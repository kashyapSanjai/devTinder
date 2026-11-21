const mongoose = require('mongoose');
const connectDb = async () => {
    await mongoose.connect(process.env.DB_CONNECTIONS_SECTET)
}


module.exports = connectDb;
