const express = require("express");
const { isLoggedIn } = require("../middleware");
const Post = require("../models/post.model");
const User = require("../models/user.model");
const ExpressError = require("../utils/ExpressErrorHandler");

const router = express.Router();

router.get("/me", (req, res) => {
    if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ user: null });
  }

});

router.get("/seeTweets", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findOne({ twitterId: req.user.id });
    if (!user) throw new ExpressError("User not found", 404);
    const posts = await Post.find({ user: user._id });
    res.json(posts);
  } catch (err) {
  
    res.status(err.status || 500).json({ error: err.message || "Failed to fetch tweets" });
  }
});

router.get("/auth/twitter/session", (req, res) => {
  if (req.session.token && req.session.secret) {
    res.json({
      user: req.user,
      token: req.session.token,
      secret: req.session.secret,
    });
  } else {
    res.status(401).json({ error: "No active session" });
  }
});

module.exports = router;
