const express = require('express');
const router = express.Router();
const sql = require('../db');

const checkAuthentication = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.render('home_before_login', { user: req.session.user });
  }
};


router.get('/', checkAuthentication, async (req, res) => {
  const userId = req.session.user.id;

  try {
    const recipes = await sql`SELECT p.przepisy,p.id FROM przepisy_uzytkownikow pu join przepisy p ON pu.id_przepisu=p.id  where pu.id_uzytkownika= ${userId}`;
    recipes.forEach(recipe => {
      const jsonRecipe = JSON.parse(recipe.przepisy);
      recipe.nazwa = jsonRecipe.nazwa;
    });

    res.render('show_all_recipe', { recipes });
  } catch (error) {
    console.error('Error retrieving recipes', error);
    res.status(500).send('Wystąpił błąd podczas pobierania przepisów');
  }
});



router.get('/:id/json', checkAuthentication, async (req, res) => {
  const recipeId = req.params.id;
  const userId = req.session.user.id;

  try {
    const [recipe] = await sql`SELECT * FROM przepisy WHERE id = ${recipeId} AND id IN (SELECT id_przepisu FROM przepisy_uzytkownikow WHERE id_uzytkownika = ${userId})`;

    if (!recipe) {
      return res.status(404).send('Przepis nie został znaleziony');
    }

    const jsonData = JSON.parse(recipe.przepisy); // Parse the JSON string in the 'przepisy.przepisy' column

    res.setHeader('Content-Disposition', 'attachment; filename="recipe.json"'); // Set the filename for the downloaded file
    res.setHeader('Content-Type', 'application/json');
    res.send(jsonData);
  } catch (error) {
    console.error('Error retrieving recipe', error);
    res.status(500).send('Wystąpił błąd podczas pobierania przepisu');
  }
});



module.exports = router;
