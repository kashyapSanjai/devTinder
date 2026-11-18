const mongoose = require('mongoose');
const connectDb = async () => {
    await mongoose.connect("mongodb+srv://skk12695_db_user:IuNWC9OKXm8G9knj@nodepractisecluster.iigb2qp.mongodb.net/devTinder")
}


module.exports = connectDb;
