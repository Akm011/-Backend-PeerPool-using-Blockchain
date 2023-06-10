const mongoose = require('mongoose')
const { Schema } = mongoose;

// creating a schema for notes
const SlotBookSchema = new Schema({
  // Parking lot provider
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Normal user / book a slot
  renter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Parking Lots details
  authToken: {
    type: String,
    required:true
  },
  date: {
    type: Date,
    default: Date.now
  }
})
const SlotBook = mongoose.model('SlotBook', SlotBookSchema);

module.exports = SlotBook;