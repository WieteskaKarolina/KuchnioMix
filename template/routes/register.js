const express = require('express');
const router = express.Router();

const path=require('path');
let oneStepBack=path.join(__dirname,'../');

router.get('/', (req, res) => {
    res.sendFile(oneStepBack + '/views/register.html');
  });

router.post('/', (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).send('Invalid input data');
  }

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      return res.status(500).send('Error encrypting password');
    }

    const query = 'INSERT INTO users (name, password) VALUES (?, ?, ?)';
    connection.query(query, [name, hash], (err, result) => {
      if (err) {
        return res.status(500).send('Error registering user');
      }

      return res.status(200).send('User registered successfully');
    });
  });
});

module.exports = router;