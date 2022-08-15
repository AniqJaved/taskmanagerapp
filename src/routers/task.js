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
// GET /tasks?completed=true
// GET /tasks?limit=2&skip=2
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req,res) => {
    const match = {}
    const sort = {}
    
    // Below code will check that if the search query contains completed key word then it will filter weather it is
    // true or false.
    if(req.query.completed){
        match.completed = req.query.completed === 'true' //This line is checking that if we add completed in the query string then its value 'true' or 'false' will be string and in order to extract out boolean we had made this logic.
    }

    if(req.query.sortBy){
        const part = req.query.sortBy.split(":")
        sort[part[0]] = part[1] === "desc" ? -1 : 1 ;    //Now descending in case of boolen is that true being 1 will come first in result.
    }
    try{
        //This populate is basically adding  tasks field to the req.user
        
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit), //Pagination: As the query string is string so we will converting that to integer
                skip: parseInt(req.query.skip),    // This will skip the data fetched.
                sort
            }
        });
        res.send(req.user.tasks)
    }
    catch(err){
        res.status(500).send(err)
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

