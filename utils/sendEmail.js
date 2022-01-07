const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:'mynamesnick.help@gmail.com',
        pass: process.env.EMAIL_SECRET
    }
})

const mailOptions = {
    from:"mynamesnick.help@gmail.com",
    to:"",
    subject:"MyNameIsNick Password Change Request",
    text:''
};

module.exports = {mailOptions,transporter}
