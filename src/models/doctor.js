const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const doctorSchema = new Schema({
    
    specialization:{
        type:String,
        default:null,
        required: true
    },
    educationlevel:{
        type:String,
        default:null,
        required: true
    },
    phone:{
        type:Number,
        default:null,
        required: true
    }
});

doctorSchema.plugin(passportLocalMongoose); 
module.exports=mongoose.model('Doctor',doctorSchema);



