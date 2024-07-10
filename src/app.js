const express = require("express");
const app = express();
 const path = require("path");
 const ejsMate = require("ejs-mate");
 const joi = require("joi");
 const catchAsync = require("./utilities/catchAsync");
 const bodyParser = require("body-parser");

 const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
 const mapBoxToken =
   "pk.eyJ1IjoidGl0YW5pdW01OTYiLCJhIjoiY2w2bmIwNWxwMHRqOTNqbzcxNWxzN240ZCJ9.zpgHYiL8reD3OPg-t1_TuQ";
 const geocoder = mbxGeocoding({ accessToken: mapBoxToken });


const MedicalStore = require("./models/medicalStore");


const Doctor = require("./models/doctor");
const Patient = require("./models/patient");


const ExpressError = require("./utilities/ExpressError");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const flash = require("connect-flash");

const session = require("express-session");
const { date } = require("joi");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// const Patient = require("./models/patient");
// const MedicalStore = require("./models/medicalStore");
// const Doctor = require("./models/doctor");
// const Disease = require("./models/disease");
// const Medicine = require("./models/medicine");
// const patientAppointment = require("./models/patientAppointment");

mongoose.connect("mongodb://127.0.0.1/Rural-healthcare");

const userRoutes = require("./routes/patient");
const addmedicineRoutes = require("./routes/addmedicine");
const doctorRoutes = require("./routes/doctor");
const medicalStoreRoutes = require("./routes/medicalStore");
const diseaseRoutes = require("./routes/disease");
const specialistRoutes = require("./routes/specialist");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sessionConfig = {
  secret: "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

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
  console.log(req.session);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", userRoutes);
app.use("/", addmedicineRoutes);
app.use("/", doctorRoutes);
app.use("/", medicalStoreRoutes);
app.use("/disease", diseaseRoutes);
app.use("/specialist", specialistRoutes);

app.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname, "chat/demo/index"));
});



app.get("/home", async (req, res) => {
  res.render("home");
});

app.get("/telepharm", async (req, res) => {
  res.render("users/telepharm");
});
app.get("/teleconsult", async (req, res) => {
  res.render("users/teleconsult");
});
app.get("/community", async (req, res) => {
  res.render("users/community");
});

app.get("/about", async (req, res) => {
  res.render("users/about");
});

app.get("/education", async (req, res) => {
  res.render("users/education");
});
app.get("/userdefloc", async (req, res) => {
  res.render("users/getmap");
});
app.post("/userdefloc", async (req, res, next) => {
  const geodata = await geocoder
    .forwardGeocode({
      query: req.body.location,
      limit: 1,
    })
    .send();
  const latitude = geodata.body.features[0].geometry.coordinates[1];
  const longitude = geodata.body.features[0].geometry.coordinates[0];
  const distance = 15;
  const unitValue = 1000;
  const plants = await MedicalStore.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        maxDistance: distance * unitValue,
        distanceField: "distance",
        distanceMultiplier: 1 / unitValue,
        key: "Location",
      },
    },
    {
      $project: {
        _id: 1,
        distance: 1,
      },
    },
    {
      $sort: {
        distance: 1,
      },
    },
    { $limit: 5 },
  ]);
  const coordinateData = [];
  const nearPlant = [];
  const nearPlantName = [];
  for (i = 0; i < plants.length; i++) {
    const tempplant = await MedicalStore.findById(plants[i]._id);
    nearPlant.push(tempplant);
    nearPlantName.push(tempplant.username);
    coordinateData.push(tempplant.Location.coordinates);
  }
  res.render("users/map", {
    nearPlant: nearPlant,
    coordinateData: JSON.stringify(coordinateData),
    nearPlantName: JSON.stringify(nearPlantName),
    lat: latitude,
    lon: longitude,
  });
});

app.post("/getCurrLoc", async (req, res) => {
  const latitude = parseFloat(req.body.latitude);
  const longitude = parseFloat(req.body.longitude);
  const distance = 15;
  const unitValue = 1000;
  const plants = await MedicalStore.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        maxDistance: distance * unitValue,
        distanceField: "distance",
        distanceMultiplier: 1 / unitValue,
        key: "Location",
      },
    },
    {
      $project: {
        _id: 1,
        distance: 1,
      },
    },
    {
      $sort: {
        distance: 1,
      },
    },
    { $limit: 5 },
  ]);
  const coordinateData = [];
  const nearPlant = [];
  const nearPlantName = [];
  for (i = 0; i < plants.length; i++) {
    const tempplant = await MedicalStore.findById(plants[i]._id);
    nearPlant.push(tempplant);
    nearPlantName.push(tempplant.username);
    coordinateData.push(tempplant.Location.coordinates);
  }
  res.render("users/map", {
    nearPlant: nearPlant,
    coordinateData: JSON.stringify(coordinateData),
    nearPlantName: JSON.stringify(nearPlantName),
    lat: parseFloat(req.body.latitude),
    lon: parseFloat(req.body.longitude),
  });
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
