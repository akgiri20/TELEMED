
const mongoose = require('mongoose');
const MedicalStore = require('../models/medicalStore');

mongoose.connect("mongodb://127.0.0.1/Rural-healthcare");

const db = mongoose.connection;
db.on("error" , console.error.bind(console , "connection error"));
db.once("open" , () => {
    console.log("database connected");
})

const medicalStore = 
[
  {
    time: "10:00AM-10:00PM",
    phone: 8080892403,
    address: "A-46, near Crowne Plaza, Pocket C, Okhla Phase I, Okhla, New Delhi, Delhi 110020",
    username: "med1", 
    Location : {
        type: "Point",
        coordinates : [77.2793059 , 28.5245577]
    }
  },
   {
    time: "10:00AM-10:00PM",
    phone: 8080892403,
    address: "A-46, near Crowne Plaza, Pocket C, Okhla Phase I, Okhla, New Delhi, Delhi 110020",
    username: "med2", 
    Location : {
        type: "Point",
        coordinates :  [77.30769 , 28.455841]
    }
  },
   {
    time: "10:00AM-10:00PM",
    phone: 8080892403,
    address: "A-46, near Crowne Plaza, Pocket C, Okhla Phase I, Okhla, New Delhi, Delhi 110020",
    username: "med3", 
    Location : {
        type: "Point",
        coordinates : [77.2527734  , 28.548356599999998]
    }
  },
   {
    time: "10:00AM-10:00PM",
    phone: 8080892403,
    address: "A-46, near Crowne Plaza, Pocket C, Okhla Phase I, Okhla, New Delhi, Delhi 110020",
    username: "med4", 
    Location : {
        type: "Point",
        coordinates : [77.2748015  , 28.5275635]
    }
  },
   {
    time: "10:00AM-10:00PM",
    phone: 8080892403,
    address: "A-46, near Crowne Plaza, Pocket C, Okhla Phase I, Okhla, New Delhi, Delhi 110020",
    username: "med5", 
    Location : {
        type: "Point",
        coordinates : [77.2522347 , 28.548843299999998]
    }
  }
]

const seeddb = async () => {
  for(i = 0 ; i < medicalStore.length ; i++){
      const temp = new MedicalStore(medicalStore[i]);
      const password = "1234";
      const registeredUser = await MedicalStore.register(temp , password);
      console.log(registeredUser);
  }
}

seeddb();