const { User } = require('../models');
const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        return res.status(201).json({
            user,
        });
    } catch (error) {
        console.log({ ...error });
        return res.status(500).json({ error: error.message })
    }
}


const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            // include: [{
            //     model: Project
            // }]
        })

        return res.json({ users })
    } catch (error) {
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
        return res.status(500).send(error.message);
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




// ----------------
const allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};
const userBoard = (req, res) => {
    res.status(200).send("User Content.");
};
const adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};
const moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
};
module.exports = {
    createUser,
    getAllUsers,
    editUser,
    deleteUser,
    getUser,
    // ---------
    allAccess, userBoard, adminBoard, moderatorBoard
}