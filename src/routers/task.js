const express = require('express')
const auth = require('../middleware/auth')
const Task = require('../models/task')

const router = new express.Router()

//Create Task
router.post('/tasks',auth, async (req,res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    }
    catch(err){
        res.status(400).send(err)
    }
    
})

//Update task

router.patch('/tasks/:id', auth , async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ["description","completed"]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidOperation){
        res.status(201).send("Invalid Updates")
    }

    try{

        const task = await Task.findOne({_id:req.params.id, owner: req.user._id});
       
        //We are not using below line of code as it is not aligned with mongoose due to findByIdAndUpdate. And due to this we are not able to use middleware and this fucntion bypasses that.
        //const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!task){
            res.status(404).send()
        }

        updates.forEach((update)=>{
            task[update] = req.body[update]
        })

        await task.save()

        res.send(task)
    }
    catch(err){
        res.status(400).send(err)
    }
})


// Find Tasks
router.get('/tasks', auth, async (req,res) => {
    const match = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    try{
        if(match.hasOwnProperty('completed')){
            const tasks = await Task.find({owner: req.user._id, completed:match.completed})
            //console.log(tasks)
            return res.send(tasks)
        }
        
        const tasks = await Task.find({owner: req.user._id})
        res.send(tasks)
        
        //await req.user.populate("tasks").execPopulate()
        //console.log(match)
        
    }
    catch(err){
        res.status(500).send()
    }
    
})


//Find Task with particular id
router.get('/tasks/:id', auth, async (req,res)=>{  // :id is used to grab the id which user adds in the route
    const _id = req.params.id
    
    try{
        const task = await Task.findOne({ _id, owner: req.user._id })
        
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }

    catch(err){
        res.status(500).send(err)
    }
    
})

//Delete Task
router.delete('/tasks/:id', auth, async (req,res)=>{  // :id is used to grab the id which user adds in the route
    const _id = req.params.id
    try{
        const task = await Task.findOneAndDelete({_id, owner: req.user._id});
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }

    catch(err){
        res.status(400).send(err)
    }
    
})

module.exports = router

