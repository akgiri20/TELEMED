const express = require('express');
<<<<<<<<< Temporary merge branch 1
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session=require('express-session');
const flash=require('connect-flash');
const methodOverride = require('method-override');
const Doctor=require('./models/doctor');
const MedicalStore=require('./models/medicalStore');
const medicalStoreRoutes=require('./routes/medicalStore');
const doctorRoutes=require('./routes/doctor');
const passport=require('passport');
const LocalStrategy=require('passport-local');
// const router=express.Router();
// mongoose.set('useNewUrlParser', true)
// mongoose.set('useFindAndModify', true)
// mongoose.set('useCreateIndex', true)
=========
const app= express();
const path= require('path');
const ejsMate= require('ejs-mate');
const joi= require('joi');
const catchAsync= require('./utilities/catchAsync');
const bodyParser = require("body-parser");


const ExpressError= require('./utilities/ExpressError');
const methodOverride= require('method-override');
const mongoose= require('mongoose');
const flash= require('connect-flash');

const session= require('express-session');
const { date } = require('joi');
const passport= require('passport');
const LocalStrategy= require('passport-local');

const userRoutes= require('./routes/patient');

const Patient= require('./models/patient');
>>>>>>>>> Temporary merge branch 2

mongoose.connect('mongodb://127.0.0.1/Rural-healthcare');
// mongo.then(() => {
// console.log('connected');
// }).catch((err) => {
// console.log('err', err);
// });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));


const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

//this is passport initialization for medicalstores
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(MedicalStore.authenticate()));  
passport.serializeUser(MedicalStore.serializeUser());
passport.deserializeUser(MedicalStore.deserializeUser());

passport.use(new LocalStrategy(Patient.authenticate()));  

passport.serializeUser(Patient.serializeUser());
passport.deserializeUser(Patient.deserializeUser());





app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);

app.listen(3000, () => {
    console.log('Serving on port 3000')
})


