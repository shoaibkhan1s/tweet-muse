const axios = require("axios");
const { TwitterApi } = require("twitter-api-v2");

async function postToTwitter(caption, imageUrl, { token, secret }) {
  try {
    const client = new TwitterApi({
      appKey: process.env.TWITTER_CONSUMER_KEY,
      appSecret: process.env.TWITTER_CONSUMER_SECRET,
      accessToken: token,
      accessSecret: secret,
    });

    let mediaId = null;

    if (imageUrl) {
      const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
      const mediaData = Buffer.from(response.data, "binary");

      mediaId = await client.v1.uploadMedia(mediaData, {
        mimeType: "image/png",
      });
    }

    const tweetOptions = {
      text: caption,
    };

    if (mediaId) {
      tweetOptions.media = { media_ids: [mediaId] };
    }

    const { data } = await client.v2.tweet(tweetOptions);
    return data.id;

  } catch (err) {
    throw err;
  }
}

async function postCaptionToTwitter(caption, { token, secret }) {
  try {
    const client = new TwitterApi({
      appKey: process.env.TWITTER_CONSUMER_KEY,
      appSecret: process.env.TWITTER_CONSUMER_SECRET,
      accessToken: token,
      accessSecret: secret,
    });

    const { data } = await client.v2.tweet({ text: caption });
    return data.id;

  } catch (err) {
    throw err;
  }
}

module.exports = { postToTwitter, postCaptionToTwitter };