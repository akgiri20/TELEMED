const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Doctor = require("./doctor");

const PatientAppointmentSchema = new Schema({
  // username nd password already present in passport
  name: {
    type: String,
    required: true,
  },
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
  issue: {
    type: String,
    required: true,
    maxlength: 10000,
  },
  doctorID: {
    type: Schema.Types.ObjectId,
    ref: "Doctor",
  },
});
module.exports = mongoose.model("PatientAppointment", PatientAppointmentSchema);
