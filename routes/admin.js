const e = require('express');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Página principal do painel ADM")
});

router.get('/posts', (req, res) => {
    res.send('Página de posts');
});

router.get('/get', (req, res) => {
    res.send('Página de categorias');
});

module.exports = router;