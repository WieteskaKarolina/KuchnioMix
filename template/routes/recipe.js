const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  // db.query('SELECT * FROM recipes')
  //   .then(results => {
  //     const recipes = results.rows;
  //     res.render('recipe_show', { recipes });
  //   })
  //   .catch(error => {
  //     console.error('Błąd podczas pobierania przepisów', error);
  //     res.status(500).send('Błąd serwera');
  //   });
    res.render('recipe_show');
});

router.post('/add', (req, res) => {
  const { title, description } = req.body;

  db.query('INSERT INTO recipes (title, description) VALUES ($1, $2)', [title, description])
    .then(() => {
      res.redirect('/recipe');
    })
    .catch(error => {
      console.error('Błąd podczas dodawania przepisu', error);
      res.status(500).send('Błąd serwera');
    });
});

router.get('/download/:recipeId', (req, res) => {
  const recipeId = req.params.recipeId;

  db.query('SELECT * FROM recipes WHERE id = $1', [recipeId])
    .then(results => {
      const recipe = results.rows[0];
      const recipeJson = JSON.stringify(recipe);

      res.setHeader('Content-disposition', 'attachment; filename=recipe.json');
      res.setHeader('Content-type', 'application/json');
      res.send(recipeJson);
    })
    .catch(error => {
      console.error('Błąd podczas pobierania przepisu', error);
      res.status(500).send('Błąd serwera');
    });
});

module.exports = router;
