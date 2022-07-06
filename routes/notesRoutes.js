const { Router } = require('express');
const passport = require('passport');
const userControllers = require('../controllers/userControllers');
const { User, Note } = require('../models');
const notesRoutes = Router();


notesRoutes.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const note = await Note.create({ ...req.body, ownerId: req.user.id })
        console.log(note.dataValues);
        res.json({ note })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
notesRoutes.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = await User.findAll({ include: ['notes'] })
        // const user = await User.getNote()
        console.log(" :: info :: ", [...user]);
        res.json({ user });
    } catch (error) {
        console.log(" :: error :: ", error);
        res.status(500).json({ message: error.message })
    }
})

notesRoutes.get('/user/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.params.id }, include: ['notes'] })
        console.log(user.dataValues);
        res.json({ user: user.dataValues });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

notesRoutes.put('/:id', passport.authenticate('jwt', { session: false }), userControllers.editUser)

notesRoutes.delete('/:id', passport.authenticate('jwt', { session: false }), userControllers.deleteUser)

module.exports = notesRoutes