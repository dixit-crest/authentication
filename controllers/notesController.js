const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op, QueryTypes } = require('sequelize');
const CONSTANTS = require('../config/constants');
const { User, Project, Note, sequelize } = require('../models');
const { getFilter } = require('../util');
const { messages } = require('../util/messages');

const createNote = async (req, res) => {
    try {
        const note = await Note.create({ ...req.body, ownerId: req.user.id })
        console.log(note.dataValues);
        res.json({ note })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getAllNotes = async (req, res) => {

    const filters = getFilter(req.body.filter || {})

    try {
        // const notes = await sequelize.query('SELECT * FROM notes ORDER BY notes.createdAt DESC', {
        //     type: QueryTypes.SELECT
        // })
        // const count = 0
        const { count, rows: notes } = await Note.findAndCountAll({
            include: { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
            ...filters
        })
        // const user = await User.getNote()
        console.log(" :: info :: ", JSON.stringify(notes, null, 2));
        res.json({ notes, resultsRetrived: count });
    } catch (error) {
        console.log(" :: error :: ", error);
        res.status(500).json({ message: error.message })
    }
}


const getSingleNote = async (req, res) => {
    try {
        const note = await Note.findOne({ where: { id: req.params.id }, include: User });
        console.log(" :: INFO :: ", Note.dataValues);
        res.json({ note: note.dataValues, ...messages.DATA_RETRIEVED });
    } catch (error) {
        console.log(" :: error :: ", error);
        res.status(500).json({ message: error.message })
    }
}

const getUsersAndNoes = async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.params.id }, include: ['notes'] })
        console.log(user.dataValues);
        res.json({ user: user.dataValues });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const editNote = async (req, res) => {
    try {
        const updatedNote = await Note.update(req.body, {
            where: {
                id: req.params.id
            }
        })
        if (!updatedNote[0]) {
            return res.status(400).json({ message: "No records were affected." })
        }
        console.log(" :: INFO :: ", updatedNote);
        res.json({ message: messages.DATA_UPDATED })
    } catch (error) {
        console.log(" :: ERR :: ", { ...error });
        return res.status(500).send(error.message);
    }
}

const deleteNote = async (req, res) => {
    try {
        const deletedNote = await Note.destroy({
            where: {
                id: req.params.id
            }
        })
        console.log(" :: INFO :: ", deletedNote);
        if (deletedNote === 0) {
            return res.status(400).json({ message: "No records were affected." })
        }
        res.json({ message: "Record deleted successfully." })
    } catch (error) {
        console.log(" :: ERR :: ", { ...error });
        return res.status(500).send(error.message);
    }
}

module.exports = {
    createNote,
    getAllNotes,
    getSingleNote,
    editNote,
    deleteNote,
    getUsersAndNoes
}