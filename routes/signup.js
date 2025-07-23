const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user"); 

router.post("/signup", async (req, res) => {
  const { name, email, password, luckynumber } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(500).send("User already exists");

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return res.status(500).send("Error generating salt");

    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) return res.status(500).send("Error hashing password");

      const newUser = await User.create({
        name,
        email,
        password: hash,
        luckynumber,
      });

      const token = jwt.sign({ email: newUser.email, userid: newUser._id }, process.env.JWT_SECRET);
      res.cookie("token", token);
      res.redirect("/profile");
    });
  });
});

module.exports = router;
