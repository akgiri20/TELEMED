const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Doctor = require("../models/doctor");
const Specialist = require("../models/Specialist");
const flash = require("connect-flash");
const passport = require("passport");

router.get("/doctorregister", async (req, res) => {
  res.render("doctor/register");
});

router.post(
  "/doctorregister",
  catchAsync(async (req, res, next) => {
    try {
      console.log(req.body);
      const { specialization, educationlevel, phone, username, password } =
        req.body;
      const doctor = new Doctor({
        specialization,
        educationlevel,
        phone,
        username,
      });
      const registeredUser = await Doctor.register(doctor, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "MESS!!");
        console.log(req.body);
        res.redirect("/home");
      });

      try {
        const specialists = await Specialist.find().lean(); // Get all specialists

        // Iterate through each specialist
        for (const specialist of specialists) {
          const matchingDoctors = await Doctor.find({
            specialization: specialist.name,
          })
            .select("_id")
            .lean(); // Find doctors with matching specialization
          const doctorIds = matchingDoctors.map((doctor) => doctor._id); // Extract doctor IDs

          // Update specialist document with matching doctor IDs
          await Specialist.findByIdAndUpdate(specialist._id, {
            $addToSet: { doctor: { $each: doctorIds } },
          });
        }

        console.log("Specialists updated successfully");
      } catch (error) {
        console.error("Error updating specialists:", error);
      }
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/doctorregister");
    }
  })
);

router.get("/doctorlogin", async (req, res) => {
  res.render("doctor/login");
});

router.post(
  "/doctorlogin",
  passport.authenticate("Doctor", {
    failureFlash: true,
    failureRedirect: "/doctorlogin",
  }),
  (req, res) => {
    req.flash("success", "welcome back!! you are successfully logged in");
    const redirectUrl = req.session.returnTo || "doctorprofile";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

router.get('/doctorprofile',(req,res)=>{
  res.render('doctor/doctorprofile');
})
// router.get("/doctorprofile", async (req, res) => {
//   res.render("doctor/profile");
// });

// router.post(
//   "/doctorprofile",
//   passport.authenticate("Doctor", {
//     failureFlash: true,
//     failureRedirect: "/doctorprofile",
//   }),
//   (req, res) => {
//     req.flash("success", "welcome back!! profile displayed");
//     const redirectUrl = req.session.returnTo || "/home";
//     delete req.session.returnTo;
//     res.redirect(redirectUrl);
//   }
// );

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Goodbye!");
  res.redirect("/home");
});

module.exports = router;
