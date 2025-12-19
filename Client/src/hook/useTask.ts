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

    const saveTask = (id:string, editData:{date:Date, title:string, priority:string, amount:number}) => {
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

    const completedTask = (id:string, completed:boolean) => {
        axios.patch(`http://localhost:3001/api/task/${id}/completed`,{completed:!completed})
        .then(response => {
            const taskUpdate = response.data
            setTasks(prevTasks => prevTasks.map(task => task._id === id ? taskUpdate : task))

            if(response.data.completed){
                toast.success('Tarea completada')
            } else {
                toast.error('Tarea incompleta')
            }
        })

        .catch(err => console.log(err))
    }

   const multiplyAmounts = (id: string, multiplier: number = 2 | 4 | 6 | 8) => {
        axios.patch(`http://localhost:3001/api/task/${id}/multiply`, { multiplier })
            .then(response => {
                // Actualizar solo esa tarea en el estado
                setTasks(prevTasks => 
                    prevTasks.map(task => 
                        task._id === id ? response.data : task
                    )
                );
                toast.success(`Cantidad multiplicada por ${multiplier}`, {
                    position: 'top-center'
                });
            })
            .catch(err => {
                console.log(err);
                toast.error('Error al multiplicar la tarea', {
                    position: 'top-center'
                });
            });
    };


    return{loading, tasks , addTask, deleteTask,deleteAll,saveTask,completedTask,multiplyAmounts}
}