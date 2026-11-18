const express = require('express');
const { userAuth } = require('../middlwares/Auth/auth');
const ConnectionRequest = require('../models/ConnectionRequests');
const { connections } = require('mongoose');
const User = require('../models/User');
const userRouter = express.Router();
const USAER_SAFE_DATA = 'firstName lastName age gender skills about photo_url';

userRouter.get('/user/requests/recieved', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const requests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate('fromUserId', USAER_SAFE_DATA)
        // }).populate('fromUserId',['firstName', 'lastName', 'age', 'skills'])


        res.json({
            message: "fetched requests",
            data: requests
        })
    }
    catch (err) {
        res.status(400).send('Error: ' + err.message)
    }
})

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser, status: 'accepted' },
                { toUserId: loggedInUser, status: 'accepted' }
            ]
        }).populate("fromUserId", USAER_SAFE_DATA)
            .populate('toUserId', USAER_SAFE_DATA)
        // console.log(loggedInUser._id)

        const data = connections.map(item => {
            if (item.fromUserId._id.toString() == loggedInUser._id.toString()) {
                return item.toUserId
            }
            return item.fromUserId
        })

        res.json({ data })
    }
    catch (err) {
        res.status().send("Error : " + err.message)
    }

})

userRouter.get('/user/feed', userAuth, async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10
        limit = limit > 50 ? 50 : limit;
        const loggedInUser = req.user;
        const connectionsRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id },
            ]
        }).select('fromUserId toUserId')

        const hideConnections = new Set();
        connectionsRequests.forEach(reqsts => {
            hideConnections.add(reqsts.fromUserId.toString())
            hideConnections.add(reqsts.toUserId.toString())
        })

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideConnections) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select(USAER_SAFE_DATA)
            .skip(page)
            .limit(limit)


        res.json({ users })
    }
    catch (err) {
        res.status(400).send("Error : " + err.message)
    }
})

module.exports = userRouter;