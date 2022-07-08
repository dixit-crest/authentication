const { Router } = require('express');
const passport = require('passport');
const CONSTANTS = require('../config/constants');
const userControllers = require('../controllers/userControllers');
const { checkPermission } = require('../middlewares/auth');
const userRouter = Router();

userRouter.post('/', [passport.authenticate('jwt', { session: false }), checkPermission(CONSTANTS.ROLES.USER)], userControllers.createUser)

userRouter.get('/', [passport.authenticate('jwt', { session: false }), checkPermission(CONSTANTS.ROLES.USER)], userControllers.getAllUsers)

userRouter.get('/:id', [passport.authenticate('jwt', { session: false }), checkPermission(CONSTANTS.ROLES.USER)], userControllers.getUserById)

userRouter.put('/:id', [passport.authenticate('jwt', { session: false }), checkPermission(CONSTANTS.ROLES.USER)], userControllers.editUser)

userRouter.delete('/:id', [passport.authenticate('jwt', { session: false }), checkPermission(CONSTANTS.ROLES.USER)], userControllers.deleteUser)

// OTHER ENTITIES

userRouter.get('/:id/shop', [passport.authenticate('jwt', { session: false }), checkPermission(CONSTANTS.ROLES.USER)], userControllers.getUsersShop)

userRouter.get('/:id/notes', [passport.authenticate('jwt', { session: false }), checkPermission(CONSTANTS.ROLES.USER)], userControllers.getUsersNotes)

userRouter.get('/:id/projects', [passport.authenticate('jwt', { session: false }), checkPermission(CONSTANTS.ROLES.USER)], userControllers.getUsersProjects)

module.exports = userRouter