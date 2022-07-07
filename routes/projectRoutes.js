const { Router } = require('express');
const passport = require('passport');
const projectControllers = require('../controllers/projectController');
const projectRoutes = Router();


projectRoutes.post('/', passport.authenticate('jwt', { session: false }), projectControllers.createProject)

projectRoutes.get('/', passport.authenticate('jwt', { session: false }), projectControllers.getAllProjects)

projectRoutes.get('/:id', passport.authenticate('jwt', { session: false }), projectControllers.getSingleProject)

projectRoutes.put('/:id', passport.authenticate('jwt', { session: false }), projectControllers.editProject)

projectRoutes.delete('/:id', passport.authenticate('jwt', { session: false }), projectControllers.deleteProject)

module.exports = projectRoutes