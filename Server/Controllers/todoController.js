

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
    const {date, title, priority, amount} = req.body

    if(!date || !title || !priority || !amount) {
        return res.status(400).json({message: 'Completar todos los campos requeridos'})
    }

    try{
        const newTask = new todoModel({
            date,priority,title, amount
        })

        const result = await newTask.save()
        res.json(result)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

exports.addMoreTask = async (req, res) => {
    const { id } = req.params
    const { title, priority, amount } = req.body 
    
    console.log('Body recibido:', req.body)
    
    if (!title || !priority || amount === undefined) {
        return res.status(400).json({ 
            error: "Faltan datos. Envía: { title: '...', priority: '...', amount: ... }" 
        })
    }
    
    try {
        const task = await todoModel.findById(id)
        
        if (!task) {
            return res.status(404).json({ error: "Tarea no encontrada" })
        }
        
        // Asegurar que sean arrays
        if (!Array.isArray(task.title)) task.title = [task.title]
        if (!Array.isArray(task.priority)) task.priority = [task.priority]
        if (!Array.isArray(task.amount)) task.amount = [task.amount]
        
        // Agregar con los nuevos nombres
        task.title.push(title)
        task.priority.push(priority)
        task.amount.push(amount)
        
        const updatedTask = await task.save()
        res.json(updatedTask)
        
    } catch (err) {
        res.status(500).json({ error: err.message })
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


exports.deleteSubTask = async (req, res) => {
    const { id, subTaskIndex } = req.params;
    
    try {
        const task = await todoModel.findById(id);
        if (!task) return res.status(404).json({ error: "Tarea no encontrada" });
        
        const index = parseInt(subTaskIndex);
        if (index < 0 || index >= task.title.length) {
            return res.status(400).json({ error: "Índice inválido" });
        }
        
        // Eliminar de todos los arrays
        task.title.splice(index, 1);
        task.priority.splice(index, 1);
        task.amount.splice(index, 1);
        if (task.subtaskCompleted) {
            task.subtaskCompleted.splice(index, 1);
        }
        
        // Si no quedan subtareas, eliminar la tarea completa
        if (task.title.length === 0) {
            await todoModel.findByIdAndDelete(id);
            return res.json({ message: "Tarea eliminada (no tenía subtareas)" });
        }
        
        const updatedTask = await task.save();
        res.json(updatedTask);
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

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
    const {date} = req.body
    
     if (!date ) {
        return res.status(400).json({error:"completed the sections"})
    }

    try{
        const saveTask = await todoModel.findByIdAndUpdate(id,{date }, {new:true})
        res.json(saveTask)
    
    } catch(err) {
        res.status(500).json({error:err.message})
    }

}

// Editar subtareas
exports.editSubTask = async (req, res) => {
    const { id, subTaskIndex } = req.params;
    const updates = req.body;
    
    try {
        const task = await todoModel.findById(id);
        if (!task) return res.status(404).json({ error: "Tarea no encontrada" });
        
        const index = parseInt(subTaskIndex);
        if (index < 0 || index >= task.title.length) {
            return res.status(400).json({ error: "Índice de subtarea inválido" });
        }
        
        // Actualizar campos individuales
        if (updates.title !== undefined) task.title[index] = updates.title;
        if (updates.priority !== undefined) task.priority[index] = updates.priority;
        if (updates.amount !== undefined) task.amount[index] = updates.amount;
        
        const updatedTask = await task.save();
        res.json(updatedTask);
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.completeAllSubTasks = async (req, res) => {
    const { id } = req.params
    
    try {
        const task = await todoModel.findById(id)
        if (!task) {
            return res.status(404).json({ error: "Tarea no encontrada" })
        }
        
        // Inicializar array si no existe
        if (!task.subtaskCompleted || task.subtaskCompleted.length === 0) {
            task.subtaskCompleted = new Array(task.title.length).fill(true)
        } else {
            // Marcar todas como completadas
            task.subtaskCompleted = task.subtaskCompleted.map(() => true)
        }
        
        // Asegurar longitud correcta
        while (task.subtaskCompleted.length < task.title.length) {
            task.subtaskCompleted.push(true)
        }
        
        // Marcar tarea general como completada
        task.completed = true
        
        const updatedTask = await task.save()
        res.json(updatedTask)
        
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
exports.toggleSubTaskComplete = async (req, res) => {
    const { id, subTaskIndex } = req.params
    
    try {
        const task = await todoModel.findById(id)
        if (!task) {
            return res.status(404).json({ error: "Tarea no encontrada" })
        }
        
        const index = parseInt(subTaskIndex)
        
        // Validar índice
        if (index < 0 || index >= task.title.length) {
            return res.status(400).json({ error: "Índice de subtarea inválido" })
        }
        
        // Inicializar array si no existe
        if (!task.subtaskCompleted || task.subtaskCompleted.length === 0) {
            task.subtaskCompleted = new Array(task.title.length).fill(false)
        }
        
        // Asegurar que el array tenga la longitud correcta
        while (task.subtaskCompleted.length < task.title.length) {
            task.subtaskCompleted.push(false)
        }
        
        // Toggle del estado
        task.subtaskCompleted[index] = !task.subtaskCompleted[index]
        
        // Calcular si TODAS las subtareas están completadas
        const allCompleted = task.subtaskCompleted.every(status => status === true)
        
        // Opcional: Actualizar estado general de la tarea
        task.completed = allCompleted
        
        const updatedTask = await task.save()
        res.json(updatedTask)
        
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}


exports.multipliAmounts = async(req,res) => {
    const {id} = req.params;
    const {multiplier} = req.body;

    if(!multiplier || isNaN(multiplier)) {
        return res.status(400).json({error: "Invalid multiplier"})
    }

    try {
      const task = await todoModel.findById(id);
        if (!task) {
            return res.status(404).json({ error: "Tarea no encontrada" });
        }
        
        const updatedTask = await todoModel.findByIdAndUpdate(
            id,
            { amount: task.amount * multiplier },
            { new: true }
        );
        
        res.json(updatedTask);
      
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.multiplyTaskAmounts = async (req, res) => {
    const { id } = req.params
    const { multiplier } = req.body
    
    if (!multiplier || isNaN(multiplier) || multiplier <= 0) {
        return res.status(400).json({ 
            error: "Multiplicador inválido. Debe ser un número mayor a 0" 
        })
    }

    try {
        const task = await todoModel.findById(id)
        
        if (!task) {
            return res.status(404).json({ error: "Tarea no encontrada" })
        }

        // Multiplicar TODAS las cantidades del array
        if (Array.isArray(task.amount)) {
            // Si es array, multiplicar cada elemento
            task.amount = task.amount.map(amount => amount * multiplier)
        } else if (typeof task.amount === 'number') {
            // Si es número individual, convertirlo a array y multiplicar
            task.amount = [task.amount * multiplier]
        } else {
            // Si no hay amount, inicializar
            task.amount = [0]
        }

        const updatedTask = await task.save()
        res.json(updatedTask)
        
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}