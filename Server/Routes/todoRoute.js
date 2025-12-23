const express = require('express')
const { getTask, addTask, deleteTask, deleteAll, saveTask, completeAllSubTasks,addMoreTask, editSubTask, deleteSubTask, toggleSubTaskComplete, multiplyTaskAmounts } = require('../Controllers/todoController')
const router = express.Router()

router.get('/task', getTask)
router.post('/task', addTask)
router.post('/task/:id/addtask', addMoreTask)
router.delete('/task/:id', deleteTask)
router.delete('/task', deleteAll)
router.patch('/task/:id', saveTask)
router.patch('/task/:id/subtasks/:subTaskIndex/toggle', toggleSubTaskComplete)
router.patch('/task/:id/complete-all', completeAllSubTasks)
router.patch('/task/:id/multiply', multiplyTaskAmounts)
router.patch('/task/:id/subtasks/:subTaskIndex', editSubTask);
router.patch('/task/:id/subtasks/:subTaskIndex/toggle', toggleSubTaskComplete);
router.delete('/task/:id/subtasks/:subTaskIndex', deleteSubTask);



module.exports = router
