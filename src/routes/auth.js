const express = require("express")
const authRouter = express.Router();
const User = require('../models/User');
const { isValidateSignup } = require('../utils/validation');
const validator = require('validator')
const bcrypt = require('bcrypt');




authRouter.post('/signup', async (req, res) => {
    const { firstName, lastName, emailId, password } = req.body;
    try {
        isValidateSignup(req)
        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: encryptedPassword
        });
        const userData = await user.save();
        const token = userData.getJwt() //jwt.sign({ _id: user._id }, 'Hello@sanjay', { expiresIn: '1d' })
        const targetDate = new Date(Date.now() + 8 + 3600000); // hpurs from now
        res.cookie('token', token, { expires: targetDate, httpOnly: true })
        res.json({ message: "User data saved suvvesssfully", data: userData })
    }
    catch (err) {
        console.log(err.message)
        res.status(400).send("Error: " + err.message)
    }
})

authRouter.post('/login', async (req, res) => {
    const { emailId, password } = req.body;
    try {
        if (!validator.isEmail(emailId)) {
            throw new Error('Email is not valid')
        }
        const user = await User.findOne({ emailId: emailId })

        if (!user) {
            throw new Error("Invalid credential")
        }
        const isPasswordValid = await user.validatePassword(password);//await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            throw new Error('Invalid credential')
        } else {
            const token = user.getJwt() //jwt.sign({ _id: user._id }, 'Hello@sanjay', { expiresIn: '1d' })
            const targetDate = new Date(Date.now() + 8 + 3600000); // hpurs from now
            res.cookie('token', token, { expires: targetDate, httpOnly: true })
            const { firstName, lastName, age, skills, photo_url } = user;
            res.json({
                firstName,
                lastName,
                age,
                skills,
                photo_url
            });
            // res.send(user_safe_data)
        }
    } catch (err) {
        res.status(400).send('Error: ' + err.message)
    }
})


authRouter.post('/logout', (req, res) => {
    res.cookie('token', '', { expires: new Date(Date.now()) })
    res.send("logout successfully")
})

module.exports = authRouter;