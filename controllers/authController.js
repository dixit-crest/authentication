const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CONSTANTS = require('../config/constants');
const { User } = require('../models');

const signup = async (req, res) => {

    try {
        const { email, password } = req.body;
        if (!(email && password)) {
            return res.json({ message: "Please provide email and password" })
        }

        // if user already exists 
        const user = await User.findOne({ where: { email: email } });
        if (user) {
            return res.status(400).json({ message: "Account with this email already exists." })
        }

        const userObj = { ...req.body }
        userObj.password = bcryptjs.hashSync(password, 8)
        userObj.token = ""
        const createdUser = await User.create(userObj)

        res.json({ user: createdUser })
    } catch (error) {
        console.log({ ...error });
        return res.status(500).json({ error: error.message })
    }
}


const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // empty request body
        if (!(email && password)) {
            return res.json({ message: "Please provide email and password" })
        }

        // if user already exists 
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return res.status(400).json({ message: "Wrong credentials." })
        }


        console.log(user.dataValues);

        if (user && user.dataValues) {
            let isPasswordValid = bcryptjs.compare(email, user.dataValues.password)
            if (!isPasswordValid) return res.json({ message: "Wrong credentials.", token: null })

            let token = jwt.sign({ id: user.dataValues.id, email: user.dataValues.email }, CONSTANTS.PASSWORD_HASH, {
                expiresIn: "7days"
            })
            const newObj = { ...user, token }
            await User.update({ ...newObj }, {
                where: {
                    id: user.dataValues.id
                }
            })

            return res.json({ user: newObj.dataValues })
        }
        return res.json({ user })
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

module.exports = {
    signin,
    signup,
}