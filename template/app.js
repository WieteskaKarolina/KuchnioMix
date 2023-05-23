const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const registerRoute = require(__dirname + '/routes/register');
const loginRoute = require(__dirname + '/routes/login');
const recipeRoute = require(__dirname + '/routes/recipe');


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'my_database'
});


const app = express();
app.use('/images', express.static(__dirname + '/images'));
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/styles', express.static(__dirname + '/styles'));

app.use(session({
    secret: 'my_secret_key',
    resave: false,
    saveUninitialized: true
  }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/home.html');
  });

app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/recipe', recipeRoute);

  

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
