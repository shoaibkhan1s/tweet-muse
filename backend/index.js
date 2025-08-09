const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const MongoStore = require("connect-mongo");

const twitterRoutes = require("./routes/twitter");
const tweetRoutes = require("./routes/tweetRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

// Trust proxy for secure cookies behind Render's proxy
app.set("trust proxy", 1);

// Connect to MongoDB
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ DB Error:", err);
  }
})();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// CORS config
app.use(cors({
  origin: process.env.FRONTEND_URL, // e.g. "https://your-site.netlify.app"
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Session config
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      httpOnly: true,
      secure: true,        // HTTPS required
      sameSite: "none"     // Allow cross-site cookies
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/uploads", express.static("uploads"));

// Passport serialize/deserialize
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Twitter Strategy
passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/twitter/callback`
    },
    (token, tokenSecret, profile, done) => {
      profile.token = token;
      profile.tokenSecret = tokenSecret;
      return done(null, profile);
    }
  )
);

// Routes
app.use("/auth/twitter", twitterRoutes);
app.use("/tweet", tweetRoutes);
app.use("/", userRoutes);

// Start server
app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
