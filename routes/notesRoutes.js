const { Router } = require('express');
const passport = require('passport');
const notesController = require('../controllers/notesController');
const notesRoutes = Router();


notesRoutes.post('/', passport.authenticate('jwt', { session: false }), notesController.createNote)

notesRoutes.get('/', passport.authenticate('jwt', { session: false }),notesController.getAllNotes)

notesRoutes.get('/user/:id', passport.authenticate('jwt', { session: false }), notesController.getUsersAndNoes)

notesRoutes.put('/:id', passport.authenticate('jwt', { session: false }), notesController.editNote)

notesRoutes.delete('/:id', passport.authenticate('jwt', { session: false }), notesController.deleteNote)

module.exports = notesRoutes