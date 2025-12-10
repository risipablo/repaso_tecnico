import { useState } from "react"
import { UseTask } from "../hook/useTask"
import type { ITask } from "../types/interface"
import "../components/task.css"
import { AlertCircle, Calendar, Edit2, Plus, Save, Trash2, X } from "lucide-react"

export const CrudTask = () => {
    const {tasks,addTask,loading,deleteTask,deleteAll,saveTask,completedTask} = UseTask()

    const [date,setDate] = useState<string>("")
    const [title,setTitle] = useState<string>("")
    const [priority,setPriority] = useState<string>("")


    const handleAddTask = () => {
        addTask(new Date(date), title, priority)
        setDate("")
        setTitle("")
        setPriority("")
    }

    const handleDeleteTask = (id:string) => {
        deleteTask(id)
    }

    const handleDeleteAll = () => {
        deleteAll()
    }

    // edicion
    const [editId,setEditId] = useState<string | null>(null)
    const [editData,setEditData] = useState({
        date:"",
        title: '',
        priority:""

    })

    const handleEditTask = (task:ITask) => {
        setEditId(task._id)
        setEditData({
            date: task.date instanceof Date ? task.date.toISOString().split('T')[0] : task.date,
            title:task.title,
            priority:task.priority
        })
    }

    const handleSaveTask = (id:string) => {
        saveTask(id,{
            date:new Date(editData.date),
             title: editData.title,
            priority: editData.priority
        })
        setEditData({
            date:"",
            title:"",
            priority:""
        })
        setEditId(null)
    }

    const handleCancelEdit = () => {
        setEditData({
            date:"",
            title:"",
            priority:""
        })
        setEditId(null)
    }

    const handleCompletedtask = (id:string, completed:boolean) => {
        completedTask(id, completed)

    }

  return (
        <div className="container-task">
            <div className="task-header">
                <h1>Gestor de Tareas</h1>
            </div>

            <div className="inputs-task">
                <div className="input-group">
                    <Calendar size={20} />
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="input-group">
                    <input 
                        type="text" 
                        placeholder="Título de la tarea" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                    />
                </div>
                <div className="input-group">
                    <select 
                        value={priority} 
                        onChange={(e) => setPriority(e.target.value)}
                        className="priority-select"
                    >
                        <option value="">Seleccionar prioridad</option>
                        <option value="alta">Alta</option>
                        <option value="media">Media</option>
                        <option value="baja">Baja</option>
                    </select>
                </div>
                <button onClick={handleAddTask} className="btn-add">
                    <Plus size={20} />
                    Agregar Tarea
                </button>
            </div>

            <div className="list-task">
                {loading ? (
                    <div className="loading">
                        <p>Cargando tareas...</p>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="empty-state">
                        <AlertCircle size={48} />
                        <p>No hay tareas disponibles</p>
                        <span>Agrega una tarea para comenzar</span>
                    </div>
                ) : (
                    <div>
                        <div className="table-actions">
                            <button onClick={handleDeleteAll} className="btn-delete-all">
                                <Trash2 size={18} />
                                Eliminar Todas
                            </button>
                        </div>

                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Tarea</th>
                                        <th>Prioridad</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map((task) => (
                                        <tr key={task._id}>
                                            {editId === task._id ? (
                                                <>
                                                    <td>
                                                        <input 
                                                            type="date" 
                                                            value={editData.date} 
                                                            onChange={(e) => setEditData({...editData, date: e.target.value})} 
                                                            className="edit-input"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input 
                                                            type="text" 
                                                            value={editData.title} 
                                                            onChange={(e) => setEditData({...editData, title: e.target.value})} 
                                                            className="edit-input"
                                                        />
                                                    </td>
                                                    <td>
                                                        <select 
                                                            value={editData.priority} 
                                                            onChange={(e) => setEditData({...editData, priority: e.target.value})}
                                                            className="edit-input"
                                                        >
                                                            <option value="alta">Alta</option>
                                                            <option value="media">Media</option>
                                                            <option value="baja">Baja</option>
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <span className={task.completed ? 'status-completed' : 'status-pending'}>
                                                            {task.completed ? 'Completada' : 'Pendiente'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <button 
                                                                onClick={() => handleSaveTask(task._id)} 
                                                                className="btn-save"
                                                                title="Guardar"
                                                            >
                                                                <Save size={18} />
                                                            </button>
                                                            <button 
                                                                onClick={handleCancelEdit} 
                                                                className="btn-cancel"
                                                                title="Cancelar"
                                                            >
                                                                <X size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                    
                                                    <td>{new Date(task.date).toLocaleDateString('es-ES')}</td>
                                                    <td className="task-title">{task.title}</td>
                                                    <td>
                                                        <span className={`priority-badge ${(task.priority)}`}>
                                                            {task.priority}
                                                        </span>
                                                    </td>
                                                    <td onClick={() => handleCompletedtask(task._id, !!task.completed)} style={{cursor:'pointer'}}>
                                                        <span className={task.completed ? 'status-completed' : 'status-pending'}>
                                                            {task.completed ? 'Completada' : 'Pendiente'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <button 
                                                                onClick={() => handleEditTask(task)} 
                                                                className="btn-edit"
                                                                title="Editar"
                                                            >
                                                                <Edit2 size={18} />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteTask(task._id)} 
                                                                className="btn-delete"
                                                                title="Eliminar"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}