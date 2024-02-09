const mongoose = require('mongoose');

const plm = require('passport-local-mongoose');

mongoose.connect("mongodb+srv://karigarhtf:Fl96fWL659Jobb43@cluster0.i7zhlid.mongodb.net/");

const userSchema = new mongoose.Schema({
  profession: String,
  selectedOption: String,
  mobile: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
  },
  username: {
    type: String,
    unique: true,
  },
  locationName: {
    type: String,
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

userSchema.plugin(plm);

module.exports = mongoose.model("User", userSchema);
