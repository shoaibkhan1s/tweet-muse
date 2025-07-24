import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Sparkles } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
          className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <span className="text-6xl font-bold gradient-text">404</span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-bold mb-4"
        >
          Page Not Found
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-muted-foreground mb-8"
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all duration-300"
          >
            <Home className="w-4 h-4" />
            Return to Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 glass border border-primary/20 text-foreground font-semibold rounded-xl hover:border-primary/40 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </motion.div>

        {/* Floating decoration */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-8 h-8 bg-accent/20 rounded-full blur-sm"
        />
        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-6 h-6 bg-primary/20 rounded-full blur-sm"
        />
      </motion.div>
    </div>
  );
};

export default NotFound;
