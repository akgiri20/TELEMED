const mongoose = require('mongoose');
const MedicalStore = require('../models/medicalStore');

mongoose.connect('mongodb://localhost:27017/Rural-healthcare');

const latitude = 28.6523392;
const longitude = 77.1588096;
const distance = 15;
const unitValue = 1000;

const nearestLoc = async () => {
    const users = await MedicalStore.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                },
                maxDistance: distance * unitValue,
                distanceField: 'distance',
                distanceMultiplier: 1 / unitValue,
                key: 'Location'
            }
        },
        {
            $project: {
                _id: 1, 
                distance: 1
            }
        },
        {
            $sort: {
                distance: 1
            }
        },
        { $limit: 5 }
    ]);
    console.log(users);
}

nearestLoc();



