const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = new express.Router()

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

router.patch('/users/:id', async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name","age","email","password"]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidOperation){
        res.status(201).send("Invalid Updates")
    }

    try{
        const user = await User.findById(req.params.id);
        updates.forEach((update)=>{
            user[update] = req.body[update]
        })

        await user.save()


        //We are not using below line of code as it is not aligned with mongoose due to findByIdAndUpdate. And due to this we are not able to use middleware and this fucntion bypasses that.
        //const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})


        if(!user){
            res.status(404).send()
        }
        res.send(user)
        
    }
    catch(err){
        res.status(400).send(err)
    }
})

// Find Users
router.get('/users/me', auth , async (req,res)=>{
    res.send(req.user)
})


//Find Users with particular id
router.get('/users/:id', async (req,res)=>{  // :id is used to grab the id which user adds in the route
    const _id = req.params.id
    try{
        const user = await User.findById(_id)
        
        if(!user){
            res.status(404).send()
        }
        res.send(user)
    }
    catch(err){
        res.status(400).send(err)
    }
})

//Delete User 

router.delete('/users/:id', async (req,res)=>{  // :id is used to grab the id which user adds in the route
    const _id = req.params.id
    try{
        const user = await User.findByIdAndDelete(_id)
        
        if(!user){
            res.status(404).send()
        }
        res.send(user)
    }
    catch(err){
        res.status(400).send(err)
    }
})

module.exports = router