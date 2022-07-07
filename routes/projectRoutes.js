const { Router } = require('express');
const passport = require('passport');
const CONSTANTS = require('../config/constants');
const projectControllers = require('../controllers/projectController');
const { checkPermission } = require('../middlewares/auth');
const projectRoutes = Router();


projectRoutes.post('/', [passport.authenticate('jwt', { session: false }), checkPermission(CONSTANTS.ROLES.ADMIN)], projectControllers.createProject)

projectRoutes.get('/', [passport.authenticate('jwt', { session: false }), checkPermission(CONSTANTS.ROLES.ADMIN)], projectControllers.getAllProjects)

projectRoutes.get('/:id', [passport.authenticate('jwt', { session: false }), checkPermission(CONSTANTS.ROLES.ADMIN)], projectControllers.getSingleProject)

projectRoutes.put('/:id', [passport.authenticate('jwt', { session: false }), checkPermission(CONSTANTS.ROLES.ADMIN)], projectControllers.editProject)

projectRoutes.delete('/:id', [passport.authenticate('jwt', { session: false }), checkPermission(CONSTANTS.ROLES.ADMIN)], projectControllers.deleteProject)

module.exports = projectRoutes