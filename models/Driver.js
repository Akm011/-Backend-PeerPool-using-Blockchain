const mongoose = require('mongoose')
const { Schema } = mongoose;

// creating a schema for notes
const DriverSchema = new Schema({
    // acting as foreign key so that notes are linked with the user
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // Driver details
    Name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    WalletAddress: {
        type: String,
        required: true
    },

    IsAvailable:{
        type: Boolean,
        default:true
    },
    VehicleType: {
        type: String,
        enum : ['BIKE','AUTO','HATCHBACK','MINI SUV','SEDAN','SUV'],
        required:true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const Driver = mongoose.model('Driver', DriverSchema);

module.exports = Driver;