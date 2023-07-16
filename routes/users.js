var express = require("express");
var router = express.Router();

const User = require("../models/users");
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

const { checkBody } = require('../modules/checkBody');

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get('/signup', (req, res) => {
	User.find().then(data => {
      console.log(data)
	});
});


router.post('/signup', (req, res) => {
  User.findOne({ email: req.body.email })
  .then(data => {
    console.log('réception route _',data)
    if(data === null) {
      const token = uid2(32);
      const hash = bcrypt.hashSync('password', 10);

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        token: uid2(32),
      });

      newUser.save().then(newDoc => {
        res.json({ result: true, token: newDoc.token, password: newDoc.password });
      });
    } else {
      res.json({ result: false, error: 'user already exists' });
    }
  });
})

router.get('/signin', (req, res) => {
  User.findOne({ name: req.body.name }).then(data => {
    console.log('password', data.password)
    console.log('password req', req.body.password)
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token });
    } else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  });
})


router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

// SIGNIN: recherche dans le modèle User, un 

  User.findOne({ name: req.body.name }).then(data => {
    if (data) {
      res.json({ result: true, token: data.token });
    } else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  });
});



module.exports = router;
