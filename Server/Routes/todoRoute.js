const express = require('express')
const { getTask, addTask, deleteTask, deleteAll, saveTask, completedTask, multipliAmounts,  } = require('../Controllers/todoController')
const router = express.Router()

router.get('/task', getTask)
router.post('/task', addTask)
router.delete('/task/:id', deleteTask)
router.delete('/task', deleteAll)
router.patch('/task/:id', saveTask)
router.patch('/task/:id/completed', completedTask)
router.patch('/task/:id/multiply', multipliAmounts)

module.exports = router
