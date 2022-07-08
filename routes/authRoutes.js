const { Router } = require('express');
const passport = require('passport');
const CONSTANTS = require('../config/constants');
const authControllers = require('../controllers/authController');
const { checkPermission } = require('../middlewares/auth');
const authRouter = Router();

authRouter.post('/signin', authControllers.signin)

authRouter.post('/signup', authControllers.signup)

authRouter.get('/confirm-email/:confirmEmailToken', authControllers.confirmEmail)

authRouter.get('/request-reset-password', [passport.authenticate('jwt', { session: false }), checkPermission(CONSTANTS.ROLES.USER)], authControllers.reuestResetPasswords)

authRouter.get('/reset-password/:resetPasswordToken',  authControllers.resetPasswords)

module.exports = authRouter