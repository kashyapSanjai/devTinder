const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middlwares/Auth/auth');
const ConnectionRequest = require('../models/ConnectionRequests')
const User = require('../models/User');
const authRouter = require('./auth');
// const {}


requestRouter.post('/request/send/:status/:toUserId',userAuth, async (req,res)=>{
    try{
        // console.log(req.user,req.params)
        const toUserId = req.params.toUserId
        const status = req.params.status
        const fromUserId = req.user._id

        const isAllowedFields = ['ignored','interested']
        if(!isAllowedFields.includes(status)){
            return res.status(400).json({message:'invalid status type : ',status})
        }

        const toUser = await User.findOne({_id:toUserId})
        // console.log(toUser,toUserId)
        if(!toUser){
            return res.status(404).json({message:'User not found'})
        }

        const isRequestExist = await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        })
        // console.log(isRequestExist)
        if(isRequestExist){
            return res.status(400).json({
                message:'Connection request already exist'
            })
        }

        const conReqObj = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data = await conReqObj.save();
        res.json({
            message:"Connection send siuccessfully",
            data
        })
    }
    catch(err){
        res.status(400).send('Error : ' + err.message)
    }
})


requestRouter.patch('/request/review/:status/:requestId', userAuth, async (req,res)=>{
    const loggedInUser = req.user._id;
    const {status, requestId} = req.params;
    // console.log(loggedInUser.firstName,requestId,status);

    const allowedStatus = ['rejected', 'accepted']
    if(!allowedStatus.includes(status)){
        return res.status(400).json({
            message:"Invalid status",
        })
    }
    const connecteionRequest = await ConnectionRequest.findOne({
        _id:requestId,
        toUserId:loggedInUser,
        status:'interested'
    })
    console.log(connecteionRequest)
    if(!connecteionRequest){
        return res.status(400).json({message:"invalid request"})
    }
    connecteionRequest.status = status;
    const data = await connecteionRequest.save();
    res.json({
        message:`You have successfully ${status} the request`,
        data
    })
    
})

module.exports = requestRouter;