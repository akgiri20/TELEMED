const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Doctor = require("./doctor");

const SpecialistSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  detail: {
    type: String,
    required: true,
  },
  doctor: [
    {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
    },
  ],
});

module.exports = mongoose.model("Specialist", SpecialistSchema);
