const express = require("express");
const router = express.Router();


const User = require("../models/user");
const Post = require("../models/post");
const isLoggedIn = require("../middleware/verify");

router.get("/profile", isLoggedIn, async (req, res) => {
  let user = await User.findOne({ email: req.user.email }).populate("posts");
  res.render("profile", { user });
});

router.post("/post", isLoggedIn, async (req, res) => {
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


module.exports = router;