const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const MedicalStore = require("../models/medicalStore");
const flash = require("connect-flash");
const { isLoggedIn } = require("../middleware");

router.get("/medicalstoreregister", async (req, res) => {
  res.render("medicalstore/register");
});
router.get("/medicalstore_menu", async (req, res) => {
  res.render("medicalstore/menu");
});


router.post(
  "/medicalstoreregister",
  catchAsync(async (req, res, next) => {
    try {
      console.log(req.body);
      const {
        time,
        phone,
        address,
        type,
        coordinates0,
        coordinates1,
        longitude,
        username,
        password,
      } = req.body;
      const Location = {
        type: type,
        coordinates: [parseFloat(coordinates0), parseFloat(coordinates1)], // Parse latitude and longitude to floats
      };

      const medicalstore = new MedicalStore({
        time,
        phone,
        address,
        Location,
        username,
      });
      const registeredUser = await MedicalStore.register(
        medicalstore,
        password
      );
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "MESS!!");
        console.log(req.body);
        res.redirect("/home");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/medicalstoreregister");
    }
  })
);

router.get("/medicalstoreprofile", async (req, res) => {
  res.render("medicalstore/medicalstoreprofile");
});
router.get("/medicalstorelogin", async (req, res) => {
  res.render("medicalstore/login");
});



router.post(
  "/medicalstorelogin",
  passport.authenticate("MedicalStore", {
    failureFlash: true,
    failureRedirect: "/medicalstorelogin",
  }),
  (req, res) => {
    req.flash("success", "welcome back!! you are successfully logged in");
    const redirectUrl = req.session.returnTo || '/medicalstoreprofile';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

// router.get('/logout', (req, res) => {
//     req.logout();
//     req.flash('success', "Goodbye!");
//     res.redirect('/');
// })

module.exports = router;
