// import controllers
const userController = require('../controllers/user.controller')


// router
const router = require('express').Router()


// use routers
router.post('/register', userController.registerUser)
router.post('/login', userController.loginUser)
router.get('/get', userController.ensureToken, userController.getOneUser)
router.put('/update/:id', userController.ensureToken, userController.updateUser)
router.put('/update-password/:id', userController.ensureToken, userController.updatePassword)



module.exports = router