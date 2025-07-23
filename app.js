const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");

const User = require("./models/user");
const Post = require("./models/post");
const isLoggedIn = require("./middleware/verify");


require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/signup", async (req, res) => {
  let { name, email, password, luckynumber } = req.body;

  let user = await User.findOne({ email });
  if (user) return res.status(500).send("User already exists");

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return res.status(500).send("Error generating salt");

    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) return res.status(500).send("Error hashing password");

      let user = await User.create({
        name,
        email,
        password: hash,
        luckynumber,
      });

      let token = jwt.sign({ email: email, userid: user._id }, process.env.JWT_SECRET);
      res.cookie("token", token);

      res.send("Registered");
    });
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  let { email, password } = req.body;

  let user = await User.findOne({ email });
  if (!user) return res.status(500).send("Something went wrong!");

  bcrypt.compare(password, user.password, (err, result) => {
    let token = jwt.sign({ email: email, userid: user._id },process.env.JWT_SECRET);
    res.cookie("token", token);

    if (result) res.status(200).send("Logged in successfully!");
    else res.redirect("/login");
  });
});

app.get("/profile", isLoggedIn, async (req, res) => {
  let user = await User.findOne({ email: req.user.email }).populate("posts");
  res.render("profile", { user });
});

app.post("/post", isLoggedIn, async (req, res) => {
  let user = await User.findOne({ email: req.user.email });
  let { content } = req.body;

  let post = await Post.create({
    user: user._id,
    content,
  });

  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});

app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("login");
});


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
 //Server starts after DB connection
    app.listen(3000, () => {
      console.log("Server: http://localhost:3000");
    });
  })

