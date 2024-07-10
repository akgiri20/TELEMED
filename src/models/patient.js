const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const PatientSchema = new Schema({
  // username nd password already present in passport
  age: {
    type: Number,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

PatientSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Patient", PatientSchema);
