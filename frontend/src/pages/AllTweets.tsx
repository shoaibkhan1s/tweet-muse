import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { MessageSquare, Calendar, Image as ImageIcon, ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

interface Tweet {
  caption?: string;
  imageUrl?: string;
  createdAt?: string;
}

export default function AllTweets() {
  const [allTweets, setAllTweets] = useState<Tweet[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const seeTweets = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/seeTweets`,
          { withCredentials: true }
        );
        setAllTweets(res.data);
      } catch (err) {
        setError("");
      } finally {
        setIsLoading(false);
      }
    };
    seeTweets();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 glass rounded-xl border border-primary/20 text-primary hover:border-primary/40 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">
              Your Tweets
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            All your AI-generated tweets in one beautiful place
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <LoadingSpinner message="Loading your tweets..." size="lg" />
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="glass rounded-3xl p-8 border border-destructive/20 max-w-md mx-auto">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-xl font-bold text-destructive mb-2">Please Login</h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !error && allTweets.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="glass rounded-3xl p-12 border border-white/10 max-w-md mx-auto">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">No Tweets Yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't created any tweets yet. Start generating your first AI-powered content!
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all duration-300"
              >
                <Sparkles className="w-4 h-4" />
                Create Your First Tweet
              </Link>
            </div>
          </motion.div>
        )}

        {/* Tweets Grid */}
        {!isLoading && !error && allTweets.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <AnimatePresence>
              {allTweets.map((tweet, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group glass rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 relative overflow-hidden"
                >
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    {/* Tweet Content */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <MessageSquare className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium text-primary">Tweet Content</span>
                      </div>
                      
                      {tweet.caption ? (
                        <p className="text-foreground leading-relaxed">
                          {tweet.caption}
                        </p>
                      ) : (
                        <p className="text-muted-foreground italic">
                          No content available
                        </p>
                      )}
                    </div>

                    {/* Tweet Image */}
                    {tweet.imageUrl && (
                      <div className="mb-4 relative group/image">
                        <div className="flex items-center gap-2 mb-3">
                          <ImageIcon className="w-5 h-5 text-accent" />
                          <span className="text-sm font-medium text-accent">Image</span>
                        </div>
                        
                        <div className="relative overflow-hidden rounded-xl">
                          <motion.img
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                            src={tweet.imageUrl}
                            alt="Tweet"
                            className="w-full h-48 object-cover rounded-xl"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                    )}

                    {/* Tweet Date */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">
                        {formatDate(tweet.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="absolute top-4 right-4 w-2 h-2 bg-primary/40 rounded-full"
                  />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="absolute bottom-4 left-4 w-1 h-1 bg-accent/40 rounded-full"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Stats Section */}
        {!isLoading && !error && allTweets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <div className="glass rounded-2xl p-6 border border-white/10 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-lg font-semibold">Total Tweets</span>
              </div>
              <div className="text-3xl font-bold gradient-text">
                {allTweets.length}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                AI-generated content pieces
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}