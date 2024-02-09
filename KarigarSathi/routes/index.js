var express = require("express");
var router = express.Router();
const passport = require('passport');
const Session = require('express-session');
const userModel = require('./users');

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/login", function (req, res, next) {
  res.render("login");
});


router.post('/login',passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/signup",
  // failureFlash: true
}), function(req, res){});


router.post('/register', async function(req, res) {
  const { selectedOption, mobile, username, email, name, locationName, profession } = req.body;

  if (!username || !name || !mobile || !email || !selectedOption || !locationName) {
    return res.redirect('/signup');
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
        res.redirect('/signup', { error: err });
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

router.get("/customer", function (req, res, next) {
  res.render("customer");
});

router.get("/signup", function (req, res, next) {
  res.render("signup", { error: "" });
});

module.exports = router;
