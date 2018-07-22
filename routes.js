const express = require('express')
const router = express.Router()

const auth = require('./middlewares/auth')
const AuthController = require('./app/controllers/AuthController')
const UserController = require('./app/controllers/UserController')

router.post('/auth/register', AuthController.create)
router.post('/auth/login', AuthController.login)
router.post('/auth/forgot_password', AuthController.forgotPassword)
router.post('/auth/reset_password', AuthController.resetPassword)

router.get('/users', auth, UserController.index)
router.get('/users/:user_id', auth, UserController.show)
router.put('/users/:user_id', auth, UserController.update)
router.put('/users', auth, UserController.update)
router.delete('/users/:user_id', auth, UserController.destroy)

module.exports = router
