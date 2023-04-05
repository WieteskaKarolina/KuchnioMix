const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const registerRoute = require(__dirname + '/routes/register');
const loginRoute = require(__dirname + '/routes/login');



const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'my_database'
});


const app = express();
app.use('/images', express.static(__dirname + '/images'));

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


  

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
