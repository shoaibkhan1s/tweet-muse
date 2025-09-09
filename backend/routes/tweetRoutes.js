const express = require("express");
const fetch = require("node-fetch");
const sharp = require("sharp");
const axios = require("axios");
const { isLoggedIn } = require("../middleware");
const { postCaptionToTwitter, postToTwitter } = require("../utils/tweetPoster");
const generateImagePrompt = require("../utils/promptMaker");
const { generateCaption } = require("../utils/caption");
const ExpressError = require("../utils/ExpressErrorHandler");
const Post = require("../models/post.model");
const User = require("../models/user.model");
const cloudinary = require("../cloudinaryConfig");

const router = express.Router();

// Helper to upload buffer to Cloudinary
const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: "image", folder: "ai_generated" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
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

    const croppedBuffer = await sharp(buffer)
      .metadata()
      .then(({ width, height }) =>
        sharp(buffer)
          .extract({ left: 0, top: 0, width, height: height - 56 })
          .toBuffer()
      );

    const cloudinaryResult = await uploadToCloudinary(croppedBuffer);
    const publicImageUrl = cloudinaryResult.secure_url;
    const base64Image = croppedBuffer.toString("base64");

    res.json({
      success: true,
      caption,
      image: `data:image/png;base64,${base64Image}`,
      imageUrl: publicImageUrl,
      filename: cloudinaryResult.public_id,
    });

  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || "Tweet generation failed" });
  }
});

router.post("/post", isLoggedIn, async (req, res) => {
  try {
    const { token, secret, msg, filename } = req.body;

    const imageUrl = filename
      ? `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${filename}.png`
      : "";

    const imagePath = imageUrl || null;

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
  }
});

module.exports = router;