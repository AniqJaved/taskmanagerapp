const express = require('express')
const Task = require('../models/task')

const router = new express.Router()

//Create Task
router.post('/tasks', async (req,res) => {
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

router.patch('/tasks/:id', async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ["description","completed"]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidOperation){
        res.status(201).send("Invalid Updates")
    }

    try{

        const task = await Task.findById(req.params.id);
        updates.forEach((update)=>{
            task[update] = req.body[update]
        })

        await task.save()


        //We are not using below line of code as it is not aligned with mongoose due to findByIdAndUpdate. And due to this we are not able to use middleware and this fucntion bypasses that.
        //const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
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
router.get('/tasks',async (req,res)=>{
    
    try{
        const tasks = await Task.find({})
        res.send(tasks)
    }
    catch(err){
        res.status(400).send(err)
    }
    
})


//Find Task with particular id
router.get('/tasks/:id',async (req,res)=>{  // :id is used to grab the id which user adds in the route
    const _id = req.params.id
    try{
        const task = await Task.findById(_id)
        if(!task){
            res.status(404).send()
        }
        res.send(task)
    }

    catch(err){
        res.status(400).send(err)
    }
    
})

//Delete Task
router.delete('/tasks/:id',async (req,res)=>{  // :id is used to grab the id which user adds in the route
    const _id = req.params.id
    try{
        const task = await Task.findByIdAndDelete(_id)
        if(!task){
            res.status(404).send()
        }
        res.send(task)
    }

    catch(err){
        res.status(400).send(err)
    }
    
})

module.exports = router

