const validator = require('validator')

const isValidateSignup = (req)=>{
    const {firstName, lastName, emailId, password} = req.body

    if(!firstName || !lastName){
        throw new Error("Please enter name")
    }if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid")
    }if(!validator.isStrongPassword(password)){
        throw new Error("Please enter strong password")
    }
}

const isValidateProfileEdit = (req)=>{
    const allowedFields = [
        'firstName',
        'lastName',
        'about',
        'age',
        'gender',
        'skills',
        'photo_url'
    ]
    const isAllowedUpdate = Object.keys(req.body).every((k)=>allowedFields.includes(k))
    console.log(isAllowedUpdate)
    return isAllowedUpdate
}


module.exports={
    isValidateSignup,
    isValidateProfileEdit
}