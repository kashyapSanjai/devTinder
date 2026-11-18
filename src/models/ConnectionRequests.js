const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        require: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        require: true
    },
    status: {
        type: String,
        enum: {
            values: ['interested', 'ignored', 'rejected', 'accepted'],
            message: `{value} is not a valid status`
        },
        reequir:true
    }
})

connectionRequestSchema.index({fromUserId:1,toUserId:1})

// connectionRequestSchema.pre('save', function (next) {
//     const connectionRequest = this;
//     if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
//         throw new Error('you can not send request to yourself')
//     }
//     next();
// })




const connectionRequestModel = new mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = connectionRequestModel