# TeamMates
Deze app is gemaakt om in een soort tinder stijl teamgenoten te vinden voor je sportteam. Dus als de gebruiker inlogt dan kan hij/zij een sport aanklikken waar ze teamgenoten voor zoeken. Vervolgens komen er mensen in beeld als een soort tinder en kan de gebruiker liken/disliken. 

# Installatie
![CodeShowcase](https://github.com/Adriaan350/blok-tech/blob/main/extra/code.png)

Maak een .env bestand aan en zet daar
ATLAS_URI=[hier de mongodb uri]
SESSION_SECRET=[Zet neer wat je als key wilt]

# Database
Dit is mijn database schema hier staan de gegevens die ik in de database zet.
```js
const UserForm = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    username: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true,
    },
    age: {
        type: Number,
        require: true,
    }
});
```

# Dependencies
- bcrypt
- body-parser
- camelcase
- dotenv
- express
- express-flash
- express-handlebars
- express-session
- mongodb
- mongoose
- multer
- passport
- passport-local
- passport-local-mongoose

# Screenshots
![Screenshot1](https://github.com/Adriaan350/blok-tech/blob/main/extra/screenshot1.png)
![Screenshot2](https://github.com/Adriaan350/blok-tech/blob/main/extra/Screenshot2.png)
