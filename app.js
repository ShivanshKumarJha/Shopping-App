const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
require('dotenv').config();

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('659a989dcd1ac5abb4790746')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(result => {
    // gives the first user find
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Shivansh',
          email: 'shiv@test.com',
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(port,()=>{
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.log('Error ',err);
  });
