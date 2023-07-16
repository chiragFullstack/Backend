const nodemailer = require('nodemailer');

// Create a transporter object using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail', // e.g., 'gmail'
  auth: {
    user: 'chiragmahajan9019@gmail.com',
    pass: 'Chirag@best'
  }
});

// Create an email message
const mailOptions = {
  from: 'chiragmahajan9019@gmail.com',
  to: 'hk1898180@gmail.com@example.com',
  subject: 'Hello from Node.js',
  text: 'This is the body of the email.'
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error occurred while sending email:', error.message);
  } else {
    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
  }
});
