const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user.model");
require("dotenv").config()



router.get("/login", passport.authenticate("twitter"))
router.get(
  "/callback",
  passport.authenticate("twitter", {
    failureRedirect: "/auth/twitter/failure",
  }),
 async (req, res) => {
  try{
    req.session.token = req.user.token;
    req.session.secret = req.user.tokenSecret;
 
    const user = new User({
      username: req.user.username,
      displayName: req.user.displayName,
      twitterId: req.user.id,
      avatar: req.user.photos[0]?.value,
    });
await user.save()

      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).send("Error saving session");
        }
        
        res.redirect(`${process.env.FRONTEND_URL}`);
      });
    
    }catch(err){
    console.log(err)
  }
  }
);

router.get("/failure", (req, res) => {
  res.send("❌ Twitter login failed.");
});

router.get("/logout", (req, res) => {
  try{
  req.logout(() => {
    res.redirect(`${process.env.FRONTEND_URL}`)
  })
  }catch(err){
    console.log(err)
  }
});

module.exports = router;
