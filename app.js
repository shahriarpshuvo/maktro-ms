/* eslint-disable no-console */
require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');

const userRouter = require('./routes/user');



// Database Connection
mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database 😍'));



// App Engine
const app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    express.urlencoded({
        extended: false,
    })
);
app.use(express.json());
app.use(methodOverride('_method'));
app.use(session({ secret: 'maktro-ms', saveUninitialized: true, resave: true }));
app.use(function(req, res, next) {
    res.locals.alert = req.session.alert;
    next();
});

// Routes
app.get('/', (req, res) => {
    if(false) return res.render('dashboard');
    res.render('login');
});
app.use('/users', userRouter);

// app.get('/access-control', (req, res) => {
//     res.render('users');
// });









// Development Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {console.log(`Application started on port: http://localhost:${PORT} 🔥`)});
