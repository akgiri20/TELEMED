const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const doctorSchema = new Schema({
    specialization:{
        type:String,
        default:null
    },
    educationlevel:{
        type:String,
        default:null
    },
    phone:{
        type:Number,
        default:null
    }
});

doctorSchema.plugin(passportLocalMongoose); 
module.exports=mongoose.model('Doctor',doctorSchema);



