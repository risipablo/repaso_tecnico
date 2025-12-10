
const TodoModel = require("../Models/todoModel")
const todoModel = require("../Models/todoModel")

exports.getTask = async (req,res) => {
    try{
        const task = await todoModel.find()
        res.json(task)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

exports.addTask = async (req,res) => {
    const {date, title, priority} = req.body

    if(!date || !title || !priority) {
        return res.status(400).json({message: 'Completar todos los campos requeridos'})
    }

    try{
        const newTask = new todoModel({
            date,priority,title
        })

        const result = await newTask.save()
        res.json(result)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

exports.deleteTask = async (req,res) => {
    const {id} = req.params

    try{
        const task = await todoModel.findByIdAndDelete(id)
        if(!task){
            return res.status(401).json({error:"Task no encontrada"})
        }
        res.json(task)
        
    } catch(err){
        res.status(500).json({error:err.message})
    }

}

exports.deleteAll = async (req,res) => {
    try{
        const result = await todoModel.deleteMany({})
        res.json(result)
    } catch(err) {
        res.status(500).json({error:err.message})
    }
}

exports.saveTask = async (req,res) => {
    const {id} = req.params
    const {date,title,priority} = req.body
    
     if (!date || !title| !priority) {
        return res.status(400).json({error:"completed the sections"})
    }

    try{
        const saveTask = await todoModel.findByIdAndUpdate(id,{date,title,priority}, {new:true})
        res.json(saveTask)
    
    } catch(err) {
        res.status(500).json({error:err.message})
    }

}

exports.completedTask = async(req,res) => {
    const {id} = req.params;
    const {completed} = req.body

    try{
        const updateTask = await TodoModel.findByIdAndUpdate(id,{completed}, {new:true})
        res.json(updateTask) 
    } catch(err){
        res.status(500).json({error: err.message})
    }
}