const express = require('express')
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const Users = require ('./models/Users.js');
const mongoose = require('mongoose');
const DBConnection = require('./connect.js');
DBConnection(mongoose);
const Bcrypt = require('bcrypt');
const app = express()
const port = 3000

app.use(express.static('static/public'));
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'hbs');
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));

app.use('/static', express.static(path.join(__dirname, './static/public')));

app.get('/login', function (req, res) {
    res.render('login')
});

app.get('/register', function (req, res) {
    res.render('register')
});

app.get('/index', function (req, res) {
  res.render('index')
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

app.get('*', (req, res) => {
  res.send('bestaat niet', 404);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.post("/registered", async (request, response) => {
  try {
      request.body.password = Bcrypt.hashSync(request.body.password, 10);
      var user = new Users(request.body);
      var result = await user.save();
      response.redirect('login');
  } catch (error) {
      response.status(500).send(error);
  }
});

app.get("/dump", async (request, response) => {
  try {
      var result = await Users.find().exec();
      response.send(result);
  } catch (error) {
      response.status(500).send(error);
  }
});

app.post("/login", async (request, response) => {
  try {
      var user = await Users.findOne({ username: request.body.username }).exec();
      if(!user) {
          return response.status(400).send({ message: "The username does not exist" });
      }
      if(!Bcrypt.compareSync(request.body.password, user.password)) {
          return response.status(400).send({ message: "The password is invalid" });
      }
      response.redirect('index');
  } catch (error) {
      response.status(500).send(error);
  }
});







// const {email, username, password, password2, name, age} = req.body;
// let errors = [];
// console.log(' email :' + email+ 'username' + username+ ' pass:' + password + ' Name ' + name+ ' age ' + age);
// if(!email || !username || !password || !password2 || !name || !age) {
//     errors.push({msg : "Please fill in all fields"})
// }
// //check if match
// if(password !== password2) {
//     errors.push({msg : "passwords dont match"});
// }

// //check if password is more than 6 characters
// if(password.length < 6 ) {
//     errors.push({msg : 'password atleast 6 characters'})
// }
// if(errors.length > 0 ) {
// res.render('register', {
//     errors : errors,
//     email : email,
//     username : username,
//     password : password,
//     password2 : password2,
//     name : name,
//     age : age});
// } else {
//   //validation passed
//   User.findOne({ email: email }).exec((err, user) => {
//     console.log(user);
//     if (user) {
//       errors.push({ msg: 'email already registered' });
//       render(res, errors, email, username, password, password2, name, age);

//     } else {
      
//       app.post('/registered', async (req, res) =>{
//         const user = new Users({
//           email: req.body.email,
//           username: req.body.username,
//           password: req.body.password,
//           name: req.body.name,
//           age: req.body.age
//         });
//         await user.save()
//           .then(() => {
//             res.redirect('login');
//           });
//       });
