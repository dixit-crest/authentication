const { Router } = require('express');
const userControllers = require('../controllers/userControllers');
const { verifyToken } = require('../middlewares/auth');
const userRouter = Router();

userRouter.post('/', [verifyToken], userControllers.createUser)

userRouter.get('/', [verifyToken], userControllers.getAllUsers)

userRouter.put('/:id', [verifyToken], userControllers.editUser)

userRouter.delete('/:id', [verifyToken], userControllers.deleteUser)

module.exports = userRouter