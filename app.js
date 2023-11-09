const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
// const mongoose = require('mongoose');

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars')

const PORT=8081;
app.listen(PORT, () => {
    console.log('Servidor rodando!');
});