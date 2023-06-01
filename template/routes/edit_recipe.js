const express = require('express');
const router = express.Router();

const path = require('path');
const sql = require("../db");
let oneStepBack = path.join(__dirname,'../');

router.get('/:id', async (req, res) => {
    const recipeId = req.params.id;
    try {
        var recipeToEdit = await sql`SELECT p.przepisy,p.id FROM przepisy p where p.id= ${recipeId}`;
        res.render('recipe_edit', { recipe:recipeToEdit[0],idPrzepisu:recipeId });
        // res.sendFile(oneStepBack + '/views/recipe_edit.ejs');

    }catch (error)
    {
        console.error('Error retrieving recipe', error);
        res.status(500).send('Wystąpił błąd podczas pobierania przepisu');
    }
});



router.post('/saveEdited', async (req, res) => {
    const recipeId = req.body.idPrzepisu;
    const recipeJson = req.body.recipe;
    const userId = req.session.user.id;

    try {

        const newRecipe = await sql`INSERT INTO przepisy (nazwa_przepisu, przepisy) VALUES (${recipeJson.nazwa}, ${JSON.stringify(recipeJson)}) RETURNING id`;
        const newRecipeId = newRecipe[0].id;
        await sql`update przepisy_uzytkownikow set id_przepisu=${newRecipeId} where id_uzytkownika=${userId} and id_przepisu=${recipeId}`;
    }catch (error)
    {
        console.error('Error retrieving recipe', error);
        res.status(500).send('Wystąpił błąd podczas pobierania przepisu');
    }
    res.redirect('/recipe');

    // res.sendFile(oneStepBack + '/views/recipe_edit.ejs');
});


router.get('/deleteRecipe/:id', async (req, res) => {
    const recipeId = req.params.id;
    const userId = req.session.user.id;

    try {
        await sql`DELETE FROM przepisy_uzytkownikow where id_uzytkownika=${userId} and id_przepisu=${recipeId} `;
        res.redirect('/recipe');
        // res.sendFile(oneStepBack + '/views/recipe_edit.ejs');

    }catch (error)
    {
        console.error('Error retrieving recipe', error);
        res.status(500).send('Wystąpił błąd podczas pobierania przepisu');
    }



    // res.sendFile(oneStepBack + '/views/recipe_edit.ejs');
});
module.exports = router;