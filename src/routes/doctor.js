const express=require('express');
const router=express.Router();
const catchAsync =require('../utils/catchAsync');
const Doctor=require('../models/doctor');
const PatientAppointment=require('../models/patientAppointment');
const Specialist= require('../models/Specialist');
const flash=require('connect-flash');
const passport=require('passport');
const mongoose = require('mongoose');


router.get('/doctorregister', async (req, res) => {
    res.render('doctor/register')
})

router.post('/doctorregister', catchAsync(async (req, res, next) => {
    try {
        console.log(req.body);
        const { specialization,educationlevel,phone,username,password  } = req.body;
        const doctor = new Doctor({ specialization,educationlevel,phone,username });
        const registeredUser = await Doctor.register(doctor, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'MESS!!');
            console.log(req.body)
            //res.redirect('/');
            
        })

        try {
            const specialists = await Specialist.find().lean(); // Get all specialists
            
            // Iterate through each specialist
            for (const specialist of specialists) {
                const matchingDoctors = await Doctor.find({ specialization: specialist.name }).select('_id').lean(); // Find doctors with matching specialization
                const doctorIds = matchingDoctors.map(doctor => doctor._id); // Extract doctor IDs
                
                // Update specialist document with matching doctor IDs
                await Specialist.findByIdAndUpdate(specialist._id, { $addToSet: { doctor: { $each: doctorIds } } });
            }
            
            console.log('Specialists updated successfully');
        } catch (error) {
            console.error('Error updating specialists:', error);
        }

    } 
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/doctorregister');
    }
}));

router.get('/doctorlogin',async(req,res)=>{
    res.render('doctor/login')
})

router.post('/doctorlogin',passport.authenticate('Doctor',{failureFlash:true,failureRedirect:'/doctorlogin'}),(req,res)=>{

req.flash('success','welcome back!! you are successfully logged in');
const redirectUrl = req.session.returnTo || '/';
delete req.session.returnTo;
res.redirect(redirectUrl);
})


router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/');
})

router.get('/appointment/:id', async(req,res) => {
    const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).send('Invalid ObjectId');
  }

  const doctorId = mongoose.Types.ObjectId(id);

  // Render the appointment creation page with the doctor ID as a parameter
  res.render('users/appointmentForm', { doctorId });
});
   

router.post('/appointment/:id', async(req,res) => {
    
        try {
            const { age, name, address, phone, issue } = req.body;
            const { id } = req.params;

            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).send('Invalid ObjectId');
            }
    
            // Create a new appointment object
            const appointment = new PatientAppointment({ age, name, address, phone, issue, doctorID: id });
            await appointment.save();
            req.flash('success', 'Successfully made a new appointment!');
            res.redirect('/appointment');
        } 
        catch (e) {
            req.flash('error', e.message);
            res.redirect('/appointment/:id');
        }
    
});

module.exports=router;