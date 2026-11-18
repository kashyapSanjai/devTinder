const mongoose = require("mongoose")
const validator = require('validator')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 55
    },
    lastName: {
        type: String,
        minLength: 4,
        maxLength: 55
    },
    emailId: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minLength: 4,
        maxLength: 55,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Please enter valid email")
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        maxLength: 1000,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter a strong password")
            }
        }
    },
    age: {
        type: Number,
        // required:true,
        min: 18,
        max: 75
    },
    gender: {
        type: String,
        // required:true,
        minLength: 4,
        maxLength: 55,
        // enum: {
        //     values: ["male", "female", "others"],
        //     message: "Gender is not correct"
        // },
        validate(value) {
            if (!["Male", "Female", "Others"].includes(value)) {
                throw new Error("Gender is not correct")
            }
        }
    },
    photo_url: {
        type: String,
        minLength: 4,
        maxLength: 555
    },
    about: {
        type: String,
        default: "This is a default about"
    },
    skills: {
        type: [String],
        validate(value) {
            if (value.length > 3) {
                console.log(value.length);

                throw new Error("Maximum 3 skills are allowed")
            }
        }
    }
}, { timestamps: true })

userSchema.methods.getJwt = function () {
    const user = this
    return jwt.sign({ _id: user._id }, 'Hello@sanjay', { expiresIn: '1d' })
}

userSchema.methods.validatePassword = async function (passwordByInput) {
    const user = this
    const hashPassword = user.password;
    const isPasswordValid = await bcrypt.compare(passwordByInput, hashPassword)
    return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema)
