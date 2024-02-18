const express = require('express');
const router = express.Router();
//const passport = require('passport');
const Disease = require('../models/disease');
const Medicine = require('../models/medicine');




const flash= require('connect-flash');


router.get('/', async(req, res) => {
    const diseases = await Disease.find({});
    res.render('disease/index', { diseases })
});


router.get('/getMedicines/:diseaseName', async (req, res) => {
    try {
      // Get the userId from the logged-in medical store
      const userId = req.user._id;
  
      // Find the disease by name
      const disease = await Disease.findOne({ name: req.params.diseaseName });
  
      if (!disease) {
        // Handle error when disease is not found
        return res.status(404).send('Disease not found');
      }
  
      // Filter the medicines that belong to the logged-in medical store and match the disease name (case-insensitive)
      const medicines = await Medicine.find({
        medicalstores: {
          $elemMatch: {
            $eq: userId
          }
        },
        fordisease: {
          $regex: disease.name,
          $options: 'i'
        }
      });
  
      // Send the filtered medicines to the client
      res.render('disease/showMedicines', {
        medicines
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });

module.exports = router;