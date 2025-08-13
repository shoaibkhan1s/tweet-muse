import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { 
  Sparkles, 
  Settings, 
  Wand2, 
  Share, 
  Image as ImageIcon, 
  MessageSquare,
  User,
  LogOut,
  Eye,
  EyeOff
} from "lucide-react";
import HeroSection from "../components/HeroSection";
import LoadingSpinner from "../components/LoadingSpinner";

axios.defaults.withCredentials = true;

export default function Home() {
  const [token, setToken] = useState(null);
  const [secret, setSecret] = useState(null);
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  // Form states
  const [interest, setInterest] = useState("tech");
  const [captionType, setCaptionType] = useState("motivational");
  const [gender, setGender] = useState("male");
  const [language, setLanguage] = useState("english");
  const [targetAudience, setTargetAudience] = useState("general");
  const [captionLength, setCaptionLength] = useState("medium");
  const [mood, setMood] = useState("happy");
  const [emojiIntensity, setEmojiIntensity] = useState("minimal");
  
  // UI states
  const [msg, setMsg] = useState("");
  const [image, setImage] = useState(null);
  const [filename, setFilename] = useState("");
  const [loading, setLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [captionLoading, setCaptionLoading] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);
  const [captionSuccess, setCaptionSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
const [isPostBtnClick, setIsPostBtnClick] = useState(false);
  // Configuration options
  const interests = [
    "Tech", "Funny", "Finance", "Memes", "Motivation", "DevLife", "Gaming",
    "Cyber Security", "Health", "Education", "Fitness", "Travel", "Food",
    "Fashion", "Music", "Art", "Sports", "News", "Lifestyle", "AI", "Startups",
    "Productivity", "Emotional Growth", "Spirituality", "Business", "Marketing", "Books",
    "Cryptocurrency", "Web3", "Blockchain", "Sustainability", "Mental Health",
    "Parenting", "Relationships", "Photography", "Movies", "TV Shows", "Anime",
    "Entrepreneurship", "Career Advice", "Self Improvement", "Science", "History",
    "DIY Projects", "Pets", "Adventure", "Pop Culture", "Gadgets", "Space Exploration",
    "Social Media", "Fitness Challenges"
  ];

  const captionStyles = [
    { value: "motivational", label: "Motivational Speaker" },
    { value: "funny", label: "Funny Tone" },
    { value: "savage", label: "Savage" },
    { value: "weird", label: "Weirdly Cool" },
    { value: "chill", label: "Chill & Relatable" },
    { value: "meme-lord", label: "Meme-Lord" },
    { value: "professor-vibes", label: "Professor Vibes" },
    { value: "soft-aesthetic", label: "Soft Aesthetic" },
    { value: "future-forward", label: "Future-Forward" },
    { value: "hustle-culture", label: "Hustle Culture" },
    { value: "minimalist", label: "Minimalist" },
    { value: "ceo-grindset", label: "CEO Grindset" },
    { value: "growth-guru", label: "Growth Guru" },
    { value: "page-turner", label: "Page-Turner" },
    { value: "poetic", label: "Poetic & Lyrical" },
    { value: "nerdy", label: "Nerdy & Geeky" },
    { value: "retro", label: "Retro Vibes" },
    { value: "edgy", label: "Edgy & Bold" },
    { value: "wholesome", label: "Wholesome & Heartfelt" },
    { value: "sarcastic", label: "Sarcastic & Witty" },
    { value: "dreamy", label: "Dreamy & Imaginative" },
    { value: "professional", label: "Professional & Polished" },
    { value: "youthful", label: "Youthful & Energetic" },
    { value: "mystical", label: "Mystical & Spiritual" },
    { value: "epic", label: "Epic & Cinematic" }
  ];

  const genders = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "neutral", label: "Neutral" },
  ];

  const languages = [
    { value: "english", label: "English" },
    { value: "hindi", label: "Hindi" },
    { value: "spanish", label: "Spanish" },
    { value: "hinglish", label: "Hinglish" },
    { value: "french", label: "French" },
    { value: "german", label: "German" },
    { value: "chinese", label: "Chinese (Mandarin)" },
    { value: "punjabi", label: "Punjabi" },
    { value: "japanese", label: "Japanese" },
    { value: "russian", label: "Russian" },
    { value: "arabic", label: "Arabic" },
    { value: "portuguese", label: "Portuguese" },
    { value: "italian", label: "Italian" },
    { value: "bengali", label: "Bengali" },
    { value: "urdu", label: "Urdu" },
    { value: "turkish", label: "Turkish" },
    { value: "korean", label: "Korean" },
    { value: "persian", label: "Persian" },
    { value: "swahili", label: "Swahili" },
    { value: "dutch", label: "Dutch" },
    { value: "greek", label: "Greek" },
    { value: "thai", label: "Thai" },
    { value: "polish", label: "Polish" },
    { value: "romanian", label: "Romanian" },
    { value: "hungarian", label: "Hungarian" },
    { value: "czech", label: "Czech" },
    { value: "hebrew", label: "Hebrew" },
    { value: "indonesian", label: "Indonesian" },
    { value: "malay", label: "Malay" },
    { value: "vietnamese", label: "Vietnamese" },
    { value: "filipino", label: "Filipino" },
    { value: "swedish", label: "Swedish" },
    { value: "tamil", label: "Tamil" },
    { value: "telugu", label: "Telugu" },
    { value: "marathi", label: "Marathi" },
    { value: "gujarati", label: "Gujarati" },
    { value: "kannada", label: "Kannada" },
    { value: "malayalam", label: "Malayalam" },
    { value: "odia", label: "Odia" },
    { value: "assamese", label: "Assamese" },
    { value: "sindhi", label: "Sindhi" },
    { value: "nepali", label: "Nepali" },
    { value: "sinhala", label: "Sinhala" },
    { value: "finnish", label: "Finnish" },
    { value: "norwegian", label: "Norwegian" },
    { value: "danish", label: "Danish" },
    { value: "ukrainian", label: "Ukrainian" },
    { value: "bhojpuri", label: "Bhojpuri" },
    { value: "maithili", label: "Maithili" },
    { value: "sanskrit", label: "Sanskrit" }
  ];

  const targetAudiences = [
    { value: "general", label: "General" },
    { value: "teenagers", label: "Teenagers" },
    { value: "professionals", label: "Professionals" },
    { value: "students", label: "Students" },
    { value: "entrepreneurs", label: "Entrepreneurs" },
    { value: "parents", label: "Parents" },
    { value: "gamers", label: "Gamers" },
    { value: "fitness-enthusiasts", label: "Fitness Enthusiasts" },
    { value: "techies", label: "Tech Enthusiasts" },
    { value: "creatives", label: "Creatives (Artists/Designers)" },
    { value: "foodies", label: "Foodies" },
    { value: "travelers", label: "Travelers" },
    { value: "investors", label: "Investors" },
    { value: "students-college", label: "College Students" },
    { value: "job-seekers", label: "Job Seekers" },
    { value: "freelancers", label: "Freelancers" },
    { value: "small-business-owners", label: "Small Business Owners" },
    { value: "content-creators", label: "Content Creators" },
    { value: "activists", label: "Social Activists" },
    { value: "seniors", label: "Seniors" }
  ];

  const captionLengths = [
    { value: "very-short", label: "Very Short (<30 chars)" },
    { value: "short", label: "Short (30-80 chars)" },
    { value: "medium", label: "Medium (80-150 chars)" },
    { value: "long", label: "Long (150-220 chars)" },
    { value: "max", label: "Max (220-280 chars)" }
  ];

  const moods = [
    { value: "happy", label: "Happy" },
    { value: "inspirational", label: "Inspirational" },
    { value: "sarcastic", label: "Sarcastic" },
    { value: "nostalgic", label: "Nostalgic" },
    { value: "curious", label: "Curious" },
    { value: "excited", label: "Excited" },
    { value: "calm", label: "Calm" },
    { value: "angry", label: "Angry" },
    { value: "hopeful", label: "Hopeful" },
    { value: "playful", label: "Playful" },
    { value: "serious", label: "Serious" },
    { value: "romantic", label: "Romantic" },
    { value: "confident", label: "Confident" },
    { value: "mysterious", label: "Mysterious" },
    { value: "grateful", label: "Grateful" }
  ];

  const emojiIntensities = [
    { value: "none", label: "No Emojis" },
    { value: "minimal", label: "Minimal Emojis" },
    { value: "moderate", label: "Moderate Emojis" },
    { value: "heavy", label: "Heavy Emojis" }
  ];

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/auth/twitter/session`,
          { withCredentials: true }
        );
        setUser(res.data.user);
        setToken(res.data.token);
        setSecret(res.data.secret);
      } catch (err) {
        throw new err
      }
    };
    fetchSession();
  }, []);

  const handleGetStarted = () => {
    if (!token || !secret) {
      window.location.href = `${import.meta.env.VITE_BASE_URL}/auth/twitter/login`;
    } else {
      setShowForm(true);
    }
  };

  const generatePost = async () => {
    setLoading(true);
    setMsg("");
    setPostSuccess(false);
    setCaptionSuccess(false);
    setIsPostBtnClick(false)
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/tweet`, {
        token,
        secret,
        interest,
        captionType,
        gender,
        language,
        targetAudience,
        captionLength,
        mood,
        emojiIntensity,
      });
      setImage(res.data.image || null);

      setMsg(res.data.caption || "Tweet generated!");
      console.log(image)
      console.log(msg)
      setFilename(res.data.filename || "");
    } catch (err) {
      setMsg("❌ Something went wrong!");
    }
    setLoading(false);
  };

  const handlePostCaption = async () => {
    setCaptionLoading(true);
    setIsPostBtnClick(true)
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/tweet/caption`,
        { token, secret, msg }
      );
      setCaptionSuccess(true);
    } catch (err) {
      setMsg("❌ Something went wrong!");
    }
    setCaptionLoading(false);
  };

  const handlePost = async () => {
    setPostLoading(true);
    setIsPostBtnClick(true)
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/tweet/post`,
        { token, secret, msg, filename },
        { withCredentials: true }
      );
      setPostSuccess(true);
    } catch (err) {
      setMsg("❌ Something went wrong!");
    }
    setPostLoading(false);
  };

  const logout = () => {
    window.location.href = `${import.meta.env.VITE_BASE_URL}/auth/twitter/logout`;
  };

  if (!token || !secret) {
    return (
      <div className="min-h-screen">
        <HeroSection onGetStarted={handleGetStarted} />
      </div>
    );
  }

  if (!showForm) {
    return (
      <div className="min-h-screen">
        <HeroSection onGetStarted={handleGetStarted} />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            {user?.photos?.[0]?.value && (
              <motion.img
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                src={user.photos[0].value}
                alt="User avatar"
                className="w-16 h-16 rounded-2xl border-2 border-primary/20"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                Welcome back, {user?.displayName}!
              </h1>
              <p className="text-muted-foreground">Create your next viral tweet</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={logout}
              className="p-3 glass rounded-xl border border-destructive/20 text-destructive hover:border-destructive/40 transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Configuration Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-3xl p-8 mb-8 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-8">
            <Settings className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Configuration</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Configuration options */}
            {[
              { label: "Interest", value: interest, setter: setInterest, options: interests.map(opt => ({ value: opt.toLowerCase(), label: opt })) },
              { label: "Caption Style", value: captionType, setter: setCaptionType, options: captionStyles },
              { label: "Gender", value: gender, setter: setGender, options: genders },
              { label: "Language", value: language, setter: setLanguage, options: languages },
              { label: "Target Audience", value: targetAudience, setter: setTargetAudience, options: targetAudiences },
              { label: "Caption Length", value: captionLength, setter: setCaptionLength, options: captionLengths },
              { label: "Mood", value: mood, setter: setMood, options: moods },
              { label: "Emoji Intensity", value: emojiIntensity, setter: setEmojiIntensity, options: emojiIntensities }
            ].map((config, index) => (
              <motion.div
                key={config.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="space-y-3"
              >
                <label className="block text-sm font-medium text-muted-foreground">
                  {config.label}
                </label>
                <select
                  className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                  value={config.value}
                  onChange={(e) => config.setter(e.target.value)}
                >
                  {config.options.map((option) => (
                    <option 
                      key={option.value} 
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </motion.div>
            ))}
          </div>

          {/* Generate Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generatePost}
              disabled={loading}
              className="group relative  px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              <div className="relative flex items-center gap-3">
                {loading ? (
                  <LoadingSpinner message="Generating..." size="sm"  />
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Generate Tweet
                  </>
                )}
              </div>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Generated Content */}
        <AnimatePresence>
          {msg && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass rounded-3xl p-8 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold">Generated Content</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowPreview(!showPreview)}
                  className="ml-auto p-2 glass rounded-lg border border-primary/20"
                >
                  {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </motion.button>
              </div>

              {!showPreview ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-3">
                      Edit Caption
                    </label>
                    <textarea
                      className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 min-h-[120px]"
                      value={msg}
                      onChange={(e) => setMsg(e.target.value)}
                      placeholder="Your tweet content..."
                    />
                  </div>

                  {image && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group"
                    >
                      <img
                        src={image}
                        alt="Generated"
                        className="w-full rounded-2xl border border-border"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePostCaption}
                      disabled={captionLoading || captionSuccess || isPostBtnClick}
                      className="flex-1 px-6  py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all duration-300 disabled:opacity-50"
                    >
                      {captionLoading ? (
                        <LoadingSpinner message="Posting..." size="sm" />
                      ) : captionSuccess ? (
                        "✅ Caption Posted on X"
                      ) : (
                        "Post Caption on X"
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePost}
                      disabled={postLoading || postSuccess || isPostBtnClick}
                      className="flex-1 px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-xl hover:bg-accent/90 transition-all duration-300 disabled:opacity-50"
                    >
                      {postLoading ? (
                        <LoadingSpinner message="Posting..." size="sm" />
                      ) : postSuccess ? (
                        "✅ Posted with Image"
                      ) : (
                        "Post with Image on X"
                      )}
                    </motion.button>
                  </div>
                </div>
              ) : (
                // Twitter Preview
                <div className="bg-[#000] border border-gray-800 rounded-2xl p-6 text-white">
                  <div className="flex items-start gap-3">
                    <img
                      src={user?.photos?.[0]?.value}
                      alt="User avatar"
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold">{user?.displayName}</span>
                        <span className="text-gray-500">@{user?.username}</span>
                        <span className="text-gray-500 text-sm">· now</span>
                      </div>
                      <p className="whitespace-pre-wrap mb-4">{msg}</p>
                      {image && (
                        <img
                          src={image}
                          alt="Generated"
                          className="rounded-2xl border border-gray-800 max-w-full"
                        />
                      )}
                      <div className="mt-4 flex text-gray-500 text-sm justify-around border-t border-gray-800 pt-4">
                        <span>💬 0</span>
                        <span>🔁 0</span>
                        <span>❤️ 0</span>
                        <span>📊</span>
                        <span>🔗</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}