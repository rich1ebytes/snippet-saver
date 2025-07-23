const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");


router.get("/login", (req, res) => {
  res.render("login");
});


router.post("/login", async (req, res) => {
  let { email, password } = req.body;

  let user = await User.findOne({ email });
  if (!user) return res.status(400).send("User does not Exist!!");

  bcrypt.compare(password, user.password, (err, result) => {
    let token = jwt.sign({ email: email, userid: user._id },process.env.JWT_SECRET);
    res.cookie("token", token);

    if (result) res.redirect("/profile");
    else res.status(400).send("Wrong mail or password!");
  });
});

module.exports = router;
