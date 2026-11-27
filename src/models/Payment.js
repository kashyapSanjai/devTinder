const mongoose = require('mongoose')
const PaymentSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        require:true
    },
    currency:{
        type:String,
        require:true
    },
    amount:{
        type:Number,
        require:true
    },
    paymentId:{
        type:String,
        require:true
    },
    orderId:{
        type:String,
        require:true
    },
    receipt: {
      type: String,
      required: true,
    },
    notes:{
        name:{
            type:String
        },
        email:{
            type:String
        }
    },
    status:{
        type:String,
        require:true    
    },
    membershipType: {
        type: String,
    },
})

module.exports = new mongoose.model('Payment',PaymentSchema)