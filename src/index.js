const express = require('express')
const User = require('./models/user')
const Task = require('./models/task')
require('./db/mongoose')


const app = express()
const port = process.env.PORT || 3000

// This line converts the request to json format
app.use(express.json())


//Create Users
app.post('/users', async (req,res) => {
    const user = new User(req.body)
    try{
        await user.save()
        res.status(201).send(user)
    }
    catch(err){
        res.status(400).send(err)
    }
})

//Update User

app.patch('/users/:id', async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name","age","email","password"]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidOperation){
        res.status(201).send("Invalid Updates")
    }

    try{
        const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
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
app.get('/users', async (req,res)=>{

    try{
        const users = await User.find({})
        res.send(users)
    }
    catch(err){
        res.status(400).send(err)
    }
})


//Find Users with particular id
app.get('/users/:id', async (req,res)=>{  // :id is used to grab the id which user adds in the route
    const _id = req.params.id
    try{
        const user = await User.findById(_id)
        
        if(!user){
            res.status(404).send()
        }
        res.status(201).send(user)
    }
    catch(err){
        res.status(400).send(err)
    }
})

//Create Task
app.post('/tasks', async (req,res) => {
    const task = new Task(req.body)
    try {
        await task.save()
        res.status(201).send(task)
    }
    catch(err){
        res.status(400).send(err)
    }
    
})

//Update task

app.patch('/tasks/:id', async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ["description","completed"]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidOperation){
        res.status(201).send("Invalid Updates")
    }

    try{
        const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!task){
            res.status(404).send()
        }
        res.send(task)
    }
    catch(err){
        res.status(400).send(err)
    }
})


// Find Tasks
app.get('/tasks',async (req,res)=>{
    
    try{
        const tasks = await Task.find({})
        res.send(tasks)
    }
    catch(err){
        res.status(400).send(err)
    }
    
})


//Find Users with particular id
app.get('/tasks/:id',async (req,res)=>{  // :id is used to grab the id which user adds in the route
    const _id = req.params.id
    try{
        const task = await Task.findById(_id)
        if(!task){
            res.status(404).send()
        }
        res.status(201).send(task)
    }

    catch(err){
        res.status(400).send(err)
    }
    
})

app.listen(port, ()=>{
    console.log("Sever is up on port" + port)
})