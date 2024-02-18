const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MedicalStore=require('./medicalStore');
const Disease= require('./disease');

const MedicineSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    fordisease: {
        type: String,
        required: true
    },
    medicalstores: [
        {
        type: Schema.Types.ObjectId,
        ref: 'MedicalStore'
        }
    ]
})


module.exports = mongoose.model('Medicine', MedicineSchema);