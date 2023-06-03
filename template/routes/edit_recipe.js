const express = require('express');
const router = express.Router();

const path = require('path');
const sql = require("../db");
let oneStepBack = path.join(__dirname,'../');

router.get('/:id', async (req, res) => {
    const recipeId = req.params.id;
    try {
        var recipeToEdit = await sql`SELECT p.przepisy,p.id FROM przepisy p where p.id= ${recipeId}`;
        var categoriesFromDb = await sql`SELECT nazwa FROM kategorie `;
        var productsFromDb = await sql`SELECT skladnik,kategoria FROM skladniki `;
        var unitsFromDb = await sql`SELECT nazwa FROM jednostki `;
        var actionsFromDb = await sql`SELECT nazwa FROM czynnosci `;
        var categories=[]
        for(let i=0;i<categoriesFromDb.length;i++)
        {
            categories.push(categoriesFromDb[i].nazwa)
        }

        var units=[]
        for(let i=0;i<unitsFromDb.length;i++)
        {
            units.push(unitsFromDb[i].nazwa)
        }
        var actions=[]
        for(let i=0;i<actionsFromDb.length;i++)
        {
            actions.push(actionsFromDb[i].nazwa)
        }
        // console.log(units)

        listaSkladnikoIrazKategori='{'+
            ' "skladniki":['+
            ' {"skladnik":"marchew", "kategoria":"sypkie"}'+
            ' ]}'
        var productsAndCategoriesJson = JSON.parse(listaSkladnikoIrazKategori);
        productsAndCategoriesJson['skladniki']=[]
        for(let i=0;i<productsFromDb.length;i++)
        {
            productsAndCategoriesJson['skladniki'].push({"skladnik":productsFromDb[i].skladnik,"kategoria":productsFromDb[i].kategoria})
        }

        // console.log(obj)


        res.render('recipe_edit', { recipe:recipeToEdit[0],idPrzepisu:recipeId,categories:categories,products:productsAndCategoriesJson,units:units,actions:actions });
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