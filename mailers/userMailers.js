const nodemailer = require('../config/nodemailer');
const env = require('dotenv').config();
const path = require('path');

exports.resetPassword = async user => {
  try {
    const htmlString = await nodemailer.renderTemplate(
      { user: user },
      '/password_reset.ejs',
    );

    await nodemailer.transporter.sendMail({
      from: process.env.SELF_EMAIL,
      to: user.email,
      subject: 'Reset Your Password',
      html: htmlString,
    });
  } catch (err) {
    console.log('Error in sending mail', err);
    throw err;
  }
};

exports.signupSuccess = async user => {
  try {
    const htmlString = await nodemailer.renderTemplate(
      { user: user },
      '/signup.ejs',
    );

    await nodemailer.transporter.sendMail({
      from: process.env.SELF_EMAIL,
      to: user.email,
      subject: 'Welcome to Shopify!',
      html: htmlString,
    });
  } catch (err) {
    console.log('Error in sending mail', err);
    throw err;
  }
};
