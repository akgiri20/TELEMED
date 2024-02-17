const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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
    }
 })

StoreSchema.plugin(passportLocalMongoose); 
 module.exports = mongoose.model('Store', StoreSchema);