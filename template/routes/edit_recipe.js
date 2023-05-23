const express = require('express');
const router = express.Router();

const path = require('path');
let oneStepBack = path.join(__dirname,'../');

router.get('/', (req, res) => {
    res.sendFile(oneStepBack + '/views/recipe_edit.html');
  });

module.exports = router;