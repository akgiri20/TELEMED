const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const StoreSchema = new Schema({
  time: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  Location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
  },
});
StoreSchema.index({ Location: "2dsphere" });
StoreSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("MedicalStore", StoreSchema);
