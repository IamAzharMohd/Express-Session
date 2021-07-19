const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();

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
        maxAge: 20000
    }
}));


//PORT
const PORT = 3700;
app.listen(PORT, () => {
    console.log('web started at port:' + PORT)
});

//Dummy data
let users = [
    { id: 1, name: 'chris', password: 'i always beeen afraid' }
];

//ROUTES
app.get('/', (req, res) => {
    res.send(`${req.session.user?`
    <a href = "/view">View</a>
    `:`
    <a href = "/signup">Sign up</a>
    <a href = "/signup">Log In</a>
    `}`)
})

//signup form
app.get('/signup', (req, res) => {
    res.send(`<form action="/signup" method="POST">
    <h3>Sign Up</h3>
    <label for="name">Name</label>
    <input type="text" name="name"> 
    <label for="name">Password</label>
    <input type="text" name="password">
    <button type="submit">Sign up</button> 
</form>`);
})

//login form
app.get('/login', (req, res) => {
    res.send(`<form action="/login" method="POST">
    <h3>Login</h3>
    <label for="name">Name</label>
    <input type="text" name="name"> 
    <label for="name">Password</label>
    <input type="text" name="password">
    <button type="submit">Sign up</button> 
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

//view user
app.get('/view', (req, res) => {
    console.log(req.cookies);
    console.log(req.sessionID);
    console.log(req.session.users);
    res.send(users);
})

// //logout

// app.get('/logout', (req, res) => {
//     req.session.users.destroy()
//     res.send(users);
// })