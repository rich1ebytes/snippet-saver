const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  luckynumber: Number,
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post" // Match the model name exactly
    }
  ]
});

module.exports = mongoose.model("User", userSchema); // Use capital "User"
