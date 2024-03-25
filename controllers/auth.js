const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) message = message[0];
  else message = null;
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) message = message[0];
  else message = null;
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
  });
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }

    const doMatch = await bcrypt.compare(password, user.password);
    if (doMatch) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      await req.session.save();
      return res.redirect('/');
    }
    req.flash('error', 'Invalid email or password');
    res.redirect('/login');
  } catch (err) {
    console.log(err);
    res.redirect('/login');
  }
};

exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  try {
    const userDoc = await User.findOne({ email: email });
    if (userDoc) {
      req.flash('error', 'E-Mail already exists, please pick a different one!');
      return res.redirect('/signup');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name: 'Shivansh',
      email: email,
      password: hashedPassword,
      cart: { items: [] },
    });
    await user.save();
    res.redirect('/login');
  } catch (err) {
    console.log(err);
  }
};

exports.postLogout = async (req, res, next) => {
  try {
    await req.session.destroy();
    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};
