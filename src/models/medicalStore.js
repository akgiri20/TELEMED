const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Disease=require('./disease');
const Medicines=require('./medicine');
const passportLocalMongoose = require('passport-local-mongoose');

const StoreSchema = new Schema({
    time: {
         type: String,
         required: true
     },
    phone: {
        type: String,
        required:true
    },
    address: {
        type: String,
        required: true
    },
     Location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    }
 })

StoreSchema.plugin(passportLocalMongoose); 
 module.exports = mongoose.model('MedicalStore', StoreSchema);