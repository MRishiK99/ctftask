const nodemailer = require('nodemailer');
const User = require('../models').User;



let transport = nodemailer.createTransport({
    host : 'smtp.gmail.com',
    port : 465,
    auth: {
       user: 'rishikesavmrk@gmail.com',
       pass: 'GreatGod1'
    }
});

exports.mailer = (header,body,user)=>{
    const message = {
        from: 'ctftask@rishi.com', // Sender address
        to: user.email,         // List of recipients
        subject: header, // Subject line
        html: body // Plain text body
    };
    transport.sendMail(message, function(err, info) {
        if (err) {
        console.log(err)
        } else {
        console.log(info);
        }
    });
}