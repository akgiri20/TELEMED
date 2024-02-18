const express=require('express');
const router=express.Router();
const catchAsync =require('../utils/catchAsync');
const flash=require('connect-flash');
const Medicine=require('../models/medicine');

router.get('/addmedicine',(req,res)=>{
    res.render('medicine/addmedicine')
})

router.post('/addmedicine', async (req, res) => {
    try {
        // Extract medicine name and for disease from the request body
        const { name, fordisease } = req.body;

        // Get the current user's ID (assuming user is authenticated)
        const currentUserId = req.user._id;

        // Update or create the medicine document
        const result = await Medicine.findOneAndUpdate(
            { name: name },
            { $addToSet: { medicalstores: currentUserId }, $setOnInsert: { fordisease: fordisease } },
            { upsert: true, new: true }
        );

        console.log('Medicine saved successfully.');

        res.status(200).json({ success: true, medicine: result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: error.message });
    }
});



module.exports=router;