const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

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
        unique: true,
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
    },

    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

//This method will be applied to all the res.send(). Because everytime express send some response it converts it into JSON
//Bascially we are hiding the password and tokens array
userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

//methods are accessible on instances
userSchema.methods.generateAuthToken = async function (){      // We are using simple function instead of arrow function because we are using 'this' binding in it.
    const user = this 
    const token = jwt.sign({_id: user._id.toString()},'mytaskmanager')  //1st argument: unique id for token , 2nd argument: secret string

    user.tokens = user.tokens.concat({token})   //Adding token on the tokens array. WE are having more than one token at a time because if user logs in from different devices then same account must have different tokens.
    await user.save()
    
    return token
}

//Checking password at login //statics are asseccible on models
userSchema.statics.findByCredentials = async (email,password) => {
    const user = await User.findOne({email})
    
    if(!user){
        throw new Error("Unable to login")
    }

    const isMatch = await bcrypt.compare(password,user.password)
    
    if(!isMatch){
        throw new Error("Unable to login")
    }

    return user
}

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