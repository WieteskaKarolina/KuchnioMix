const express = require('express');
const router = express.Router();

const path=require('path');
let oneStepBack=path.join(__dirname,'../');

router.get('/', (req, res) => {
    res.sendFile(oneStepBack + '/views/login.html');
});
  
router.post('/', (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).send('Invalid input data');
    }

    const query = 'SELECT * FROM users WHERE name = ?';
    connection.query(query, [name], (err, results) => {
        if (err) {
        return res.status(500).send('Error retrieving user from database');
        }

        if (results.length === 0) {
        return res.status(401).send('Invalid name or password');
        }

        bcrypt.compare(password, results[0].password, (err, isMatch) => {
        if (err) {
            return res.status(500).send('Error comparing passwords');
        }

        if (isMatch) {
            req.session.user = results[0];
            return res.status(200).send('Logged in successfully');
        } else {
            return res.status(401).send('Invalid name or password');
        }
        });
    });
});

module.exports = router;