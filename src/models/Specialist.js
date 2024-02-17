const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SpecialistSchema = new Schema({
    
    detail: {
        type: String,
        required: true
    }
 })

 SpecialistSchema.plugin(passportLocalMongoose); 
 module.exports = mongoose.model('Specialist', SpecialistSchema);