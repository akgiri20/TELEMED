const express = require('express');
const app= express();
const path= require('path');
const ejsMate= require('ejs-mate');
const joi= require('joi');
const catchAsync= require('./utils/catchAsync');
const bodyParser = require("body-parser");
const ExpressError= require('./utils/ExpressError');
const methodOverride= require('method-override');
const mongoose= require('mongoose');
const flash= require('connect-flash');
const session= require('express-session');
const { date } = require('joi');
const passport= require('passport');
const LocalStrategy= require('passport-local');



const Patient= require('./models/patient');
const MedicalStore= require('./models/medicalStore');
const Doctor= require('./models/doctor');
const Medicine= require('./models/medicine');
const Disease= require('./models/disease');
const patientAppointment= require('./models/patientAppointment');


mongoose.connect('mongodb://127.0.0.1/Rural-healthcare');


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const userRoutes= require('./routes/patient');
const doctorRoutes= require('./routes/doctor');
const specialistRoutes=require('./routes/specialist');
const medicalRoutes= require('./routes/medicalStore');
const medicineRoutes= require('./routes/medicine');
const diseaseRoutes= require('./routes/disease');


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
app.use(passport.session()); //always remember passport.session in written after app.use(session()).
passport.use("MedicalStore", new LocalStrategy(MedicalStore.authenticate()));
passport.serializeUser(MedicalStore.serializeUser());
passport.deserializeUser(MedicalStore.deserializeUser()); //this 2 statements are for adding and removing user from session.

app.use(passport.initialize());
app.use(passport.session());
passport.use("Doctor", new LocalStrategy(Doctor.authenticate()));
passport.serializeUser(Doctor.serializeUser());
passport.deserializeUser(Doctor.deserializeUser());

app.use(passport.initialize());
app.use(passport.session());
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
app.use('/', medicalRoutes);
app.use('/', doctorRoutes);
app.use('/', medicineRoutes);
app.use('/disease', diseaseRoutes);
app.use('/specialist', specialistRoutes);

app.listen(3000, () => {
    console.log('Serving on port 3000')
})


