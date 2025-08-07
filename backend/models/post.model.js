const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const postSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required:true
  },
  tweetId: {
    type: String,
    required:true
},
    caption: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        requred: false,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;