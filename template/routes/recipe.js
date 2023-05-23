const express = require('express');
const router = express.Router();
const sql = require('../db');

router.get('/', async (req, res) => {
  try {
    const results = await sql`SELECT * FROM recipes`;
    const recipes = results.rows;
    res.render('recipe_show', { recipes });
  } catch (error) {
    console.error('Błąd podczas pobierania przepisów', error);
    res.status(500).send('Błąd serwera');
  }
});

router.post('/add', async (req, res) => {
  const { title, description } = req.body;

  try {
    await sql`INSERT INTO recipes (title, description) VALUES (${title}, ${description})`;
    res.redirect('/recipe');
  } catch (error) {
    console.error('Błąd podczas dodawania przepisu', error);
    res.status(500).send('Błąd serwera');
  }
});

router.get('/download/:recipeId', async (req, res) => {
  const recipeId = req.params.recipeId;

  try {
    const results = await sql`SELECT * FROM recipes WHERE id = ${recipeId}`;
    const recipe = results.rows[0];
    const recipeJson = JSON.stringify(recipe);

    res.setHeader('Content-disposition', 'attachment; filename=recipe.json');
    res.setHeader('Content-type', 'application/json');
    res.send(recipeJson);
  } catch (error) {
    console.error('Błąd podczas pobierania przepisu', error);
    res.status(500).send('Błąd serwera');
  }
});

module.exports = router;
