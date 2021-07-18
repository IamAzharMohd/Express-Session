const express = require ('express');
const morgan = require ('morgan');
const cookieParser = require ('cookie-parser');
const session = require ('express-session');
const app = express();

//middleware
app.use(cookieParser());
app.use(morgan('dev'));
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'this is my secret'
}));


//PORT
const PORT = 3700;
app.listen(PORT, () => {
    
    console.log('web started at port:'+PORT )
});

//ROUTES
app.get('/', (req, res) => {
    if(req.session.page_view_counter){
        console.log(req.session);
        req.session.page_view_counter++;
        res.send('<h1>You visited this page for <span style ="color: blue;">'+req.session.page_view_counter+ '</span> times</h1>')
    }
    else{
        req.session.page_view_counter = 1;
        res.send('Welcome first time visitor');
    }
    
    
})