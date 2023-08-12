const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(smtpTransport({
  host: 'mail.privateemail.com',
  port: 465,
  secure: true, // secure:true for port 465, secure:false for port 587
  auth: {
    user: 'arun@arcosystems.in', //arun@arcosystems.in
    pass: 'Arun@123'  //Arun@123
  }
}));


function sendPassword(password,email){

  const mailOptions = {
    from: 'arun@arcosystems.in',
    to: email,
    subject: 'DayCare Account Generated Password',
    text: 'Your Generated Password is '+password
  };

  // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error occurred while sending email:', error.message);
        // res.status(error.code).json(error.message);
      } else {
        console.log('Email sent successfully!');
        console.log('Message ID:', info.messageId);
        // res.status(200).json(info.messageId);
      }
    });
}

module.exports={
  sendPassword
}