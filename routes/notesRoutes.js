const { Router } = require('express');
const passport = require('passport');
const CONSTANTS = require('../config/constants');
const notesController = require('../controllers/notesController');
const { verifyToken, checkPermission, isAdmin, isUser } = require('../middlewares/auth');
const notesRoutes = Router();


notesRoutes.post('/', [passport.authenticate('jwt', { session: false }), checkPermission(CONSTANTS.ROLES.USER)], notesController.createNote)

notesRoutes.get('/', [passport.authenticate('jwt', { session: false }), checkPermission(CONSTANTS.ROLES.USER)], notesController.getAllNotes)

notesRoutes.get('/user/:id', [passport.authenticate('jwt', { session: false }), checkPermission(CONSTANTS.ROLES.USER)], notesController.getUsersAndNoes)

notesRoutes.put('/:id', [passport.authenticate('jwt', { session: false }), checkPermission(CONSTANTS.ROLES.USER)], notesController.editNote)

notesRoutes.delete('/:id', [passport.authenticate('jwt', { session: false }), checkPermission(CONSTANTS.ROLES.USER)], notesController.deleteNote)

module.exports = notesRoutes