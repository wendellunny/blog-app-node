const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const admin = require('./routes/admin');
// const mongoose = require('mongoose');

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars')

app.use('/admin', admin)

const PORT=8081;
app.listen(PORT, () => {
    console.log('Servidor rodando!');
});