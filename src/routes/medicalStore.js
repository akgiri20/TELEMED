const express=require('express');
const router=express.Router();
const catchAsync =require('../utils/catchAsync');
const MedicalStore=require('../models/medicalStore');
const flash=require('connect-flash');
const passport=require('passport');


router.get('/medicalstoreregister', async (req, res) => {
    res.render('medicalstore/register')
})

router.post('/medicalstoreregister', catchAsync(async (req, res, next) => {
    try {
        console.log(req.body);
        const { time,phone,address,username,password  } = req.body;
        const medicalstore = new MedicalStore({ time,phone,address,username });
        const registeredUser = await MedicalStore.register(medicalstore, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'MESS!!');
            console.log(req.body)
            res.redirect('/');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/medicalstoreregister');
    }
}));

router.get('/medicalstorelogin',async(req,res)=>{
    res.render('medicalstore/login')
})

router.post('/medicalstorelogin',passport.authenticate('MedicalStore',{failureFlash:true,failureRedirect:'/medicalstorelogin'}),(req,res)=>{

    req.flash('success', 'welcome ');
    const redirectUrl = req.session.returnTo || '/addmedicine';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/');
})

module.exports=router;