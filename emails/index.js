const nodemailer = require('nodemailer');
const { getRegistrationMail } = require('./templates');
require('dotenv').config()  

const transporter = nodemailer.createTransport({
    service: "outlook",
    host: 'smtp-mail.outlook.com',

    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
})

const sendMail = (mailOptions = {
    from: process.env.MAIL_USER,
    to: to,
    user: {},
    subject: subject || 'My Mail',
    html: html || `
        <h2>My Mail</h2>
        `,
}) => {
    transporter.sendMail({
        from: process.env.MAIL_USER,
        to: mailOptions.to,
        subject: mailOptions.subject || 'My Mail',
        html: mailOptions.html || `
        <h2>My Mail</h2>
        `
    }, function (err, result) {
        if (err) {
            console.log("Could not send email",err);
        } else {
            console.log(" :: MAIL SENT :: ", result);
        }
    }

    )
}

module.exports = sendMail