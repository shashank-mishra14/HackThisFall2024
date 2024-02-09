var express = require("express");
var router = express.Router();
const userModel = require('./users');
const passport = require('passport');

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
  failureFlash: true
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

router.get("/profile", function (req, res, next) {
  res.render("profile");
});

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
