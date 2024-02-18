const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MedicalStore=require('./medicalStore')

const MedicineSchema = new Schema({
    name: {
        type: String
    },
    fordisease: {
        type: String
    },
    medicalstores: [
        {
        type: Schema.Types.ObjectId,
        ref: 'MedicalStore'
        }
    ]
})

module.exports = mongoose.model('Medicine',MedicineSchema);