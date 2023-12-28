const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const admin = require('./routes/admin');
const user = require('./routes/user');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');

app.use(session({
    secret: "cursodenode",
    resave: true,
    saveUninitialized: true
}))

app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg  = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");

    next();
})

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/blogapp").then(() => {
    console.log('Conectado ao mongo');
}).catch((err) => {
    console.log('Erro ao se conectar' + err);
});

app.use(express.static(path.join(__dirname, "public")));


app.use((req, res, next) => {
    console.log('oi eu sou um middleware');
    next();
});

app.get('/', (req, res) => {
    res.render('index');
});

app.use('/admin', admin);
app.use('/user', user);

const PORT=8081;
app.listen(PORT, () => {
    console.log('Servidor rodando!');
});