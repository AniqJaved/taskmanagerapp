const express = require('express')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
require('./db/mongoose')


const app = express()
const port = process.env.PORT || 3000

//This acts a middleware for the website when in mantienece mode
app.use((req,res,next)=>{
    res.status(503).send('Site is currently down please check back later');
})

// This line converts the request to json format
app.use(express.json())

//For User Requests
app.use(userRouter)
//For Task Requests
app.use(taskRouter)

app.listen(port, ()=>{
    console.log("Sever is up on port" + port)
})