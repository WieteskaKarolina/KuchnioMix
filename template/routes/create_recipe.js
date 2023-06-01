const express = require('express');
const router = express.Router();

const path = require('path');
const sql = require("../db");
let oneStepBack = path.join(__dirname,'../');

router.get('/', async (req, res) => {
    res.render('create_recipe');
});
router.post('/add', async (req, res) => {
    const recipeJson = req.body.recipe;
    const userId = req.session.user.id;

    try {

        const newRecipe = await sql`INSERT INTO przepisy (nazwa_przepisu, przepisy) VALUES (${recipeJson.nazwa}, ${JSON.stringify(recipeJson)}) RETURNING id`;
        const newRecipeId = newRecipe[0].id;
        await sql`insert into  przepisy_uzytkownikow (id_uzytkownika, id_przepisu) VALUES (${userId}, ${newRecipeId})`;
    }catch (error)
    {
        console.error('Error retrieving recipe', error);
        res.status(500).send('Wystąpił błąd podczas pobierania przepisu');
    }
    res.redirect('/recipe');

    // res.sendFile(oneStepBack + '/views/recipe_edit.ejs');
});

module.exports = router;