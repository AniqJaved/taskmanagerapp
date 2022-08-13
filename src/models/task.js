const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
    useNewUrlParser: true
})

const Task = mongoose.model('Task',{
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
})

module.exports = Task