const e = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Category');
const Category = mongoose.model("categories")

router.get('/', (req, res) => {
    res.render("admin/index")
});

router.get('/posts', (req, res) => {
    res.send('Página de posts');
});

router.get('/categories', (req, res) => {
    Category.find().sort({date: 'desc'}).lean().then((categories) => {
        res.render('admin/categories', {categories: categories});
    }).catch((err) => {
        res.flash("error_msg", "Houve um erro ao listar as categorias");
        res.redirect("/admin");
    });
});

router.get('/category/add', (req, res) => {
    
    res.render('admin/addcategory');
});

router.post('/category/new', (req, res) => {

    let errors = [];

    if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
         errors.push({text: "Nome inválido"});
    } 

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        errors.push({text: "Slug inválido"});
    }

    if (req.body.name.length < 2) {
        errors.push({text: "Nome da Categoria é muito pequeno"});
    }

    if(errors.length > 0) {
        res.render("admin/addcategory", {errors: errors})
        return;
    }


    const newCategory = {
        name: req.body.name,
        slug: req.body.slug
    };

    new Category(newCategory).save().then(()=> {
        req.flash('success_msg', "Categoria criada com sucesso");
        res.redirect('/admin/categories');
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao salvar a categoria, tente novamente!");
        res.redirect('/admin/categories');
    });
});

router.get('/get', (req, res) => {
    res.send('Página de categorias');
});

module.exports = router;