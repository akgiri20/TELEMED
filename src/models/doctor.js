const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    contactnumber:{
        type:Number,
        default:null,
        required: true
    }
});

module.exports=mongoose.model('Doctor',doctorSchema);



