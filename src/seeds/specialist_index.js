const mongoose = require("mongoose");
const Specialist = require("../models/Specialist");
const specialists = require("./specialist_seeds");

mongoose.connect("mongodb://127.0.0.1/Rural-healthcare", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.set("strictQuery", false);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const seedSpecialistsDb = async () => {
  await Specialist.deleteMany({});
  for (let i = 0; i < 5; i++) {
    const S = new Specialist({
      name: `${specialists[i].name}`,
      detail: `${specialists[i].detail}`,
      doctor: [...specialists[i].doctor],
    });
    await S.save();
  }
};

seedSpecialistsDb().then(() => {
  mongoose.connection.close();
});
