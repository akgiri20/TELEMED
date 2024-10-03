const mongoose = require('mongoose');
const Disease = require('../models/disease');
const diseases = require('./disease_seeds');

mongoose.connect('mongodb://127.0.0.1/Rural-healthcare');

mongoose.set('strictQuery', false);

const db= mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
   console.log("Database connected");
});

const seedDiseaseDb = async() => {
    await Disease.deleteMany({});
    for (let i=0; i<7; i++)
    {
        const S = new Disease({
           
            name: `${diseases[i]}`
            
        })
        await S.save();
    }
}

seedDiseaseDb().then( () => {
    mongoose.connection.close();
});
