const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
    specialization:{
        type:String,
        default:null
    },
    educationlevel:{
        type:String,
        default:null
    },
    contactnumber:{
        type:Number,
        default:null
    }
});

module.exports=mongoose.model('Doctor',doctorSchema);



