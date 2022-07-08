const { User, Note, Project, Shop } = require('../models');
const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        return res.status(201).json({
            user,
        });
    } catch (error) {
        console.log(" :: ERR :: ", { ...error });
        return res.status(500).json({ error: error.message })
    }
}


const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: {exclude: ['token', 'role']},
            include: [
                {
                    model: Note,
                    as: 'notes',
                    attributes: { exclude: ['ownerId'] }
                },
                {
                    model: Project,
                    as: 'Projects'
                },
                {
                    model: Shop,
                    as: 'shop',
                    attributes: { exclude: ['shopOwnerId'] }

                },
            ]
        })

        return res.json({ users })
    } catch (error) {
        console.log(" :: ERR :: ", { ...error });
        return res.status(500).send(error.message);
    }
}
const getUserById = async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.params.id } })

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        // const notes = await user.getNotes()
        return res.json({
            user,
            // notes 
        })
    } catch (error) {
        console.log(" :: ERR :: ", { ...error });
        return res.status(500).send(error.message);
    }
}

const getUser = async (id) => {
    try {
        const users = await User.findOne({
            where: {
                id: id
            }
        })

        return users.dataValues
    } catch (error) {
        return error;
    }
}

const editUser = async (req, res) => {
    try {
        const updatedUser = await User.update(req.body, {
            where: {
                id: req.params.id
            }
        })
        if (!updatedUser[0]) {
            return res.status(400).json({ message: "No records were affected." })
        }
        console.log(" :: INFO :: ", updatedUser);
        res.json({ message: "Record updated successfully." })
    } catch (error) {
        console.log(" :: ERR :: ", { ...error });
        return res.status(500).send(error.message);
    }
}

const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.destroy({
            where: {
                id: req.params.id
            }
        })
        console.log(" :: INFO :: ", deletedUser);
        if (deletedUser === 0) {
            return res.status(400).json({ message: "No records were affected." })
        }
        res.json({ message: "Record deleted successfully." })
    } catch (error) {
        console.log(" :: ERR :: ", { ...error });
        return res.status(500).send(error.message);
    }
}


// ======================================
const getUsersShop = async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.params.id } })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        const shop = await user.getShop();
        return res.json({
            shop,
        })
    } catch (error) {
        console.log(" :: ERR :: ", { ...error });
        return res.status(500).send(error.message);
    }
}

const getUsersNotes = async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.params.id } })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        const notes = await user.getNotes();
        return res.json({
            notes,
        })
    } catch (error) {
        console.log(" :: ERR :: ", { ...error });
        return res.status(500).send(error.message);
    }
}

const getUsersProjects = async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.params.id } })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        const projects = await user.getProjects();
        return res.json({
            projects,
        })
    } catch (error) {
        console.log(" :: ERR :: ", { ...error });
        return res.status(500).send(error.message);
    }
}

module.exports = {
    createUser,
    getAllUsers,
    editUser,
    deleteUser,
    getUser,
    getUserById,
    //  ------------
    getUsersShop,
    getUsersNotes,
    getUsersProjects,
}