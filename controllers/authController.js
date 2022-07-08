const bcryptjs = require('bcryptjs');
const { request } = require('express');
const jwt = require('jsonwebtoken');
const CONSTANTS = require('../config/constants');
const sendMail = require('../emails');
const { getRegistrationMail, resetPasswordEmail } = require('../emails/templates');
const { User } = require('../models');
const { messages, EMAIL } = require('../util/messages');
require('dotenv').config()

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


        let confirmEmailToken = jwt.sign({ email: userObj.email }, CONSTANTS.PASSWORD_HASH, {
            expiresIn: "1days"
        })

        sendMail({
            subject: EMAIL.CONFIRM_EMAIL.SUBJECT,
            to: userObj.email,
            html: getRegistrationMail({ ...userObj, confirmEmailLink: `${process.env.LOCALHOST}/api/auth/confirm-email/${confirmEmailToken}` })
        })

        userObj.password = bcryptjs.hashSync(password, 8)
        userObj.confirmEmailToken = confirmEmailToken
        userObj.token = ""
        const createdUser = await User.create(userObj)
        res.user = createdUser
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
            await User.update({ token: token }, {
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

const confirmEmail = async (req, res) => {
    try {
        const { confirmEmailToken } = req.params
        const decoded = jwt.verify(confirmEmailToken, CONSTANTS.PASSWORD_HASH)
        const user = await User.findOne({ where: { email: decoded.email } })
        if (!user) {
            return res.status(400).json({ message: "This link has been expired. Please try again" })
        }
        await User.update({ confirmEmailToken: null }, {
            where: { email: user.email },
        })
        res.send("Email verifed successfully")
    } catch (error) {
        res.status(500).json({ ...messages.SERVER_ERRPR })
    }
}

const resetPasswords = async (req, res) => {
    try {
        const { resetPasswordToken } = req.params
        const decoded = jwt.verify(resetPasswordToken, CONSTANTS.PASSWORD_HASH)

        const user = await User.findOne({ where: { email: decoded.email } })

        if (!user) {
            return res.status(400).send("This link has been expired. Please try again")
        }
        await User.update({ resetPasswordToken: null }, {
            where: { email: user.email },
        })
        res.send("Please go on and enter your new password")
    } catch (error) {
        res.status(500).send({ ...messages.SERVER_ERRPR })
    }
}

const reuestResetPasswords = async (req, res) => {
    try {
        let resetPasswordToken = jwt.sign({ email: req.user.email }, CONSTANTS.PASSWORD_HASH, {
            expiresIn: "1days"
        })
        const user = await User.update({ resetPasswordToken: resetPasswordToken }, { where: { email: req.user.email } })
        if (!user) {
            return res.status(401).json({ message: "Something went wrong" })
        }
        sendMail({
            subject: EMAIL.RESET_PASSWORD.SUBJECT,
            to: req.user.email,
            html: resetPasswordEmail({ ...req.user, resetPasswordLink: `${process.env.LOCALHOST}/api/auth/reset-password/${resetPasswordToken}` })
        })
        res.json({ message: "Please check your email" })
    } catch (error) {
        res.status(500).send({ ...messages.SERVER_ERRPR })
    }
}

module.exports = {
    signin,
    signup,
    confirmEmail,
    resetPasswords,
    reuestResetPasswords
}