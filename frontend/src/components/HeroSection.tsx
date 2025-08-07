import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap } from "lucide-react";
import { useState, useEffect } from "react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  handleResize(); // call once on mount
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

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
     
 {!isMobile && (
  <motion.div
    className="fixed top-0 left-0 w-2.5 h-2.5 bg-primary rounded-full pointer-events-none z-50"
    animate={{
      x: mousePosition.x,
      y: mousePosition.y,
    }}
    transition={{ type: "spring", stiffness: 500, damping: 30 }}
    style={{ translateX: "-50%", translateY: "-50%" }}
  />
)}


      <div className="container mx-auto text-center relative z-10">
      
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
        <div className="mb-8 ">
          <motion.h1 
  className="text-6xl md:text-8xl lg:text-9xl font-bold leading-tight"
>

  <motion.div 
    className="flex flex-wrap justify-center gap-x-4"
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.2, duration: 0.8 }}
  >
    <span className="gradient-text mr-4">Generate...</span>
    <span className="gradient-accent-text">Post..</span>
  </motion.div>

  <motion.div 
    className="block text-foreground mt-4"
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.6, duration: 0.8 }}
  >
    Grow.
  </motion.div>
</motion.h1>

        </div>

      
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
        >
         Auto-generate viral tweets with AI.
No typing. No guesswork. Just results.
        </motion.p>

    
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
            className="group relative px-8 py-4 mb-2 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-shimmer bg-[length:200%_100%] animate-text-shimmer opacity-0 group-hover:opacity-100" />
            <span className="relative flex items-center gap-2 ">
              Get Started For Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </motion.button>

    
        </motion.div>

      
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

    </section>
  );
}