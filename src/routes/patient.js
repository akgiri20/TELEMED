const express = require("express");
const router = express.Router();
const passport = require("passport");
const Patient = require("../models/patient");
const flash = require("connect-flash");

const catchAsync = require("../utils/catchAsync");

//const { isValidUser, isLoggedIn } = require('../middleware');

router.get("/patient_register", (req, res) => {
  res.render("patient/register");
});

router.post("/patient_register", async (req, res, next) => {
  try {
    const { age, username, address, phone, password } = req.body;
    const user = new Patient({ age, username, address, phone });
    const registeredUser = await Patient.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Rural Healthcare!");
      res.redirect("/home");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/patient_register");
  }
});

router.get("/patient_login", (req, res) => {
  res.render("patient/login");
});

router.post('/patient_login',async (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/patient_home';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

router.get("/patientprofile",async(req,res)=>{
res.render("patient/patientprofile")
})

router.get('/appointmentReq',async(req,res)=>{
    res.render('patient/appointmentReq');
})

router.post("/appointmentReq",async(req,res)=>{
    
});

router.get("/home", async (req, res) => {
  res.render("home");
});

router.get("/telepharm", async (req, res) => {
  res.render("telepharm");
});
router.get("/teleconsult", async (req, res) => {
  res.render("teleconsult");
});
router.get("/community", async (req, res) => {
  res.render("community");
});

router.get("/about", async (req, res) => {
  res.render("about");
});

router.get('/map',async(req,res)=>{
  res.render('map');
});

module.exports = router;
