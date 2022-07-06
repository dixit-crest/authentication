const jwt = require("jsonwebtoken")
const CONSTANTS = require("../config/constants")
const { getUser } = require("../controllers/userControllers")

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['x-access-token'] || req.headers['authorization']?.split(" ")[1]
        if (!token) {
            return res.status(400).json({ message: "Token not provided" })
        }
        const decoded = await jwt.verify(token, CONSTANTS.PASSWORD_HASH)
        req.user = await getUser(decoded.id)
        next()
    } catch (err) {
        console.log(":: err :: ", err);
        return res.status(400).json({message: "Session expired, Please re-login"})
    }
}

module.exports = {
    verifyToken
}