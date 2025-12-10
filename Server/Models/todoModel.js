const mongoose = require("mongoose")

const todoSchema = new mongoose.Schema({

    date:{
        type:Date,
        default:Date.now
    },
    title:{
        type:String,
        required:true
    },
    priority:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        default:false
    }

})

const TodoModel = mongoose.model('Task', todoSchema)
module.exports = TodoModel