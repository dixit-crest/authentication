const { Router } = require('express');
const passport = require('passport');
const CONSTANTS = require('../config/constants');
const userControllers = require('../controllers/userControllers');
const { checkPermission } = require('../middlewares/auth');
const userRouter = Router();

userRouter.post('/', [passport.authenticate('jwt', { session: false }), checkPermission(CONSTANTS.ROLES.ADMIN)], userControllers.createUser)

userRouter.get('/', [passport.authenticate('jwt', { session: false }), checkPermission(CONSTANTS.ROLES.ADMIN)], userControllers.getAllUsers)

userRouter.get('/:id', [passport.authenticate('jwt', { session: false }), checkPermission(CONSTANTS.ROLES.ADMIN)], userControllers.getUserById)

userRouter.put('/:id', [passport.authenticate('jwt', { session: false }), checkPermission(CONSTANTS.ROLES.ADMIN)], userControllers.editUser)

userRouter.delete('/:id', [passport.authenticate('jwt', { session: false }), checkPermission(CONSTANTS.ROLES.ADMIN)], userControllers.deleteUser)

module.exports = userRouter