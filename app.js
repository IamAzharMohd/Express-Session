const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
require('dotenv').config();
const { DBURI } = process.env;

//express app
const app = express();

//view engine
app.set('view engine', 'ejs');

//middleware
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'this is my secret',
    cookie: {
        maxAge: 1000*60*60*5
    },
    store: MongoStore.create({ mongoUrl: process.env.DBURI })
}));

//db connection
mongoose.connect(DBURI, { 
    useUnifiedTopology:true,
    useNewUrlParser:true
},()=> {
    app.listen(process.env.PORT || 3700, () => {
        console.log('web started at port:' + 3700)
    });
})


//Dummy data
let users = [
    { id: 1, name: 'chris', password: 'i always beeen afraid' }
];

//AUTHORIZATION Middleware
const checkAuth = (req, res, next) => {
    if (!req.session.user) {
        req.session.err_msg = 'You need to be logged in to access this page';
        res.redirect('/login');
    } else {
        next()
    }
}

//ROUTES
app.get('/', (req, res) => {
    res.render('landing', { title: 'Landing' })
})

//signup form
app.get('/signup', (req, res) => {
   res.render('signup', { title: 'Sign Up'})
})

//login form
app.get('/login', (req, res) => {
    res.send(`${req.session.err_msg ? `<div style="color:red">${req.session.err_msg}</div>` : ''}
    <form action="/login" method="POST">
    <h3>Login</h3>
    <label for="name">Name</label>
    <input type="text" name="name"> 
    <label for="name">Password</label>
    <input type="text" name="password">
    <button type="submit">Log In</button> 
</form>`);
})

//signup POST
app.post('/signup', (req, res) => {
    const user = {
        id: users.length + 1,
        name: req.body.name,
        password: req.body.password
    }
    req.session.user = user;
    users.push(user);
    res.redirect('/');
})
//login
app.post('/login', (req, res) => {
    const user = {
        id: users.length + 1,
        name: req.body.name,
        password: req.body.password
    }
    req.session.user = user;
    users.push(user);
    res.redirect('/');
})

//view user
app.get('/view', checkAuth, (req, res) => {
    console.log(req.cookies);
    console.log(req.sessionID);
    console.log(req.session.user);
    res.send(users);
})

//protected route
app.get('/mycookie', checkAuth, (req, res) => {
    res.send(`
    <h1>This is protected route</h1>
    <p>Since you're an authorized user</p>
    <p>Here's some cookie</p>
    <img src="https://image.shutterstock.com/image-vector/cute-flat-cartoon-cookies-illustration-600w-1738553351.jpg" alt="" width="400px">
 `);
})

//logout

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        console.log('logged out')
    });
    res.redirect('/');
})