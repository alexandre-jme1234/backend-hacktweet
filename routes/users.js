var express = require("express");
var router = express.Router();

const User = require("../models/users");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

const { checkBody } = require("../modules/checkBody");

/* GET users listing. */
router.get("/", function (req, res, next) { 
  res.send("respond with a resource");
});

router.get("/signup", (req, res) => {
  User.find().then((data) => {
    console.log(data);
  });
});

router.post("/signup", (req, res) => {
  User.findOne({ email: req.body.email }).then((data) => {
    console.log("émission route _", req.body.email);
    if (data === null) {
      const token = uid2(32);
      const hash = bcrypt.hashSync("password", 10);

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        token: uid2(32),
      });

      newUser.save().then((newDoc) => {
        res.json({ result: true, token: newDoc.token });
        console.log("newDoc", newDoc);
      });
    } else {
      res.json({ result: false, error: "user already exists" });
    }
  });
});



router.post("/signin", (req, res) => {
  User.findOne({ name: req.body.name }).then((data) => {
    console.log('data : user find _ ', data);
    if (data !== null) {
      res.json({ result: true, token: data.token });
    } else {
      res.json({ result: false, error: "User not found or wrong password" });
    }
  });

});

module.exports = router;
