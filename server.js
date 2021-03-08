const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const User = require('./models/Users.js');
const mongoose = require('mongoose');
const DBConnection = require('./connect.js');
DBConnection(mongoose);
const Bcrypt = require('bcrypt');
const passport = require('passport');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const initializePassport = require('./passport-config')
initializePassport(
  passport,
  username => users.find(user => user.username === username),
  id => users.find(user => user.id === id)
);
const flash = require('express-flash');
const session = require('express-session');

const app = express()
// const port = 3000
// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// });

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

app.get('/instellingen', magIk, (request, response) => {
  response.render('instellingen')
});

app.get('/home', magIk, (request, response) => {
  response.render('home')
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
  request.flash('uitgelogd');
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
    request.body.password = Bcrypt.hashSync(request.body.password, 10);
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
    request.body.password = Bcrypt.hashSync(request.body.password, 10);
    const filter = { username: request.user.username };
    const user = await User.findOne({ username: request.user.username });
    await User.updateOne(filter, { password: request.body.password });
    await user.save()
      .then(() => { respond.redirect('/'); });
  } catch {
    respond.status(500).send();
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

  // app.post("/change", async (request, response) => {
  //   try {
  //    const user = await User.findOne({ 
  //      username: request.user.username 
  //     }); 
  //     await user.setPassword(request.body.password); 
  //     const updatedUser = await user.save(); 
  //     request.login(updatedUser); 
  //     request.flash('success', 'Password Changed Successfully') 
  //     response.redirect('/') 
  //     } catch (error) {
  //       response.status(500).send(error);
  //     }
  //   });

  // app.post("/change", async (request, response) => {
//   try {
//    const user = await User.findOne({ 
//      username: request.user.username 
//     });
//     user.overwrite(request.body.password); 
//     const updatedUser = await user.save(); 
//     request.login(updatedUser); 
//     request.flash('success', 'Password Changed Successfully') 
//     response.redirect('./') 
//     } catch (error) {
//       response.status(500).send(error);
//     }
//   });

// app.get("/dump", async (request, response) => {
//   try {
//     const result = await User.find().exec();
//     response.send(result);
//   } catch (error) {
//     response.status(500).send(error);
//   }
// });