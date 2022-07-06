const { Router } = require('express');
const authControllers = require('../controllers/authController');
const authRouter = Router();

authRouter.post('/signin', authControllers.signin)

authRouter.post('/signup', authControllers.signup)

module.exports = authRouter