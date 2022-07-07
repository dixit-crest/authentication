const { Router } = require('express');
const passport = require('passport');
const userControllers = require('../controllers/userControllers');
const userRouter = Router();

userRouter.post('/', passport.authenticate('jwt', { session: false }), userControllers.createUser)

userRouter.get('/', passport.authenticate('jwt', { session: false }), userControllers.getAllUsers)

userRouter.get('/:id', passport.authenticate('jwt', { session: false }), userControllers.getUserById)

userRouter.put('/:id', passport.authenticate('jwt', { session: false }), userControllers.editUser)

userRouter.delete('/:id', passport.authenticate('jwt', { session: false }), userControllers.deleteUser)

module.exports = userRouter