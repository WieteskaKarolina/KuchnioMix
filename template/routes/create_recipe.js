const express = require('express');
const router = express.Router();

const path = require('path');
const sql = require("../db");
let oneStepBack = path.join(__dirname,'../');

router.get('/', async (req, res) => {
    try
    {
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
        // console.log(categories)

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

        res.render('create_recipe', {categories:categories,products:productsAndCategoriesJson,units:units ,actions:actions  });

    }catch (error)
    {
        console.error('Error retrieving recipe', error);
        res.status(500).send('Wystąpił błąd podczas pobierania danych');
    }

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
    // res.redirect('/recipe');
    res.redirect('/recipe');

    // res.sendFile(oneStepBack + '/views/recipe_edit.ejs');
});

module.exports = router;