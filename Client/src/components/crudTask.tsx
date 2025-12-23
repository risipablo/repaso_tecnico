import {  useState } from "react"
import { UseTask } from "../hook/useTask"
import type { ITask } from "../types/interface"
import "../style/task.css"
import { AlertCircle, Calendar, CheckCircle, CheckSquare, Edit2, Plus, Save, Trash2, TrendingUp, X } from "lucide-react"
import toast from "react-hot-toast"




export const CrudTask = () => {
    const {
        tasks, 
        addTask, 
        loading, 
        deleteTask, 
        deleteAll, 
        saveTask,           // ← Asegúrate que está importada
        multiplyAmounts, 
        addNewTask, 
        deleteSubTask, 
        toggleSubTaskComplete,
        editSubTask,
        completeAllSubTasks // ← Asegúrate que está importada
    } = UseTask()

    const [date, setDate] = useState<string>("")
    const [title, setTitle] = useState<string>("")
    const [priority, setPriority] = useState<string>("")
    const [amount, setAmount] = useState<number>(0)
    

    const handleAddTask = () => {
        addTask(new Date(date), title, priority, amount)
        setDate("")
        setTitle("")
        setAmount(0)
        setPriority("")
    }

    const handleDeleteTask = (id: string) => {
        deleteTask(id)
    }

    const handleDeleteAll = () => {
        deleteAll()
    }

    // Edición de TAREA COMPLETA
    const [editId, setEditId] = useState<string | null>(null)
    const [editData, setEditData] = useState({
        date: "",
        title: '',
        priority: "",
        amount: 0
    })

    const handleEditTask = (task: ITask) => {
        setEditId(task._id)
        setEditData({
            date: task.date instanceof Date ? task.date.toISOString().split('T')[0] : task.date,
            title: Array.isArray(task.title) ? task.title.join(', ') : task.title,
            priority: Array.isArray(task.priority) ? task.priority.join(', ') : task.priority,
            amount: Array.isArray(task.amount) ? task.amount[0] : task.amount
        })
    }

    const handleSaveTask = (id: string) => {
        saveTask(id, {
            date: new Date(editData.date),
            // title: editData.title,
            // priority: editData.priority,
            // amount: editData.amount
        })
        setEditData({
            date: "",
            title: "",
            priority: "",
            amount: 0
        })
        setEditId(null)
    }

    const handleCancelEdit = () => {
        setEditData({
            date: "",
            title: "",
            priority: "",
            amount: 0
        })
        setEditId(null)
    }



    // Completar TODAS las subtareas
    const handleCompleteAllTasks = (taskId: string) => {
        completeAllSubTasks(taskId)
    }

    // Multiplicador
    const [multiplier, setMultiplier] = useState<number>(2)
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

    const handleMultiplyAmounts = () => {
        if (selectedTaskId) {
            multiplyAmounts(selectedTaskId, multiplier)
            setSelectedTaskId(null)
        }
    }

    const handleQuickMultiply = (taskId: string) => {
        multiplyAmounts(taskId, 2)
    }

    // Modal para nueva subtarea
    const [newItem, setNewItem] = useState({
        title: '',
        priority: 'media',
        amount: 0
    })
    const [showAddModal, setShowAddModal] = useState(false)
    const [selectTaskId, setSelectTaskId] = useState<string | null>(null)

    const handleAddItem = (taskId: string) => {
        setSelectTaskId(taskId)
        setShowAddModal(true)
    }

    const handleSaveNewItem = () => {
        if (!selectTaskId) {
            toast.error('No hay tarea seleccionada')
            return
        }
        
        if (!newItem.title.trim()) {
            toast.error('Ingresa un título')
            return
        }
        
        if (!newItem.priority.trim()) {
            toast.error('Selecciona una prioridad')
            return
        }
        
        if (newItem.amount <= 0) {
            toast.error('La cantidad debe ser mayor a 0')
            return
        }
        
        addNewTask(selectTaskId, newItem.title, newItem.priority, newItem.amount)
        
        setNewItem({ title: '', priority: 'media', amount: 0 })
        setShowAddModal(false)
        setSelectTaskId(null)
    }

    // Edición de subtarea individual
    const [editSubTaskId, setEditSubTaskId] = useState<{taskId: string, index: number} | null>(null)
    const [editSubTaskData, setEditSubTaskData] = useState({
        title: '',
        priority: '',
        amount: 0
    })

    const handleEditSubTask = (taskId: string, index: number) => {
        const task = tasks.find(t => t._id === taskId)
        if (!task) return
        
        setEditSubTaskId({ taskId, index })
        setEditSubTaskData({
            title: Array.isArray(task.title) && task.title[index] ? task.title[index] : '',
            priority: Array.isArray(task.priority) && task.priority[index] ? task.priority[index] : '',
            amount: Array.isArray(task.amount) && task.amount[index] ? task.amount[index] : 0
        })
    }

    const handleSaveSubTask = () => {
        if (!editSubTaskId) return
        
        editSubTask(editSubTaskId.taskId, editSubTaskId.index, editSubTaskData)
        setEditSubTaskId(null)
        setEditSubTaskData({ title: '', priority: '', amount: 0 })
    }

    const handleCancelSubTaskEdit = () => {
        setEditSubTaskId(null)
        setEditSubTaskData({ title: '', priority: '', amount: 0 })
    }

    // Completar/descompletar subtarea individual
    const handleCompleteSubTask = (taskId: string, index: number) => {
        toggleSubTaskComplete(taskId, index)
    }

    // Eliminar subtarea individual
    const handleDeleteSubTask = (taskId: string, index: number) => {
        if (window.confirm('¿Estás seguro de eliminar esta subtarea?')) {
            deleteSubTask(taskId, index)
        }
    }

    // Helper para manejar arrays
    const getTaskTitles = (task: ITask): string[] => {
        return Array.isArray(task.title) ? task.title : [task.title]
    }
    
    const getTaskPriorities = (task: ITask): string[] => {
        return Array.isArray(task.priority) ? task.priority : [task.priority]
    }
    
    const getTaskAmounts = (task: ITask): number[] => {
        return Array.isArray(task.amount) ? task.amount : [task.amount]
    }



    return (
        <div className="container-task">
            <div className="task-header">
                <h1>Gestor de Tareas</h1>
                <p className="subtitle">Total: {tasks.length} tarea(s)</p>
            </div>

            {/* Formulario para nueva tarea principal */}
            <div className="inputs-task">
                <div className="input-group">
                    <Calendar size={20} />
                    <input 
                        type="date" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                    />
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
                <div className="input-group">
                    <input 
                        type="number" 
                        placeholder="Cantidad"
                        value={amount} 
                        onChange={(e) => setAmount(Number(e.target.value))} 
                        min="0"
                    />
                </div>
                <button 
                    onClick={handleAddTask} 
                    className="btn-add"
                    disabled={!date || !title.trim() || !priority}
                >
                    <Plus size={20} />
                    Agregar Tarea
                </button>
            </div>

            {/* Modal para agregar subtarea */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Agregar Nueva Subtarea</h3>
                            <button 
                                onClick={() => setShowAddModal(false)}
                                className="modal-close"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-form">
                            <div className="form-group">
                                <label>Título *</label>
                                <input
                                    type="text"
                                    placeholder="Ej: Comprar huevos"
                                    value={newItem.title}
                                    onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                                    autoFocus
                                />
                            </div>
                            <div className="form-group">
                                <label>Prioridad *</label>
                                <select
                                    value={newItem.priority}
                                    onChange={(e) => setNewItem({...newItem, priority: e.target.value})}
                                >
                                    <option value="alta">Alta</option>
                                    <option value="media">Media</option>
                                    <option value="baja">Baja</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Cantidad *</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={newItem.amount}
                                    onChange={(e) => setNewItem({...newItem, amount: Number(e.target.value)})}
                                    min="0"
                                />
                            </div>
                            <div className="modal-actions">
                                <button 
                                    onClick={handleSaveNewItem}
                                    className="btn-primary"
                                    disabled={!newItem.title.trim() || newItem.amount <= 0}
                                >
                                    <Plus size={16} /> Agregar
                                </button>
                                <button 
                                    onClick={() => setShowAddModal(false)}
                                    className="btn-secondary"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para editar subtarea */}
            {editSubTaskId && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Editar Subtarea</h3>
                            <button 
                                onClick={handleCancelSubTaskEdit}
                                className="modal-close"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-form">
                            <div className="form-group">
                                <label>Título</label>
                                <input
                                    type="text"
                                    value={editSubTaskData.title}
                                    onChange={(e) => setEditSubTaskData({...editSubTaskData, title: e.target.value})}
                                    autoFocus
                                />
                            </div>
                            <div className="form-group">
                                <label>Prioridad</label>
                                <select
                                    value={editSubTaskData.priority}
                                    onChange={(e) => setEditSubTaskData({...editSubTaskData, priority: e.target.value})}
                                >
                                    <option value="alta">Alta</option>
                                    <option value="media">Media</option>
                                    <option value="baja">Baja</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Cantidad</label>
                                <input
                                    type="number"
                                    value={editSubTaskData.amount}
                                    onChange={(e) => setEditSubTaskData({...editSubTaskData, amount: Number(e.target.value)})}
                                    min="0"
                                />
                            </div>
                            <div className="modal-actions">
                                <button 
                                    onClick={handleSaveSubTask}
                                    className="btn-primary"
                                >
                                    <Save size={16} /> Guardar
                                </button>
                                <button 
                                    onClick={handleCancelSubTaskEdit}
                                    className="btn-secondary"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para editar tarea principal (si editId existe) */}
            {editId && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Editar Tarea Principal</h3>
                            <button 
                                onClick={handleCancelEdit}
                                className="modal-close"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-form">
                            <div className="form-group">
                                <label>Fecha</label>
                                <input
                                    type="date"
                                    value={editData.date}
                                    onChange={(e) => setEditData({...editData, date: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Título</label>
                                <input
                                    type="text"
                                    value={editData.title}
                                    onChange={(e) => setEditData({...editData, title: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Prioridad</label>
                                <select
                                    value={editData.priority}
                                    onChange={(e) => setEditData({...editData, priority: e.target.value})}
                                >
                                    <option value="alta">Alta</option>
                                    <option value="media">Media</option>
                                    <option value="baja">Baja</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Cantidad Principal</label>
                                <input
                                    type="number"
                                    value={editData.amount}
                                    onChange={(e) => setEditData({...editData, amount: Number(e.target.value)})}
                                    min="0"
                                />
                            </div>
                            <div className="modal-actions">
                                <button 
                                    onClick={() => handleSaveTask(editId)}
                                    className="btn-primary"
                                >
                                    <Save size={16} /> Guardar Cambios
                                </button>
                                <button 
                                    onClick={handleCancelEdit}
                                    className="btn-secondary"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Sección de multiplicador INDIVIDUAL */}
            <div className="multiply-section">
                <div className="multiply-container">
                    <div className="multiplier-input-group">
                        <label>Multiplicador:</label>
                        <input 
                            type="number" 
                            min="0.1"
                            step="0.1"
                            value={multiplier}
                            onChange={(e) => setMultiplier(Number(e.target.value))}
                            className="multiplier-input"
                            placeholder="Ej: 2"
                        />
                        <div className="multiplier-presets">
                            <button onClick={() => setMultiplier(2)}>x2</button>
                            <button onClick={() => setMultiplier(1.5)}>x1.5</button>
                            <button onClick={() => setMultiplier(0.5)}>x0.5</button>
                            <button onClick={() => setMultiplier(10)}>x10</button>
                        </div>
                    </div>
                    
                    <div className="multiply-specific">
                        <select 
                            value={selectedTaskId || ''}
                            onChange={(e) => setSelectedTaskId(e.target.value)}
                            className="task-select"
                        >
                            <option value="">Seleccionar tarea específica</option>
                            {tasks.map(task => {
                                const titles = getTaskTitles(task)
                                const amounts = getTaskAmounts(task)
                                const total = amounts.reduce((a, b) => a + b, 0)
                                return (
                                    <option key={task._id} value={task._id}>
                                        {titles[0] || 'Sin título'} (Actual: ${total.toLocaleString()})
                                    </option>
                                )
                            })}
                        </select>
                        
                        <button 
                            onClick={handleMultiplyAmounts} 
                            className="btn-multiply-custom"
                            disabled={!selectedTaskId}
                        >
                            <TrendingUp size={18} />
                            Multiplicar esta tarea x{multiplier}
                        </button>
                    </div>
                </div>
            </div>

            {/* Lista de tareas */}
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
                            <button 
                                onClick={handleDeleteAll} 
                                className="btn-delete-all"
                                disabled={tasks.length === 0}
                            >
                                <Trash2 size={18} />
                                Eliminar Todas ({tasks.length})
                            </button>
                        </div>

                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Subtareas</th>
                                        <th>Prioridades</th>
                                        <th>Cantidades</th>
                                        <th>Progreso</th>
                                        <th>Multi.</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map((task) => {
                                        const titles = getTaskTitles(task)
                                        const priorities = getTaskPriorities(task)
                                        const amounts = getTaskAmounts(task)
                                        const totalAmount = amounts.reduce((a, b) => a + b, 0)
                                        
                                        // Calcular progreso de subtareas
                                        const totalSubTasks = titles.length
                                        const completedSubTasks = task.subtaskCompleted?.filter(Boolean).length || 0
                                        const progressPercentage = totalSubTasks > 0 
                                            ? Math.round((completedSubTasks / totalSubTasks) * 100) 
                                            : 0
                                        
                                        return (
                                            <tr key={task._id} className={task.completed ? 'task-completed' : ''}>
                                                {/* FECHA */}
                                                <td>
                                                    <div 
                                                        className="task-date"
                                                        onClick={() => handleEditTask(task)}
                                                        style={{ cursor: 'pointer' }}
                                                        title="Click para editar"
                                                    >
                                                        {new Date(task.date).toLocaleDateString('es-ES')}
                                                    </div>
                                                </td>
                                                
                                                {/* SUBTAREAS - TÍTULOS */}
                                                <td className="task-subtasks">
                                                    {titles.length === 0 ? (
                                                        <span className="no-subtasks">Sin subtareas</span>
                                                    ) : (
                                                        <div className="subtasks-list">
                                                            {titles.map((titleItem, index) => {
                                                                const isSubTaskCompleted = task.subtaskCompleted?.[index] || false
                                                                return (
                                                                    <div 
                                                                        key={index} 
                                                                        className={`subtask-item ${isSubTaskCompleted ? 'subtask-completed' : ''}`}
                                                                    >
                                                                        {/* Checkbox individual */}
                                                                        <div className="subtask-checkbox-container">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={isSubTaskCompleted}
                                                                                onChange={() => handleCompleteSubTask(task._id, index)}
                                                                                className="subtask-checkbox"
                                                                                id={`subtask-${task._id}-${index}`}
                                                                            />
                                                                            <label 
                                                                                htmlFor={`subtask-${task._id}-${index}`}
                                                                                className="subtask-checkbox-label"
                                                                            >
                                                                                <span className="checkbox-custom"></span>
                                                                            </label>
                                                                        </div>
                                                                        
                                                                        {/* Contenido de la subtarea */}
                                                                        <div className="subtask-content">
                                                                            <span className="subtask-index">{index + 1}.</span>
                                                                            <span className="subtask-title">{titleItem}</span>
                                                                            
                                                                            {/* Estado visual */}
                                                                            {isSubTaskCompleted && (
                                                                                <span className="subtask-status-completed">
                                                                                    <CheckCircle size={14} />
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        
                                                                        {/* Acciones de la subtarea */}
                                                                        <div className="subtask-item-actions">
                                                                            <button
                                                                                onClick={() => handleEditSubTask(task._id, index)}
                                                                                className="btn-edit-subtask"
                                                                                title="Editar"
                                                                            >
                                                                                <Edit2 size={14} />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleDeleteSubTask(task._id, index)}
                                                                                className="btn-delete-subtask"
                                                                                title="Eliminar"
                                                                            >
                                                                                <Trash2 size={14} />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    )}
                                                    
                                                    {/* Botón para agregar subtarea */}
                                                    <button
                                                        onClick={() => handleAddItem(task._id)}
                                                        className="btn-add-subtask"
                                                    >
                                                        <Plus size={14} /> Agregar subtarea
                                                    </button>
                                                    
                                                    {/* Botón para completar TODAS las subtareas */}
                                                    {titles.length > 1 && completedSubTasks < totalSubTasks && (
                                                        <button
                                                            onClick={() => handleCompleteAllTasks(task._id)}
                                                            className="btn-complete-all-subtasks"
                                                            title="Marcar todas las subtareas como completadas"
                                                        >
                                                            <CheckSquare size={14} /> Completar todas
                                                        </button>
                                                    )}
                                                </td>
                                                
                                                {/* PRIORIDADES */}
                                                <td className="task-priorities">
                                                    {priorities.map((priorityItem, index) => {
                                                        const isSubTaskCompleted = task.subtaskCompleted?.[index] || false
                                                        return (
                                                            <div key={index} className="priority-item">
                                                                <span className={`priority-badge ${priorityItem} ${isSubTaskCompleted ? 'completed' : ''}`}>
                                                                    {priorityItem}
                                                                    {isSubTaskCompleted && (
                                                                        <span className="priority-check"> ✓</span>
                                                                    )}
                                                                </span>
                                                            </div>
                                                        )
                                                    })}
                                                </td>
                                                
                                                {/* CANTIDADES */}
                                                <td className="task-amounts">
                                                    <div className="amounts-list">
                                                        {amounts.map((amountItem, index) => {
                                                            const isSubTaskCompleted = task.subtaskCompleted?.[index] || false
                                                            return (
                                                                <div key={index} className={`amount-item ${isSubTaskCompleted ? 'amount-completed-item' : ''}`}>
                                                                    <span className="amount-value">${amountItem.toLocaleString()}</span>
                                                                    {isSubTaskCompleted && (
                                                                        <span className="amount-completed">✓</span>
                                                                    )}
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                    {amounts.length > 0 && (
                                                        <div className="amount-total">
                                                            <strong>Total: ${totalAmount.toLocaleString()}</strong>
                                                        </div>
                                                    )}
                                                </td>
                                                
                                                {/* PROGRESO */}
                                                <td className="task-progress">
                                                    {totalSubTasks > 0 ? (
                                                        <div className="progress-container">
                                                            <div className="progress-stats">
                                                                <span className="progress-text">
                                                                    {completedSubTasks}/{totalSubTasks}
                                                                </span>
                                                                <span className="progress-percentage">
                                                                    {progressPercentage}%
                                                                </span>
                                                            </div>
                                                            <div className="progress-bar">
                                                                <div 
                                                                    className="progress-fill" 
                                                                    style={{ width: `${progressPercentage}%` }}
                                                                ></div>
                                                            </div>
                                                            <div className="progress-status">
                                                                {progressPercentage === 100 ? (
                                                                    <span className="status-complete">✓ Completado</span>
                                                                ) : progressPercentage > 0 ? (
                                                                    <span className="status-in-progress">En progreso</span>
                                                                ) : (
                                                                    <span className="status-pending">Pendiente</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="no-progress">Sin subtareas</span>
                                                    )}
                                                </td>
                                                
                                                {/* MULTIPLICAR RÁPIDO (x2) */}
                                                <td>
                                                    <button 
                                                        onClick={() => handleQuickMultiply(task._id)}
                                                        className="btn-multiply-row"
                                                        title="Duplicar todas las cantidades de esta tarea"
                                                        disabled={amounts.length === 0}
                                                    >
                                                        <TrendingUp size={16} /> x2
                                                    </button>
                                                </td>
                                                
                                                {/* ACCIONES DE TAREA PRINCIPAL */}
                                                <td>
                                                    <div className="task-main-actions">
                                                        {/* Checkbox para tarea principal */}
                                                        <div className="task-main-checkbox">
                                                            {/* <input
                                                                type="checkbox"
                                                                checked={task.completed || false}
                                                                onChange={() => handleCompletedTask(task._id, !task.completed)}
                                                                id={`task-main-${task._id}`}
                                                                className="task-main-checkbox-input"
                                                            /> */}
                                                            <label 
                                                                htmlFor={`task-main-${task._id}`}
                                                                className="task-main-checkbox-label"
                                                                title={task.completed ? "Marcar como pendiente" : "Completar toda la tarea"}
                                                            >
                                                                <span className="task-checkbox-custom"></span>
                                                                <span className="task-checkbox-text">
                                                                    {task.completed ? "Completada" : "Pendiente"}
                                                                </span>
                                                            </label>
                                                        </div>
                                                        
                                                        <div className="task-main-buttons">
                                                            {/* Botón editar tarea principal */}
                                                            <button 
                                                                onClick={() => handleEditTask(task)} 
                                                                className="btn-edit-main"
                                                                title="Editar tarea principal"
                                                            >
                                                                <Edit2 size={16} />
                                                            </button>
                                                            
                                                            {/* Botón eliminar */}
                                                            <button 
                                                                onClick={() => handleDeleteTask(task._id)} 
                                                                className="btn-delete-main"
                                                                title="Eliminar tarea completa"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}