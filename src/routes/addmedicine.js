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
        // Extract medicine name and for disease from the request body
        const { medicineName, forDisease } = req.body;

        // Get the current user's ID (assuming user is authenticated)
        const currentUserId = req.user._id;

        // Find the medicine document by name
        const medicine = await Medicine.findOne({ name: medicineName });

        if (!medicine) {
            // If medicine does not exist, create a new document
            const newMedicine = new Medicine({
                name: medicineName,
                forDisease: forDisease,
                medicalStores: [{ userId: currentUserId }]
            });

            // Save the new medicine document to the database
            await newMedicine.save();
        } else {
            // If medicine already exists, push the current user's ID into the medicalStores array
            await Medicine.updateOne({ name: medicineName }, { $push: { medicalStores: { userId: currentUserId } } });
        }

        console.log( 'Medicine saved successfully.' );
    } catch (error) {
        console.log(error);
    }
});

module.exports=router;