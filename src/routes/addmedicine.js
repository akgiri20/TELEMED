const express=require('express');
const router=express.Router();
const catchAsync =require('../utils/catchAsync');
const medicalStore=require('../models/medicalStore');
const flash=require('connect-flash');
const passport=require('passport');
const Medicine=require('../models/medicine');

router.get('/addmedicine',(req,res)=>{
    res.render('medicine/addmedicine')
})

router.post('/addmedicine', async (req, res) => {
    try {
        console.log(req.body.name);
        const { name, fordisease } = req.body;
         // Ensure name and forDisease are present in the request body
        if (!name || !fordisease) { // Check if name and forDisease are provided
            throw new Error('Both name and forDisease are required.');
        }

        // Get the current user's ID (assuming user is authenticated)

        const currentUserId = req.user._id;
        console.log(currentUserId);
        // Find the medicine document by name
        const medicine = await Medicine.findOne({ name: name });

        if (!medicine) {
            // If medicine does not exist, create a new document
            const newMedicine = new Medicine({
                name: name,
                fordisease: fordisease,
                medicalStores: [{ userId: currentUserId }]
            });
            // Save the new medicine document to the database
            await newMedicine.save();
        } else {
            // If medicine already exists, push the current user's ID into the medicalStores array
            await Medicine.updateOne({ name: name }, { $push: { medicalStores: { userId: currentUserId } } });
        }
        console.log( 'Medicine saved successfully.' );
        res.redirect('/medicalstoreprofile');
    } catch (error) {
        console.log(error);
    }
});

module.exports=router;
// const express = require("express");
// const router = express.Router();
// const catchAsync = require("../utils/catchAsync");
// const medicalStore = require("../models/medicalStore");
// const flash = require("connect-flash");
// const passport = require("passport");
// const Medicine = require("../models/medicine");

// router.get("/addmedicine", (req, res) => {
//   res.render("medicine/addmedicine");
// });

// router.post("/addmedicine", async (req, res) => {
//   try {
//     // Extract medicine name and for disease from the request body
//     const { name, fordisease } = req.body;

//     // Get the current user's ID (assuming user is authenticated)
//     const currentUserId = req.user._id;

//     // Update or create the medicine document
//     const result = await Medicine.findOneAndUpdate(
//       { name: name },
//       {
//         $addToSet: { medicalstores: currentUserId },
//         $setOnInsert: { fordisease: fordisease },
//       },
//       { upsert: true, new: true }
//     );

//     console.log("Medicine saved successfully.");
//     res.redirect("/medicalstoreprofile");

//     res.status(200).json({ success: true, medicine: result });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// module.exports = router;
