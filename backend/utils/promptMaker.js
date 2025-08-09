require("dotenv").config({ path: __dirname + "/../.env", override: true });
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function shouldIncludePeople(caption) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
Given the following caption, decide whether the scene should realistically include people or not.

Caption: "${caption}"

Answer only with "yes" if the scene would look natural and complete with people.
Answer only with "no" if the scene should be shown without any people.
Do not explain anything, just say "yes" or "no".
`,
  });

  const answer = response.text.trim().toLowerCase();
  return answer === "yes";
}

async function generateImagePrompt(
  caption,
  gender = "neutral",
  interest = "tech"
) {
  try {
    if (!caption || typeof caption !== "string" || caption.trim() === "") {
      throw new Error("Caption is required and must be a non-empty string.");
    }
    if (!["male", "female", "neutral"].includes(gender.toLowerCase())) {
      throw new Error("Gender must be 'male', 'female', or 'neutral'.");
    }

    let setting;
    switch (interest.toLowerCase()) {
      case "tech":
      case "devlife":
      case "productivity":
        setting =
          "a modern workspace with laptops, screens, and scattered notes";
        break;
      case "food":
        setting = "a cozy cafe or busy food court";
        break;
      case "fitness":
      case "gym":
        setting = "a bright, clean gym with visible weights and machines";
        break;
      case "travel":
        setting =
          "an open landscape — like mountains, beaches, or city streets";
        break;
      case "fashion":
        setting = "a trendy urban street or minimalist studio";
        break;
      case "music":
        setting = "a warm, moody music studio or small concert stage";
        break;
      case "funny":
      case "memes":
        setting = "a casual, random indoor or outdoor everyday place";
        break;
      case "health":
        setting = "a park trail, kitchen, or calm yoga corner";
        break;
      case "art":
        setting =
          "an art studio with visible paint, sketches, or creative mess";
        break;
      case "space":
      case "moon":
      case "universe":
        setting = "a wide space view — moon surface, stars, or galaxy";
        break;
      case "market":
      case "bazaar":
        setting = "a colorful, textured outdoor market or bazaar";
        break;
      default:
        setting =
          "a relatable everyday place — like a home desk or street bench";
    }

    const includePeople = await shouldIncludePeople(caption);

    let people;
    if (includePeople) {
      const groupInterests = [
        "tech",
        "devlife",
        "food",
        "fitness",
        "gym",
        "travel",
        "fashion",
        "music",
        "funny",
        "memes",
        "art",
      ];
      const isGroupSetting = groupInterests.includes(interest.toLowerCase());

      people = isGroupSetting
        ? gender === "male"
          ? "a group of young men"
          : gender === "female"
          ? "a group of young women"
          : "a diverse group of people"
        : gender === "male"
        ? "a young man"
        : gender === "female"
        ? "a young woman"
        : "a person";
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
Create a vivid, realistic image that visually expresses the emotion and vibe of this caption:

"${caption}"

Scene Requirements:

${
  includePeople
    ? `Show ${people} in ${setting}
The person(s) should have body language and facial expressions that reflect the tone of the caption.`
    : `Show only the ${setting} in full atmospheric detail. Do not include any people.`
}
  Specify a fitting camera shot like close-up, macro shot, wide-angle, or extreme close-up...

Use lighting to match the tone — examples: soft lighting, cinematic light, studio lighting, or golden hour.



Use soft, natural lighting or warm indoor tones.

No surreal, fantasy, cyberpunk, glitch, or abstract styles. Keep proportions natural.

The ${setting} must be clearly visible and match the caption's mood.

The image must be 1:1 in aspect ratio. Do not use surreal, cyberpunk, or abstract effects. Please do not add watermark.`,
      config: {
        systemInstruction: `
You're a top-level prompt engineer. Decide human presence based on context.

Caption: "${caption}"
Interest: ${interest}
Gender: ${gender}

${
  includePeople
    ? `Include people. Expressions and posture must reflect caption mood.`
    : `No people allowed. Focus on environmental storytelling only.`
}

Always end with: "The image must be 1:1 in aspect ratio. Do not use surreal, cyberpunk, or abstract effects. Please do not add watermark."
`,
      },
    });

    if (!response.text || typeof response.text !== "string") {
      throw new Error("Invalid response from AI model: No text generated.");
    }

    return response.text;
  } catch (error) {
    throw new Error(`Failed to generate image prompt: ${error.message}`);
  }
}

module.exports = generateImagePrompt;
