const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true
})

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true
    },
    completed: {
        required: false,
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,  //We are specifying that owner field will be of type id.
        required: true,
        ref: 'User'
    }
},{
    timestamps: true
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task