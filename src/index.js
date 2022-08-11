const express = require('express')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
require('./db/mongoose')


const app = express()
const port = process.env.PORT || 3000

// This line converts the request to json format
app.use(express.json())

//For User Requests
app.use(userRouter)
//For Task Requests
app.use(taskRouter)

app.listen(port, ()=>{
    console.log("Sever is up on port" + port)
})