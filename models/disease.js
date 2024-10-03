const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Medicine = require('./medicine');

const DiseaseSchema = new Schema({
    name: {
        type: String,
        required: true
    }
 })

 
 module.exports = mongoose.model('Disease', DiseaseSchema);