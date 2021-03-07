const LocalStrategy = require('passport-local').Strategy
const Bcrypt = require ('bcrypt')
const mongoose = require ('mongoose')
const passport = require ('passport');
const User = require ('./models/Users.js');

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: 'username'}, (username, password, done) => {
        User.findOne({ username: username})
        .then(user => {
            if (!user)
                return done(null, false, {
                    message: 'Gebruikersnaam is verkeerd!'
                });
                Bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;

                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, {
                            message: 'Het wachtwoord klopt niet!'
                        })
                    }
            });
        }).catch(err => console.log(err));
    })
    );
}

passport.serializeUser((user, done) =>
{
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
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
//         const user = new User({
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

// function initialize(passport, getUserByUsername, getUserById) {
//     const authenticateUser = async (username, password, done) => {
//         const user = getUserByUsername(username)
//         if (user == null) {
//             return done(null, false, { message: 'no email found'})
//         }

//         try{
//             if (await bcrypt.compare(password, user.password)) {
//                 return done(null, user)
//             } else {
//                 return done(null, false, {message: 'geen user'})
//             }
//         } catch {

//         }
//     }
//     passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser))
//     passport.serializeUser((user, done) => done(null, user.id))
//     passport.deserializeUser((id, done) => {return done(null, getUserById(id))
//     })
// }

// module.exports = initialize

//  app.post("/login", async (request, response) => {
//     try {
//         var user = await User.findOne({ username: request.body.username }).exec();
//         if(!user) {
//             return response.status(400).send({ message: "De gebruikersnaam bestaat niet" });
//         }
//         if(!Bcrypt.compareSync(request.body.password, user.password)) {
//             return response.status(400).send({ message: "Dat wachtwoord is niet goed" });
//         }
//         response.redirect('home');
//     } catch (error) {
//         response.status(500).send(error);
//     }
//   });


// passport.use(
//     new LocalStrategy({ usernameField: 'username'}, (username, password, done) => {
//       User.findOne({ username: username})
//       .then(user => {
//         Bcrypt.compare(password, user.password, (err, isMatch) => {
//         if (err) throw err;
        
//         if (isMatch) {
//           return done(null, user);
//         } else {
//           return done(null, false, {message: "Dat wachtwoord is fout"});
//         }
//         })
//         .catch(err => {
//           return done(null, false, {message: err});
//         });
//       });
//     })
// );
