// import controllers
const todoController = require('../controllers/todo.controller')


// router
const router = require('express').Router()


// use routers
router.post('/', todoController.ensureToken, todoController.addTodo)
router.get('/', todoController.ensureToken, todoController.getAllTodos)
router.get('/:id', todoController.ensureToken, todoController.getOneTodo)
router.put('/:id', todoController.ensureToken, todoController.updateTodo)
router.put('/status/:id', todoController.ensureToken, todoController.updateTodoStatus)
router.delete('/:id', todoController.ensureToken, todoController.deleteTodo)



module.exports = router