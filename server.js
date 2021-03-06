const express = require('express')
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const User = require('./models/Users.js');
const mongoose = require('mongoose');
const DBConnection = require('./connect.js');
DBConnection(mongoose);
const Bcrypt = require('bcrypt');
const passport = require('passport');
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}
const { doesNotReject } = require('assert');
const { POINT_CONVERSION_COMPRESSED } = require('constants');
// const magIk = require('./magik');
const initializePassport = require('./passport-config')
initializePassport(
  passport,
  username => users.find(user => user.username === username),
  id => users.find(user => user.id === id)
);
const flash = require('express-flash');
const session = require('express-session');

const app = express()
const port = 3000

const magIk = (request, response, next) => {
  if (request.isAuthenticated()) {
      return next();
  }
  request.flash('error'); response.redirect('login');
}

module.exports = magIk;

app.use(express.static('static/public'));
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'hbs');
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));

app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/static', express.static(path.join(__dirname, './static/public')));

app.get('/login', (request, response) => {
  response.render('login')
});

app.get('/register', (request, response) => {
  response.render('register')
});

app.get('/wwvergeten', (request, response) => {
  response.render('wwvergeten')
});

app.get('/home', magIk, (request, response) => {
  response.render('home')
});

app.get('/delete', (request, response) => {
  response.render('delete')
});

app.get('/', (request, response) => {
  response.render('index')
});

app.get('/logout', (request, response) => {
  request.logout();
  request.flash('je bent uitgelogd');
  response.redirect('login');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

app.get('*', (request, response) => {
  response.send('NOPE 404', 404);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

app.post("/registered", async (request, response) => {
  try {
    request.body.password = Bcrypt.hashSync(request.body.password, 10);
    const user = new User(request.body);
    const result = await user.save();
    response.redirect('login');
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/dump", async (request, response) => {
  try {
    const result = await User.find().exec();
    response.send(result);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true
}));

app.post("/delete", async (request, response) => {
  try {
    const user = await User.findOneAndDelete({ username: request.body.username }).exec();
    if (!user) {
      return response.status(400).send({ message: "De gebruikersnaam bestaat niet" });
    }
    response.redirect('register')
  } catch (error) {
    response.status(500).send(error);
  }
});

  // app.post("/login", async (request, response) => {
  //   try {
  //       var user = await User.findOne({ username: request.body.username }).exec();
  //       if(!user) {
  //           return response.status(400).send({ message: "De gebruikersnaam bestaat niet" });
  //       }
  //       if(!Bcrypt.compareSync(request.body.password, user.password)) {
  //           return response.status(400).send({ message: "Dat wachtwoord is niet goed" });
  //       }
  //       response.redirect('home');
  //   } catch (error) {
  //       response.status(500).send(error);
  //   }
  // });