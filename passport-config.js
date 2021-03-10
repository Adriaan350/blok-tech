const LocalStrategy = require('passport-local').Strategy
const Bcrypt = require ('bcrypt')
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

// https://www.youtube.com/watch?v=-RCnNyD0L-s