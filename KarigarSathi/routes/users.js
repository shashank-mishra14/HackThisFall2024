const mongoose = require('mongoose');

require('dotenv').config();

const plm = require('passport-local-mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

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
