const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')

const router = new express.Router()

//Only create and login requests are not not using auth middleware because in them we are making and assigning token respectively.

//Create Users
router.post('/users', async (req,res) => {
    const user = new User(req.body)
    const token = await user.generateAuthToken();
    try{
        await user.save()
        res.status(201).send(user)
    }
    catch(err){
        res.status(400).send()
    }
})

//Login User
router.post('/users/login', async(req,res) =>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password);
        const token = await user.generateAuthToken();
        res.send({user,token})
    }
    catch(err){
        res.status(400).send()
    }
})


//Logout User from single session
router.post('/users/logout',auth, async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })

        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send()
    }
})

//Logout User from all sessions
router.post('/users/logoutAll',auth, async(req,res)=>{
    try{
        req.user.tokens = []

        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send()
    }
})

//Update User

router.patch('/users/me',auth, async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name","age","email","password"]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidOperation){
        res.status(201).send("Invalid Updates")
    }

    try{
        updates.forEach((update)=>{
            req.user[update] = req.body[update]
        })

        await req.user.save()


        //We are not using below line of code as it is not aligned with mongoose due to findByIdAndUpdate. And due to this we are not able to use middleware and this fucntion bypasses that.
        //const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        res.send(req.user)
        
    }
    catch(err){
        res.status(400).send(err)
    }
})

// Find Users
router.get('/users/me', auth , async (req,res)=>{
    res.send(req.user)
})




//Delete User 

router.delete('/users/me',auth, async (req,res)=>{  // :id is used to grab the id which user adds in the route
    try{
        await req.user.remove()
        res.send(req.user)
    }
    catch(err){
        res.status(400).send(err)
    }
})

//Uploading user profile image
const upload = multer({
    limits: {
        fileSize: 1000000    //Here we are validating that if the size of file is less than 1MB
    },
    //This is builtin function of multer which filter files.
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image file'))
        }

        cb(undefined,true)                          //Undefined means that error is undefined
    }
})
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req,res)=>{
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()                           //You can see we are not using try and catch in here it is because catch will return an html document instead of json file for error. So for error we are using a second argument (error,req,res,next)
},(error,req,res,next) => {
    res.status(400).send({error: error.message})
})


//Deleting User profile image

router.delete('/users/me/avatar',auth,async (req,res)=>{
    try{
        req.user.avatar = undefined
        await req.user.save()
        res.send(req.user)
    }
    catch(e){
        res.send(400).send(e)
    }
})

//Fetching user profile image
router.get('/users/:id/avatar', async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type','image/jpg')  //Now we are setting Content-Type because we will be getting data in binary encoding so in order to render it we will be converting it to image type.
        res.send(user.avatar)
    }
    catch(e){
        res.status(400).send()
    }
})

module.exports = router