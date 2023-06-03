const express = require('express');
const router = express.Router();

const path = require('path');
const sql = require("../db");
let oneStepBack = path.join(__dirname,'../');

router.get('/:id', async (req, res) => {
    const recipeId = req.params.id;
    try {
        var recipeToEdit = await sql`SELECT p.przepisy,p.id FROM przepisy p where p.id= ${recipeId}`;
        res.render('recipePlayer', { recipe:recipeToEdit[0],idPrzepisu:recipeId });
        // res.sendFile(oneStepBack + '/views/recipe_edit.ejs');

    }catch (error)
    {
        console.error('Error retrieving recipe', error);
        res.status(500).send('Wystąpił błąd podczas pobierania przepisu');
    }
});



module.exports = router;