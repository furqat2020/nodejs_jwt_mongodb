const express = require('express'),
route = express.Router()

const userController = require('../controllers/userController')

route.post('/get_access_refresh_token', userController.signup)
route.post('/refresh_token', userController.refToken)
route.get('/check_user', userController.authenticateToken, userController.check_auth)

module.exports = route