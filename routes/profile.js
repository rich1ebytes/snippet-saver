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
  let { tag, content } = req.body;

  let post = await Post.create({
    user: user._id,
    tag: tag,
    content,
  });

  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});

router.get("/post/:id/edit", isLoggedIn, async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) return res.status(404).send("Post not found");

  res.render("edit", { post });
});

router.put("/post/:id", isLoggedIn, async (req, res) => {
  const { tag, content } = req.body;

  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send("Post not found");

  if (post.user.toString() !== req.user.userid) {
    return res.status(403).send("Unauthorized");
  }
  post.tag = tag;
  post.content = content;
  await post.save();
  res.redirect("/profile");
});

router.delete("/post/:id", isLoggedIn, async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) return res.status(404).send("Post not found");

  await Post.findByIdAndDelete(req.params.id);

  await User.findByIdAndUpdate(req.user.userid, {
    $pull: { posts: req.params.id },
  });

  res.redirect("/profile");
});

module.exports = router;
