// Express en express session
const express = require('express');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 8000
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
// Path
const path = require('path');
// body parser - voor post requests
const bodyParser = require('body-parser');

// handlebars viewengine
const exphbs = require('express-handlebars');

// Database Model
const User = require('./models/Users.js');

// Mongoose en DB connectie
const mongoose = require('mongoose');
const DBConnection = require('./connect.js');
DBConnection(mongoose);

// bcrypt
const bcrypt = require('bcrypt');

// Passport - initialize is wat er meegenomen moet worden in de sessie
const passport = require('passport');
const initializePassport = require('./passport-config')
initializePassport(
  passport,
  username => users.find(user => user.username === username),
  id => users.find(user => user.id === id)
);

// Flash
const flash = require('express-flash');
const magIk = (request, response, next) => {
  if (request.isAuthenticated()) {
    return next();
  }
  request.flash('error'); response.redirect('login');
}

// static en public routing/ handlebars aangeven
app.use(express.static('static/public'));
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'hbs');
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));

// flash ophalen
app.use(flash())
// session gegevens meegeven/ installen
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

// passport
app.use(passport.initialize())
app.use(passport.session())

// routes
app.get('/login', (request, response) => {
  response.render('login')
});

app.get('/register', (request, response) => {
  response.render('register')
});

app.get('/instellingen', magIk, (request, response) => {
  response.render('instellingen')
});

app.get('/voetbal', magIk, (request, response) => {
  response.render('voetbal')
});

app.get('/delete', (request, response) => {
  response.render('delete')
});

app.get('/', magIk, (request, response) => {
  response.render('index', {
    name: request.user.name
  });
});

app.get('/logout', (request, response) => {
  request.logout();
  response.redirect('login');
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
    request.body.password = bcrypt.hashSync(request.body.password, 10);
    const user = new User(request.body);
    const result = await user.save();
    response.redirect('login');
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
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


app.post('/change', magIk, async (request, respond) => {
  try {
    request.body.password = bcrypt.hashSync(request.body.password, 10);
    const filter = { username: request.user.username };
    const user = await User.findOne({ username: request.user.username });
    await User.updateOne(filter, { password: request.body.password });
    await user.save()
      .then(() => { respond.redirect('/'); });
  } catch {
    respond.status(500).send();
  }
});