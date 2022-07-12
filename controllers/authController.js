const bcryptjs = require('bcryptjs');
const { request } = require('express');
const jwt = require('jsonwebtoken');
const CONSTANTS = require('../config/constants');
const sendMail = require('../emails');
const { getRegistrationMail, resetPasswordEmail } = require('../emails/templates');
const { User } = require('../models');
const { messages, EMAIL } = require('../util/messages');
const emailChacker =require('deep-email-validator')

require('dotenv').config()

const signup = async (req, res) => {

    try {
        const { email, password } = req.body;
        if (!(email && password)) {
            return res.status(400).json({ message: "Please provide email and password" })
        }

        const validatinEmail = await emailChacker.validate(email)

        // is valid email
        if(!validatinEmail.valid) {
            return res.status(400).json({ message: "Please check your email and try again." })
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
        res.json({ user: createdUser, ...messages.ACCOUNT_CREATED })
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
            return res.status(400).json({ message: "Please provide email and password" })
        }

        // if user already exists 
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return res.status(400).json({ message: "Wrong credentials." })
        }


        console.log(user.dataValues);

        if (user && user.dataValues) {
            let isPasswordValid = await bcryptjs.compare(password, user.dataValues.password)
            if (!isPasswordValid) return res.status(400).json({ message: "Wrong credentials.", token: null })

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
        res.redirect(CONSTANTS.FRONT_BASE_URL + '/login')
    } catch (error) {
        res.status(500).json({ ...messages.SERVER_ERROR })
    }
}

const resetPasswords = async (req, res) => {
    try {
        const { resetPasswordToken } = req.params

        let decoded = null
        try {
            decoded = jwt.verify(resetPasswordToken, CONSTANTS.PASSWORD_HASH)

        } catch (err) {
            console.log("  :: err ::", err);

            res.send("Your password reset link has ben expired, Please regenerate the link... Redicting you in a minute")
            
            return setTimeout(() => {
                return res.redirect(CONSTANTS.FRONT_BASE_URL + "/login")
            }, 1000 * 60)
            // return res.send(`<a href="${CONSTANTS.BACK_BASE_URL}/api/auth/request-reset-password"}>Click here to generate new reset password link</a>`)
        }

        const user = await User.findOne({ where: { email: decoded.email } })

        if (!user) {
            return res.status(400).send("This link has been expired. Please try again")
        }
        res.redirect(CONSTANTS.FRONT_BASE_URL + "/reset-password/" + resetPasswordToken)
    } catch (error) {
        console.log("  ::error:: ", error);
        res.status(500).send({ ...messages.SERVER_ERROR })
    }
}

const setNewPassword = async (req, res) => {
    try {
        let password = bcryptjs.hashSync(req.body.password, 8)
        const user = await User.update({ password: password }, { where: { email: req.body.email } })

        if (!user) {
            return res.status(400).send("This link has been expired. Please try again")
        }

        await User.update({ resetPasswordToken: null }, {
            where: { email: req.body.email },
        })
        res.status(200).json({ message: 'Success! password has been updated successfully.' })
    } catch (error) {
        console.log("  ::error:: ", error);
        res.status(500).send({ ...messages.SERVER_ERROR })
    }
}

const reqestResetPasswords = async (req, res) => {
    try {
        let resetPasswordToken = jwt.sign({ email: req.body.email }, CONSTANTS.PASSWORD_HASH, {
            expiresIn: "60s"
        })

        const userExists = await User.findOne({ email: req.body.email })
        if (!userExists) {
            return res.status(400).json({ message: "We couldn't find your account." })
        }

        console.log(userExists);
        const user = await User.update({ resetPasswordToken: resetPasswordToken }, { where: { email: req.body.email } })
        if (!user) {
            return res.status(401).json({ message: "Something went wrong, You might have entered incorrect email address." });
        }
        sendMail({
            subject: EMAIL.RESET_PASSWORD.SUBJECT,
            to: req.body.email,
            html: resetPasswordEmail({ ...userExists.dataValues, resetPasswordLink: `${process.env.LOCALHOST}/api/auth/reset-password/${resetPasswordToken}` })
        })
        res.json({ message: "Please check your email" })
    } catch (error) {
        console.log("  ::error:: ", error);
        res.status(500).send({ ...messages.SERVER_ERROR })
    }
}

module.exports = {
    signin,
    signup,
    confirmEmail,
    resetPasswords,
    reuestResetPasswords: reqestResetPasswords,
    setNewPassword
}