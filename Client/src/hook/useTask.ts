import { useEffect, useState } from "react"
import type { ITask } from "../types/interface"
import axios from "axios"
import toast from "react-hot-toast"

export const UseTask = () => {
    const [tasks,setTasks] = useState<ITask[]>([])
    const [loading,setLoading] = useState(true)

    useEffect(() => {
        
            setLoading(false)
            axios.get(`http://localhost:3001/api/task`)
            .then(response => {
                setTasks(response.data)
            }) 
            .catch(err => console.log(err))
    },[])

    const addTask = (date:Date, title:string, priority:string, amount:number) => {
        if(date && title.trim() && priority.trim() !== '' ){
            axios.post(`http://localhost:3001/api/task`,{
                date:date,
                title:title,
                priority:priority,
                amount:amount,
                completed: false
            })
            .then(response => {
                setTasks([...tasks,response.data])
                toast.success('tarea agregada con exito',{
                    position:'top-center'
                })
            })
            .catch(err => {
                console.log(err)
                 toast.error('Error al agregar una tarea',{
                    position:'top-center'
                })
            })
        }
    }

    const deleteTask = (id:string) => {
        axios.delete(`http://localhost:3001/api/task/${id}`)
        .then(() => {
            const deleteTask = tasks.filter(task => task._id !== id)
            setTasks(deleteTask)
            toast.success('tarea eliminada con exito',{
                    position:'top-center'
                })
        })
        .catch(err => console.log(err))
    }

    const deleteAll = () => {
        axios.delete(`http://localhost:3001/api/task`)
        .then(response => {

            setTasks([])
            console.log(response.data)
            toast.success('Todas las tareas eliminadas', {
                    position: 'top-center',
            })
        })
        .catch(err => console.log(err))
    }

    const saveTask = (id:string, editData:{date:Date,  priority?:string, amount?:number}) => {
        axios.patch(`http://localhost:3001/api/task/${id}`, editData)
        .then(response => {
            const updateTask = tasks.map(task => {
                if (task._id === id) {
                    return response.data
                }
                return task
            })
            setTasks(updateTask)
        }) 
        .catch(err => console.log(err)) 
    }





    const multiplyAmounts = (id: string, multiplier: number) => {
    axios.patch(`http://localhost:3001/api/task/${id}/multiply`, { multiplier })
        .then(response => {
            // Actualizar la tarea en el estado
            setTasks(prevTasks => 
                prevTasks.map(task => 
                    task._id === id ? response.data : task
                )
            )
            
            const task = response.data
            const amounts = Array.isArray(task.amount) ? task.amount : [task.amount]
            const totalAfter = amounts.reduce((a: number, b: number) => a + b, 0)
            
            toast.success(
                `Multiplicado x${multiplier}. Nuevo total: $${totalAfter.toLocaleString()}`, 
                {
                    position: 'top-center',
                    duration: 3000
                }
            )
        })
        .catch(err => {
            console.log('Error multiplicando:', err.response?.data || err.message)
            toast.error(err.response?.data?.error || 'Error al multiplicar cantidades', {
                position: 'top-center'
            })
        })
}


  const addNewTask = (taskId: string, title: string, priority: string, amount: number) => {
    axios.post(`http://localhost:3001/api/task/${taskId}/addtask`, {
        title,      
        priority,   
        amount     
    })
    .then(response => {
        setTasks(prev => prev.map(task => task._id === taskId ? response.data : task))
        toast.success('Ítem agregado a la tarea')
    })
    .catch(err => {
        console.log(err)
        toast.error('Error al agregar ítem')
    })
}

const editSubTask = (taskId: string, subTaskIndex: number, updatedSubTask: { title?: string, priority?: string, amount?: number }) => {
    axios.patch(`http://localhost:3001/api/task/${taskId}/subtasks/${subTaskIndex}`, updatedSubTask)
        .then(response => {
            setTasks(prevTasks => 
                prevTasks.map(task => 
                    task._id === taskId ? response.data : task
                )
            );
            toast.success('Subtarea actualizada');
        })
        .catch(err => {
            console.log(err);
            toast.error('Error al editar subtarea');
        });
};

// COMPLETAR UNA SUBTAREA ESPECÍFICA
// Función para alternar estado de subtarea
const toggleSubTaskComplete = (taskId: string, subTaskIndex: number) => {
    axios.patch(`http://localhost:3001/api/task/${taskId}/subtasks/${subTaskIndex}/toggle`)
        .then(response => {
            // Actualizar solo esa tarea en el estado
            setTasks(prevTasks => 
                prevTasks.map(task => 
                    task._id === taskId ? response.data : task
                )
            )
            
            const task = response.data
            const isCompleted = task.subtaskCompleted?.[subTaskIndex] || false
            
            toast.success(
                isCompleted ? 'Subtarea completada ✓' : 'Subtarea marcada como pendiente',
                {
                    position: 'top-center',
                    duration: 2000
                }
            )
        })
        .catch(err => {
            console.log('Error al cambiar estado:', err.response?.data || err.message)
            toast.error('Error al actualizar subtarea')
        })
}

// Función para completar TODAS las subtareas de una tarea
const completeAllSubTasks = (taskId: string) => {
    axios.patch(`http://localhost:3001/api/task/${taskId}/complete-all`)
        .then(response => {
            setTasks(prevTasks => 
                prevTasks.map(task => 
                    task._id === taskId ? response.data : task
                )
            )
            toast.success('Todas las subtareas completadas')
        })
        .catch(err => {
            console.log('Error completando todas:', err.response?.data || err.message)
            toast.error('Error al completar subtareas')
        })
}
// ELIMINAR UNA SUBTAREA ESPECÍFICA
const deleteSubTask = (taskId: string, subTaskIndex: number) => {
    axios.delete(`http://localhost:3001/api/task/${taskId}/subtasks/${subTaskIndex}`)
        .then(response => {
            setTasks(prevTasks => 
                prevTasks.map(task => 
                    task._id === taskId ? response.data : task
                )
            );
            toast.success('Subtarea eliminada');
        })
        .catch(err => {
            console.log(err);
            toast.error('Error al eliminar subtarea');
        });
};







    return{loading, tasks , addTask, deleteTask,deleteAll,saveTask,completeAllSubTasks,multiplyAmounts,addNewTask,deleteSubTask,editSubTask,toggleSubTaskComplete}
}