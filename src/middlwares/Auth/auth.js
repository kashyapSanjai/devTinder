const jwt = require('jsonwebtoken')
const User = require('../../models/User')
const adminAuth = (req, res, next) => {
    let token = '2542xyz';
    let isAuthenticated = token === '2542xyz'
    if (!isAuthenticated) {
        console.log('admin user data not authrised')
        res.status(401).send('Admin not authenticateddd')
    } else {
        console.log('admin user data authrised')
        next();
    }
}

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send('invalid token')
        }
        const decodedJwt = await jwt.verify(token, process.env.JWT_SECRET)
        const { _id } = decodedJwt;
        const user = await User.findById(_id);
        if (!user) {
            throw new Error('User does not exist')
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(400).send("Error : " + err.message)
    }
}

const userAuth1 = (req, res, next) => {
    let token = '2542xyz';
    let isAuthenticated = token === '2542xyz'
    if (!isAuthenticated) {
        console.log('user data not authrised')
        res.status(401).send('User not authenticateddd')
    } else {
        console.log('user data authrised')
        next();
    }
}

module.exports = {
    adminAuth,
    userAuth
}