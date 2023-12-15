const e = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Category');
const Category = mongoose.model("categories")
require("../models/Post");
const Post = mongoose.model('posts');

router.get('/', (req, res) => {
    res.render("admin/index")
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

router.get("/category/edit/:id", (req, res) => {
    Category.findOne({_id: req.params.id}).lean().then((category) => {
        res.render('admin/editCategory', {category: category});
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria não existe");
        res.redirect("/admin/categories")
    })
});

router.post("/category/edit", (req, res) => {
    Category.findOne({_id: req.body.id}).then((category) => {
        category.name = req.body.name;
        category.slug = req.body.slug;

        category.save().then(() => {
            req.flash("success_msg", "Categoria editada com sucessod");
            res.redirect("/admin/categories");
        }).catch((err) => {
            req.flash("error_msg","Houve um erro interno ao salvar a edição da categoria");
            res.redirect("/admin/categories");
        });
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao editar categoria");
        res.redirect("/admin/categories")
    })
});

router.post("/category/delete", (req, res) => {
    Category.deleteOne({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Categoria deletada com sucesso");
        res.redirect("/admin/categories")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar a categoria");
        res.redirect("/admin/categories");
    })
});

router.get("/posts", (req, res) => {
    Post.find().populate('category').sort({data: 'desc'}).lean().then((posts)=>{
        res.render('admin/posts', {posts: posts});
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as postagens");
        console.log(err)
        res.redirect("/admin");
    });    
});

router.get("/post/add", (req, res) => {
    Category.find().lean().then((categories) => {
        res.render('admin/addpost', {categories: categories});
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulario")
        res.redirect('admin/addpost', {errors: errors})
    })
    
});

router.post("/post/new", (req, res) => {
    var errors = [];
    if(req.body.category == 0) {
        errors.push({text: "Categoria inválida, registre uma categoria"});
    }

    if(errors.length > 0) {
        res.render('/admin')
        return;
    }

    const newPost = {
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        category: req.body.category,
        slug: req.body.slug
    }

    new Post(newPost).save().then(() => {
        req.flash("success_msg", "Postagem criada com sucess");
        res.redirect("/admin/posts");
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro durante o salvamento da postagem");
        console.log(err);
        res.redirect("/admin/posts");
    });

});

router.get("/posts/edit/:id", (req, res) => {
    Post.findOne({_id: req.params.id}).lean().then((post) => {
        Category.find().lean().then((categories) => {
            res.render("admin/editposts", {categories: categories, post:post})
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar as categorias");
            res.redirect("/admin/posts");
        })

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o fomulário de edição");
        res.redirect('/admin/posts');
    })
    
});

router.post("/post/edit", (req, res) => {
    Post.findOne({_id: req.body.id}).then((post) => {
        post.title = req.body.title;
        post.slug = req.body.slug;
        post.description = req.body.description;
        post.content = req.body.content;
        post.category = req.body.category;

        post.save().then(() => {
            req.flash('success_msg', "Postagem editada com sucesso");
            res.redirect("/admin/posts");
        }).catch(() => {
            req.flash("error_msg", "Erro interno");
            res.redirect("/admin/posts")
        });
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao salva a edição");
        res.redirect('/admin/posts');
    });
});

module.exports = router;