const { Router } = require('express');
const passport = require('passport');
const CONSTANTS = require('../config/constants');
const shopsController = require('../controllers/shopsControllers');
const { checkPermission } = require('../middlewares/auth');
const shopsRoutes = Router();


shopsRoutes.post('/', [passport.authenticate('jwt', { session: false }), checkPermission(CONSTANTS.ROLES.USER)], shopsController.createShop)

shopsRoutes.get('/', [passport.authenticate('jwt', { session: false }), checkPermission(CONSTANTS.ROLES.USER)], shopsController.getAllShops)

shopsRoutes.get('/user/:id', [passport.authenticate('jwt', { session: false }), checkPermission(CONSTANTS.ROLES.USER)], shopsController.getUsersAndNoes)

shopsRoutes.put('/:id', [passport.authenticate('jwt', { session: false }), checkPermission(CONSTANTS.ROLES.USER)], shopsController.editNote)

shopsRoutes.delete('/:id', [passport.authenticate('jwt', { session: false }), checkPermission(CONSTANTS.ROLES.USER)], shopsController.deleteShop)

module.exports = shopsRoutes