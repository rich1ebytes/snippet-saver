const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  tag: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Post", postSchema);
