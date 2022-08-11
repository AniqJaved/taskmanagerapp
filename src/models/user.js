const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
    useNewUrlParser: true
})

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid")
            }
        }
    },
    age: {
        type: Number,
        required: true,
        trim: true,
        validate(value){
            if(value < 0){
                throw new Error("Age is invalid")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain "password" ')
            }
        }
    }
})

//Middleware for converting the password into hased one
userSchema.pre('save', async function (next){
    console.log("Middleware running")

    const user  = this 

    if(user.isModified("password")){
        user.password = await bcrypt.hash(user.password, 8)
    }

    //If we donot call this next then this pre will be running forever expecting the function to complete.
    next();
})

const User = mongoose.model('User', userSchema)

module.exports = User