const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const sql = require('../db');

const path = require('path');
let oneStepBack = path.join(__dirname, '../');

router.get('/', (req, res) => {
  res.sendFile(oneStepBack + '/views/register.html');
});

router.post('/', async (req, res) => {
  const { login, password } = req.body;
  if (!login || !password) {
    return res.status(400).send('Invalid input data');
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await sql`INSERT INTO uzytkownicy (login, haslo, rola) VALUES (${login}, ${hashedPassword}, 'uzytkownik')`;

    return res.status(200).send('User registered successfully');
  } catch (error) {
    console.error('Error registering user', error);
    return res.status(500).send('Error registering user');
  }
});

module.exports = router;
