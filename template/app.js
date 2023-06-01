const express = require('express');
const session = require('express-session');
const db = require('./db');
const registerRoute = require(__dirname + '/routes/register');
const loginRoute = require(__dirname + '/routes/login');
const recipeRoute = require(__dirname + '/routes/recipe');
const editRecipeRoute = require(__dirname + '/routes/edit_recipe');
const addRecipeRoute = require(__dirname + '/routes/add_recipe');
const addRecipeJsonRoute = require(__dirname + '/routes/add_recipe_json');
const createRecipeRoute = require(__dirname + '/routes/create_recipe');


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

const checkAuthentication = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.render('home_before_login', { user: req.session.user });
  }
};

app.get('/', checkAuthentication, (req, res) => {
  res.render('home_after_login', { user: req.session.user });
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session', err);
      return res.status(500).send('Error logging out');
    }
    res.redirect('/');
  });
});

app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/recipe', checkAuthentication, recipeRoute);
app.use('/addRecipe', checkAuthentication, addRecipeRoute);
app.use('/editRecipe', checkAuthentication, editRecipeRoute);
app.use('/addRecipeJson', addRecipeJsonRoute);
app.use('/createRecipe', createRecipeRoute);


app.listen(3000, () => {
  console.log('Server started on port 3000');
});
