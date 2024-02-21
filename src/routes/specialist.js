const express = require("express");
const router = express.Router();
//const passport = require('passport');
const Specialist = require("../models/Specialist");
const flash = require("connect-flash");

router.get("/", async (req, res) => {
  const specialists = await Specialist.find({});
  res.render("specialist/index", { specialists });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const specialist = await Specialist.findById(id).populate("doctor");
  const doctors = specialist.doctor;
  if (!doctors) {
    req.flash("error", "Cannot find the doctor!");
    return res.redirect("/specialist");
  }
  req.flash("success", "Doctors found!");
  res.render("specialist/show", { doctors });
});

module.exports = router;
