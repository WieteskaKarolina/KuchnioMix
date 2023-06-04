const express = require('express');
const router = express.Router();

const path = require('path');
const sql = require("../db");
let oneStepBack = path.join(__dirname,'../');

router.get('/', async (req, res) => {
    try
    {
        let user_role= req.session.user.rola
        if (user_role!=="admin")
        {
            return res.redirect("recipe")
        }
    }catch (error)
    {
        return res.redirect("recipe")
    }

    try
    {
        var categoriesFromDb = await sql`SELECT nazwa FROM kategorie `;

        var categories=[]
        for(let i=0;i<categoriesFromDb.length;i++)
        {
            categories.push(categoriesFromDb[i].nazwa)
        }
        res.render('admin', {categories:categories});

    }catch (error)
    {
        console.error('Error retrieving recipe', error);
        res.status(500).send('Wystąpił błąd podczas pobierania danych');
    }

});
router.post('/addProduct', async (req, res) => {

    const categoryInput = req.body.categoryInput;
    const productInput = req.body.productInput;
    try {
      await sql`INSERT INTO skladniki (kategoria, skladnik) VALUES (${categoryInput}, ${productInput})`;
    }catch (error)
    {
        console.error('Error adding product', error);
        res.status(500).send('Wystąpił błąd podczas pobierania przepisu');
    }
    res.redirect('/admin');
});

router.post('/addCategory', async (req, res) => {
    const categoryInput = req.body.categoryInput;
    try {
        await sql`INSERT INTO kategorie (nazwa) VALUES (${categoryInput})`;
    }catch (error)
    {
        console.error('Error adding category', error);
        res.status(500).send('Wystąpił błąd podczas pobierania przepisu');
    }
    res.redirect('/admin');
});

router.post('/addUnit', async (req, res) => {
    const unitInput = req.body.unitInput;
    console.log(unitInput)
    try {
        await sql`INSERT INTO jednostki (nazwa) VALUES (${unitInput})`;
    }catch (error)
    {
        console.error('Error adding unit', error);
        res.status(500).send('Wystąpił błąd podczas dodawania jednsotki');
    }
    res.redirect('/admin');
});

router.post('/addAction', async (req, res) => {
    const actionInput = req.body.actionInput;
    // console.log(unitInput)
    try {
        await sql`INSERT INTO czynnosci (nazwa) VALUES (${actionInput})`;
    }catch (error)
    {
        console.error('Error adding unit', error);
        res.status(500).send('Wystąpił błąd podczas dodawania jednsotki');
    }
    res.redirect('/admin');
});

module.exports = router;