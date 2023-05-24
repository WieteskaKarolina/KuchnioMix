const express = require('express');
const session = require('express-session');
const db = require('./db');
const registerRoute = require(__dirname + '/routes/register');
const loginRoute = require(__dirname + '/routes/login');
const recipeRoute = require(__dirname + '/routes/recipe');
const editRecipeRoute = require(__dirname + '/routes/edit_recipe');
const addRecipeRoute = require(__dirname + '/routes/add_recipe');
const path = require('path');


const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/images', express.static(__dirname + '/images'));
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/styles', express.static(__dirname + '/styles'));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

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
app.use('/addRecipe', addRecipeRoute);
app.use('/editRecipe', editRecipeRoute);
  

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
