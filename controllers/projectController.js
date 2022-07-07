const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CONSTANTS = require('../config/constants');
const { User, Project } = require('../models');
const { messages } = require('../util/messages');

const createProject = async (req, res) => {
    try {
        const project = await Project.create({ ...req.body })
        const user = await User.findOne({ where: { id: req.user.id } })
        await project.addUser(user)

        console.log(project.dataValues);
        res.json({ ...messages.RECORD_CREATED, project })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}



const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.findAll({ include: User })
        // const user = await User.getNote()
        console.log(" :: info :: ", [...projects]);
        res.json({ project: projects });
    } catch (error) {
        console.log(" :: error :: ", error);
        res.status(500).json({ message: error.message })
    }
}


const getSingleProject = async (req, res) => {
    try {
        const project = await Project.findOne({ where: { id: req.params.id }, include: User});
        console.log( " :: INFO :: ", project.dataValues);
        res.json({ project: project.dataValues, ...messages.DATA_RETRIEVED  });
    } catch (error) {
        console.log(" :: error :: ", error);
        res.status(500).json({ message: error.message })
    }
}

const editProject = async (req, res) => {
    try {
        const updatedProject = await Project.update(req.body, {
            where: {
                id: req.params.id
            }
        })
        if (!updatedProject[0]) {
            return res.status(400).json({ message: "No records were affected." })
        }
        console.log(" :: INFO :: ", updatedProject);
        res.json({ message: messages.DATA_UPDATED })
    } catch (error) {
        console.log(" :: ERR :: ", { ...error });
        return res.status(500).send(error.message);
    }
}

const deleteProject = async (req, res) => {
    try {
        const deletedProject = await Project.destroy({
            where: {
                id: req.params.id
            }
        })
        console.log(" :: INFO :: ", deletedProject);
        if (deletedProject === 0) {
            return res.status(400).json({ message: "No records were affected." })
        }
        res.json({ message: "Record deleted successfully." })
    } catch (error) {
        console.log(" :: ERR :: ", { ...error });
        return res.status(500).send(error.message);
    }
}

module.exports = {
    createProject,
    getAllProjects,
    getSingleProject,
    editProject,
    deleteProject
}