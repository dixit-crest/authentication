const jwt = require("jsonwebtoken")
const CONSTANTS = require("../config/constants")
const { getUser } = require("../controllers/userControllers")
const { messages } = require("../util/messages")

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['x-access-token'] || req.headers['authorization']?.split(" ")[1]
        if (!token) {
            return res.status(400).json({ message: "Token not provided" })
        }
        const decoded = jwt.verify(token, CONSTANTS.PASSWORD_HASH)
        req.user = await getUser(decoded.id)
        next()
    } catch (err) {
        console.log(":: err :: ", err);
        return res.status(400).json({ message: "Session expired, Please re-login" })
    }
}

const checkPermission = (ROLE) => (req, res, next) => {
    if(Number(req.user.role) === ROLE) {
        next();
    } else {
        res.status(401).json({ ...messages.ACTION_NOT_PERMITTED })
    }
}

module.exports = {
    verifyToken,
    checkPermission
}