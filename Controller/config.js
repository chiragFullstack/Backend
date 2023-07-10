// config.js
const dotenv=require('dotenv');
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: "AKIAY35MOTBZSNLBUDXL",
  secretAccessKey:"VjgTGaMoMwMeR5oJ4sOwaUN67Ibu+cAljo+XP4c2",
  region: 'us-east-1', // replace with your desired AWS region
});

module.exports = AWS;
