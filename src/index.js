const express = require('express')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const mongoose = require('mongoose');
require('./db/mongoose')


const app = express()
const port = process.env.PORT

//This acts a middleware for the website when in mantienece mode
// app.use((req,res,next)=>{
//     res.status(503).send('Site is currently down please check back later');
// })

// This line converts the request to json format
app.use(express.json())

//For User Requests
app.use(userRouter)
//For Task Requests
app.use(taskRouter)

app.listen(port, ()=>{
    console.log("Sever is up on port " + port)
})

const Task = require('./models/task')
const User = require('./models/user')

// const main = async() =>{
//     const user = await User.findById('62f84b3190456a11875287f3')
//     await user.populate('tasks');
//     console.log(user.tasks)
// }

// main()