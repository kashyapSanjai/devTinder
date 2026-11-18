const express = require('express');
const brcypt = require("bcrypt")
const profileRouter = express.Router();
const { userAuth } = require('../middlwares/Auth/auth')
const { isValidateProfileEdit } = require("../utils/validation")
const User = require("../models/User")

profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user)
    }
    catch (err) {
        res.status(400).send("Error : " + err.message)
    }
})

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        if (!isValidateProfileEdit(req)) {
            throw new Error("Invalid edit request")
        }
        const loggedInUser = req.user
        Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key])
        await loggedInUser.save();
        res.json({
            message: `${loggedInUser.firstName}, your profile updated successfully `,
            loggedInUser: loggedInUser
        })
    }
    catch (err) {
        res.status(400).send("Error : " + err.message)
    }
})

profileRouter.patch('/update-passowrd', userAuth, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Old password and new password are required'
            });
        }

        if (oldPassword === newPassword) {
            return res.status(400).json({
                message: 'New password must be different from old password'
            });
        }
        const user = await User.findById(req.user._id)

        if (!user || user?.length < 1) {
            res.status(404).send('User not found')
        } else {
            const isOldPasswordValid = await user.validatePassword(oldPassword);
            if (isOldPasswordValid) {
                console.log(isOldPasswordValid)
                const encryptedPassword = await brcypt.hash(newPassword, 10)
                user.password = encryptedPassword;
                await user.save()
                res.json({
                    message: `${req.user}, you have updated password succesfully!!`
                })
            } else {
                throw new Error("Incorrect Old password")
            }
        }
    }
    catch (err) {
        res.status(400).send("Error : " + err.message)
    }
})

module.exports = profileRouter;