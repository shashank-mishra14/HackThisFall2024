var express = require("express");
var router = express.Router();
const passport = require('passport');
const Session = require('express-session');
const userModel = require('./users');
const Requirement = require('./requirements');
const axios = require('axios');
var flash = require('connect-flash');

/* GET home page. */


router.get("/login", function (req, res, next) {
  res.render("login");
});

router.get("/requirement", function(req, res, next){
  res.render("requirement");
})


router.post('/post-requirement', async (req, res) => {
  try {
      const { kaarigarType, description } = req.body;
      const createdAt = new Date();
      const expiresAt = new Date(createdAt.getTime() + (48 * 60 * 60 * 1000)); // 48 hours from now

      const newRequirement = new Requirement({
          User: req.user._id, // Assuming you have the user's ID from the session
          kaarigarType,
          description,
          createdAt,
          expiresAt
      });

      await newRequirement.save();
      req.flash('success', 'Requirements posted successfully.');
      res.redirect('/customer'); // Redirect after saving
  } catch (err) {
      console.error(err);
      res.status(500).send('Error posting requirement');
  }
});

router.post('/login',passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/",
  // failureFlash: true
}), function(req, res){});


router.post('/save-location', async (req, res) => {
  const { lat, lng } = req.query;
  
  console.log(lat);
  console.log(lng);

  try {
    // Make a request to OpenStreetMap Nominatim API
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: {
            lat: parseFloat(lat),
            lon: parseFloat(lng),
            format: 'json',
            addressdetails: 1,
        },
    });

    // Extract the address or location name from the API response
    const locationName = response.data.display_name;
    console.log(locationName);
    const user = await userModel.findOneAndUpdate({username: req.session.passport.user}, {locationName: locationName, lat: lat, long: lng}, {new: true});
    await user.save();
    console.log(user);
    res.render('profile');
} catch (error) {
    console.error('Error converting coordinates to location name:', error.message);
    res.status(500).json({ error: 'Error converting coordinates to location name' });
}
});

router.post('/register', async function(req, res) {
  const { selectedOption, mobile, username, email, name, locationName, profession } = req.body;

  if (!username || !name || !mobile || !email || !selectedOption || !locationName) {
    return res.redirect('/');
  }
  let newUser;
  if(profession !== ""){
      newUser = new userModel({
      selectedOption: selectedOption,
      profession: profession,
      email: email,
      mobile: mobile,
      username: username,
      name: name,
      locationName: locationName
    });
  }else{
        newUser = new userModel({
        selectedOption: selectedOption,
        mobile: mobile,
        email: email,
        username: username,
        name: name,
        locationName: locationName
      });

  }

    userModel.register(newUser, req.body.password)
      .then(() => {
        passport.authenticate("local")(req, res, function() {
          res.redirect("/profile");
        });
      })
      .catch((err) => {
        console.error(err);
        res.redirect('/', { error: err });
      });
});

router.get("/logout", function(req, res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

router.get("/profile", function (req, res, next) {
  res.render("profile");
});

router.get("/details", async function (req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user});
  res.render('details', {user});
});

router.post('/editdetails', async function(req, res){
  const user = await userModel.findOneAndUpdate(
    {username: req.session.passport.user},
     {mobile: req.body.mobile,
    name: req.body.name,
     email: req.body.email,
locationName: req.body.locationName,
username: req.body.username},
      {new: true});
      await user.save();
      res.redirect('profile');
})


router.get("/kaarigar", function (req, res, next) {
  res.render("kaarigar");
});

router.get("/customer", async function (req, res, next) {
  const successMessage = req.flash('success')[0];

  const users = await userModel.find();
  res.render('customer', {users, successMessage});
});

router.get("/", function (req, res, next) {
  res.render("signup", { error: "" });
});

module.exports = router;
