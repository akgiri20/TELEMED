const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StoreSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    time: {
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

 StoreSchema.plugin(passportLocalMongoose); 
 module.exports = mongoose.model('Store', StoreSchema);