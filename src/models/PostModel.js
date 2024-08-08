const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required."],
    minlength: [5, "Title must be at least 5 characters long."],
    maxlength: [100, "Title must be at most 100 characters long."],
  },

  content: {
    type: String,
    required: [true, "Content is required."],
    minlength: [10, "Content must be at least 10 characters long."],
    maxlength: [12000, "Content must be at most 12000 characters long."],
  },

  tags: {
    type: [String],
    maxlength: [5, "You can have a maximum of 5 tags."],
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Author is required."]
  },

  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },

  imagesUrl: {
    type: [String],
    maxlength: [5, "You can have a maximum of 5 images URL."],
  },
});

module.exports = mongoose.model("Post", postSchema);
