const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");

const { isLoggedIn } = require("../middleware");
const flash = require("connect-flash");

router.get("/profile", isLoggedIn, async (req, res) => {
  res.render("doctor/profile");
});


module.exports = router;



