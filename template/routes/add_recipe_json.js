const express = require('express');
const router = express.Router();
const sql = require('../db');
const multer = require('multer');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

const readJSONFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (error, fileData) => {
      if (error) {
        console.error('Error reading JSON file', error);
        reject(error);
      } else {
        try {
          const jsonData = JSON.parse(fileData);
          resolve(jsonData);
        } catch (parseError) {
          console.error('Error parsing JSON file', parseError);
          reject(parseError);
        }
      }
    });
  });
};

const checkAuthentication = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.render('home_before_login', { user: req.session.user });
  }
};

router.get('/', checkAuthentication, (req, res) => {
  res.render('add_recipe_json');
});

router.post('/', checkAuthentication, upload.single('recipeFile'), async (req, res) => {
    const userId = req.session.user.id;
    const { file: recipeFile } = req;
  
    if (!recipeFile) {
      return res.status(400).send('No file uploaded');
    }
  
    try {
      const filePath = recipeFile.path;
      const recipeJson = await readJSONFile(filePath);

    const newRecipe = await sql`INSERT INTO przepisy (nazwa_przepisu, przepisy) VALUES (${recipeJson.nazwa}, ${JSON.stringify(recipeJson)}) RETURNING id`;

    const recipeId = newRecipe[0].id;

    await sql`INSERT INTO przepisy_uzytkownikow (id_przepisu, id_uzytkownika) VALUES (${recipeId}, ${userId})`;

    res.redirect('/recipe');
  } catch (error) {
    console.error('Error adding recipe', error);
    res.status(500).send('Wystąpił błąd podczas dodawania przepisu');
  }
});

module.exports = router;
