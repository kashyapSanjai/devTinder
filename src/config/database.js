const mongoose = require('mongoose');
const connectDb = async () => {
    await mongoose.connect("mongodb+srv://skk12695_db_user:v3H4854i3UhfzuZF@nodepractisecluster.iigb2qp.mongodb.net/devTinder")
}


module.exports = connectDb;
