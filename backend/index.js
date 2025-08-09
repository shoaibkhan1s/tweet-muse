const express = require("express");
const app = express()
const session = require("express-session");
const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const twitterRoutes = require("./routes/twitter");
const tweetRoutes = require("./routes/tweetRoutes");
const userRoutes = require("./routes/userRoutes");
dotenv.config();


async function main() {
  await mongoose.connect(process.env.MONGO_URI);
}
main()
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ DB Error:", err));


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });


app.use(cors({
  origin: `${process.env.BASE_URL}`,
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/uploads", express.static("uploads"));


passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/twitter/callback`,
    },
    (token, tokenSecret, profile, done) => {
      profile.token = token;
      profile.tokenSecret = tokenSecret;
      return done(null, profile);
    }
  )
);



app.use("/auth/twitter", twitterRoutes);
app.use("/tweet", tweetRoutes);
app.use("/", userRoutes);



app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
