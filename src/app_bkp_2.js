const express = require("express");
const connectDb = require("./config/database");
const User = require('./models/User');
const { isValidateSignup } = require('./utils/validation');
const validator = require('validator')
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const { userAuth } = require('./middlwares/Auth/auth')

const app = express();
app.use(cookieParser())
app.use(express.json())

app.post('/signup', async (req, res) => {
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
        await user.save();
        res.send("User data saved suvvesssfully")
    }
    catch (err) {
        console.log(err.message)
        res.status(400).send("Error: " + err.message)
    }
})

app.post('/login', async (req, res) => {
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
            res.send("Login successfull!!")
        }
    } catch (err) {
        res.status(400).send('Error: ' + err.message)
    }
})

app.get('/profile', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user)
    }
    catch (err) {
        res.status(400).send("Error : " + err.message)
    }
})

app.post('/sendConnectionRequest', userAuth, (req, res) => {
    try {
        const user = req.user;
        res.send(user.firstName + "has send connection request")
    } catch (err) {
        res.status(400).send('Error : ' + err.message)
    }
})

app.get('/user/:id', async (req, res) => {
    const userId = req.params.id
    try {
        const user = await User.findOne({ _id: userId })
        if (!user || user?.length < 1) {
            res.status(404).send('User no found')
        } else {
            res.send(user)
        }
    }
    catch (err) {
        console.log(err.message)
        res.status(400).send("Error getting user by id " + err.message)
    }
})

app.get('/user', async (req, res) => {
    const email = req.body.emailId;
    try {
        const user = await User.findOne({ emailId: email })
        if (!user || user?.length < 1) {
            res.status(404).send('User no found')
        } else {
            res.send(user)
        }
    }
    catch (err) {
        console.log(err.message)
        res.status(400).send("Error getting the user " + err.message)
    }
})


app.delete('/user', async (req, res) => {
    const userId = req.body.id;
    try {
        const user = await User.findOneAndDelete(userId)
        if (!user || user?.length < 1) {
            res.status(404).send('User no found')
        } else {
            res.send("User Deleted Successfully")
        }
    }
    catch (err) {
        console.log(err.message)
        res.status(400).send("Error deleting the user " + err.message)
    }
})

app.patch('/user/:id', async (req, res) => {
    const userId = { _id: req.params.id }
    const data = req.body;
    console.log(Object.keys(data))

    try {
        const allowedUpdates = ['firstName', 'lastname', 'gender', 'skills'];
        const isUpdateAllowed = Object.keys(data).every((k) =>
            allowedUpdates.includes(k)
        )
        if (!isUpdateAllowed) {
            throw new Error("Update is not allowed for this field")
        }
        const user = await User.findOneAndUpdate(userId, req.body, { returnDocument: 'before' });
        if (!user || user?.length < 1) {
            res.status(404).send('User not found')
        } else {
            res.send(user)
        }
    }
    catch (err) {
        res.status(400).send('something went wrong ' + err)
    }
})

app.get('/feed', async (req, res) => {
    // const email = req.body.emailId;
    try {
        const user = await User.find({})
        if (!user || user?.length < 1) {
            res.status(404).send('User no found')
        } else {
            res.send(user)
        }
    }
    catch (err) {
        console.log(err.message)
        res.status(400).send("Error saving the user " + err.message)
    }
})


connectDb()
    .then(() => {
        console.log("Database connection established successfully");
        app.listen(777, async () => {
            console.log("server start successfully")
        })
    })
    .catch((err) => {
        console.log("Database cant be connected", err);

    })

