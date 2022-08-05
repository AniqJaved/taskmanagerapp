const express = require('express')
const User = require('./models/user')
const Task = require('./models/task')
require('./db/mongoose')


const app = express()
const port = process.env.PORT || 3000

// This line converts the request to json format
app.use(express.json())


//Create Users
app.post('/users',(req,res) => {
    const user = new User(req.body)
    user.save().then(()=>{
        res.status(201).send(user)
    }).catch((err)=>{
        res.status(400).send(err)
    })
})

// Find Users
app.get('/users',(req,res)=>{
    User.find({}).then((users)=>{
        res.send(users)
    }).catch((err)=>{
        res.status(400).send(err)
    })
})


//Find Users with particular id
app.get('/users/:id',(req,res)=>{  // :id is used to grab the id which user adds in the route
    const _id = req.params.id
    User.findById(_id).then((user)=>{
        if(!user){
            res.status(404).send()
        }
        res.status(201).send(user)
    }).catch((err)=>{
        res.status(400).send(err)
    })
})

app.post('/tasks',(req,res) => {
    const task = new Task(req.body)
    task.save().then(()=>{
        res.status(201).send(task)
    }).catch((err)=>{
        res.status(400).send(err)
    })
})

app.listen(port, ()=>{
    console.log("Sever is up on port" + port)
})