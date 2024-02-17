const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PatientSchema = new Schema({
    age: {
         type: Number,
         required: true
     },
    phone: {
        type: Number,
        required:true
    },
    address: {
        type: String,
        required: true
    }
 })

 PatientSchema.plugin(passportLocalMongoose); 
 module.exports = mongoose.model('Patient', PatientSchema);