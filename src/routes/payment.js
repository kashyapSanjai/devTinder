const express = require('express');
const { userAuth } = require('../middlwares/Auth/auth');
const paymentRouter = express.Router();
const razorpayInstance = require('../utils/razorpay')
const MEMBERSHIP_TYPE = require('../utils/constants');
const Payment = require('../models/Payment');


paymentRouter.post('/payment/create', userAuth, async (req, res) => {
    try {
        const { membershipType } = req.body
        const order =  await razorpayInstance.orders.create({
            amount: MEMBERSHIP_TYPE[membershipType]*100,
            currency: "INR",
            receipt: "order_rcptid_11",
            notes:{
                name:req.user.firstName+' '+req.user.lastName,
                email:req.user.emailId,
                membershipType:membershipType
            }
        })

        const payment = new Payment({
            userId:req.user._id,
            orderId:order.id,
            amount:order.amount,
            receipt:order.receipt,
            notes:order.notes,
            currency:order.currency,
            status:order.status
        })

        const savePayment = await payment.save();
        console.log(order?.data,membershipType);

        res.json({...savePayment.toJSON(),keyId:process.env.RAZORPAY_KEY_ID})


    }
    catch (err) {
        res.status(500).json({ message: 'Payment faild', error: err.message })
    }
})


module.exports = paymentRouter;