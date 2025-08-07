const express = require("express");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { isLoggedIn } = require("../middleware");
const { postCaptionToTwitter, postToTwitter } = require("../utils/tweetPoster");
const generateImagePrompt = require("../utils/promptMaker");
const { generateCaption } = require("../utils/caption");
const ExpressError = require("../utils/ExpressErrorHandler");
const Post = require("../models/post.model");
const User = require("../models/user.model");

const router = express.Router();


router.post("/post", isLoggedIn, async (req, res) => {
  try {
    const { token, secret, msg, filename } = req.body;
    let imageUrl = "";
    let imagePath = null;

    if (filename) {
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/${filename}`;
      imagePath = path.join("uploads", filename);
    }

    const user = await User.findOne({ twitterId: req.user.id });
    const tweetId = await postToTwitter(msg, imagePath, { token, secret });

    const post = new Post({
      user: user?._id,
      tweetId,
      caption: msg,
      imageUrl,
      createdAt: new Date(),
    });

    await post.save();
    res.json({ success: true, post });
  } catch (err) {
  
    res.status(500).json({ error: "Tweet failed" });
  }
});


router.post("/caption", isLoggedIn, async (req, res) => {
  try {
    const { token, secret, msg } = req.body;
    const tweetId = await postCaptionToTwitter(msg, { token, secret });

    const user = await User.findOne({ twitterId: req.user.id });

    const post = new Post({
      user: user?._id,
      tweetId,
      caption: msg,
      imageUrl: "",
      createdAt: new Date(),
    });

    await post.save();
    res.json({ success: true, message: "Caption posted successfully!" });
  } catch (err) {
   
    res.status(500).json({ error: "Failed to post caption" });
  }`rt`
});


router.post("/", isLoggedIn, async (req, res) => {
  try {
    const {
      interest,
      captionType,
      gender,
      language,
      targetAudience,
      captionLength,
      mood,
      emojiIntensity,
    } = req.body;

    const requiredParams = {
      interest, captionType, language, targetAudience, captionLength, mood, emojiIntensity
    };
    for (const [key, value] of Object.entries(requiredParams)) {
      if (value === undefined || value === null) {
        throw new ExpressError(`Missing or invalid parameter: ${key}`, 400);
      }
    }

    const caption = await generateCaption(
      interest, captionType, language, targetAudience, captionLength, mood, emojiIntensity
    );

    const prompt = await generateImagePrompt(caption, gender, interest);
   
     const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=42&model=flux&enhance=true`;

    const response = await fetch(imageUrl);
    if (!response.ok) throw new ExpressError("Failed to fetch image", 500);

    const buffer = await response.buffer();
    if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

    const filename = `${Date.now()}_generated.png`;
    const filepath = path.join("uploads", filename);
    fs.writeFileSync(filepath, buffer);

    await sharp(filepath)
      .metadata()
      .then(({ width, height }) =>
        sharp(filepath)
          .extract({ left: 0, top: 0, width, height: height - 56 })
          .toFile(path.join("uploads", `cropped_${filename}`))
      );

    const croppedFilename = `cropped_${filename}`;
    const croppedPath = path.join("uploads", croppedFilename);
    const newBuffer = fs.readFileSync(croppedPath);
    const base64Image = newBuffer.toString("base64");

    const publicImageUrl = `${req.protocol}://${req.get("host")}/uploads/${croppedFilename}`;

    res.json({
      success: true,
      caption,
      image: `data:image/png;base64,${base64Image}`,
      imageUrl: publicImageUrl,
      filename: croppedFilename,
    });
  } catch (err) {
 
    res.status(err.status || 500).json({ error: err.message || "Tweet generation failed" });
  }
});

module.exports = router;
