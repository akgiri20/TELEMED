const express = require('express');
const router = express.Router();
const passport = require('passport');
const Patient = require('../models/patient');
const flash= require('connect-flash');

const catchAsync = require('../utils/catchAsync');

//const { isValidUser, isLoggedIn } = require('../middleware');

router.get('/patient_register', (req, res) => {
    res.render('users/register');
});

router.post('/patient_register', async(req, res, next) => {
    try {
        const { age, username, address, phone, password } = req.body;
        const user = new Patient({ age, username, address, phone});
        const registeredUser = await Patient.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Rural Healthcare!');
            res.redirect('/patient_home');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/patient_register');
    }
});

router.get('/patient_login', (req, res) => {
    res.render('users/login');
});

router.post('/patient_login', 
async (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/patient_home';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}
);

router.get('/patient_home' ,async(req,res) => {
    res.render('users/patient_home');
});


module.exports = router;