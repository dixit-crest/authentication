const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CONSTANTS = require('../config/constants');
const { User, Project, Shop } = require('../models');
const { messages } = require('../util/messages');

const createShop = async (req, res) => {
    try {
        const shop = await Shop.create({ ...req.body, shopOwnerId: req.user.id })
        console.log(shop.dataValues);
        res.json({ shop })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getAllShops = async (req, res) => {

    const filter = {
        limit: 10,
        offset: 0,
        page: 1,
        ...req.body.filter || {},
    }
    try {
        const { count, rows: shops } = await Shop.findAndCountAll({
            attributes: { exclude: ['shopOwnerId'] },
            include: { model: User, as: 'shopOwner', attributes: ['id', 'firstName', 'lastName', 'email'] },
            ...filter
        })
        // const user = await User.getNote()
        console.log(" :: info :: ", JSON.parse(JSON.stringify(shops)));
        res.json({ shops, totalNotes: count });
    } catch (error) {
        console.log(" :: error :: ", error);
        res.status(500).json({ message: error.message })
    }
}


const getSingleNote = async (req, res) => {
    try {
        const shop = await Shop.findOne({ where: { id: req.params.id }, include: User });
        console.log(" :: INFO :: ", Shop.dataValues);
        res.json({ shop: shop.dataValues, ...messages.DATA_RETRIEVED });
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
        const updatedNote = await Shop.update(req.body, {
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

const deleteShop = async (req, res) => {
    try {
        const deletedShop = await Shop.destroy({
            where: {
                id: req.params.id
            }
        })
        console.log(" :: INFO :: ", deletedShop);
        if (deletedShop === 0) {
            return res.status(400).json({ message: "No records were affected." })
        }
        res.json({ message: "Record deleted successfully." })
    } catch (error) {
        console.log(" :: ERR :: ", { ...error });
        return res.status(500).send(error.message);
    }
}

module.exports = {
    createShop,
    getAllShops,
    getSingleNote,
    editNote,
    deleteShop,
    getUsersAndNoes
}