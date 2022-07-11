const { Router } = require('express');
const authControllers = require('../controllers/authController');
const authRouter = Router();

authRouter.post('/signin', authControllers.signin)

authRouter.post('/signup', authControllers.signup)

authRouter.get('/confirm-email/:confirmEmailToken', authControllers.confirmEmail)

authRouter.post('/request-reset-password', authControllers.reuestResetPasswords)

authRouter.get('/reset-password/:resetPasswordToken',  authControllers.resetPasswords)

authRouter.post('/set-new-password',  authControllers.setNewPassword)

module.exports = authRouter