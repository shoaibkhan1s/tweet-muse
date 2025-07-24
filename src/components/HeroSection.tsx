import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap } from "lucide-react";
import { useState, useEffect } from "react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const textRevealVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const magneticVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
    },
    tap: { scale: 0.95 }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      {/* Magnetic cursor effect */}
      <motion.div
        className="fixed w-4 h-4 bg-primary/30 rounded-full pointer-events-none z-50 blur-sm"
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />

      {/* Hero Content */}
      <div className="container mx-auto text-center relative z-10">
        {/* Animated Badge */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-6 py-3 mb-8 glass rounded-full border border-primary/20"
        >
          <Zap className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-sm font-medium text-primary">AI-Powered Content Creation</span>
          <Sparkles className="w-4 h-4 text-accent animate-pulse" />
        </motion.div>

        {/* Main Heading with Text Reveal */}
        <div className="mb-8 overflow-hidden">
          <motion.h1 
            className="text-6xl md:text-8xl lg:text-9xl font-bold leading-none"
          >
            <motion.div 
              className="block gradient-text"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Create
            </motion.div>
            <motion.div 
              className="block gradient-accent-text"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Stunning
            </motion.div>
            <motion.div 
              className="block text-foreground"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Content
            </motion.div>
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Transform your social media presence with AI-powered tweet generation. 
          Create engaging content that resonates with your audience and grows your following.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <motion.button
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGetStarted}
            className="group relative px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-shimmer bg-[length:200%_100%] animate-text-shimmer opacity-0 group-hover:opacity-100" />
            <span className="relative flex items-center gap-2">
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </motion.button>

          <motion.button
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group px-8 py-4 glass border border-primary/20 text-foreground font-semibold rounded-2xl hover:border-primary/40 transition-all duration-300"
          >
            <span className="flex items-center gap-2">
              Watch Demo
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            </span>
          </motion.button>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute top-1/4 left-10 w-20 h-20 bg-primary/10 rounded-full blur-2xl animate-float"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-1/4 right-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-float"
          style={{ animationDelay: '1s' }}
        />
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-sm font-medium">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-primary/30 rounded-full p-1"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-primary rounded-full mx-auto"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}