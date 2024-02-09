const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://utkarshhdixit:nXPmhBvjeo60ieQ9@cluster0.plsuptg.mongodb.net/?retryWrites=true&w=majority");

const userSchema = new mongoose.Schema({
  profession: String,
  selectedOption: String,
  mobile: {
    type: Number,
    required: true
  },
  name: {
    type: String
  }, 
  username: {
    type: String,
    unique: true,
  },
  locationName: {
    type: String
  },
  lat: Number,
  long: Number,
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);

