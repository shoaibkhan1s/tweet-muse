import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export default function LoadingSpinner({ message = "Loading...", size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  const dotSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2", 
    lg: "w-3 h-3"
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Animated Dots */}
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={`${dotSizes[size]} bg-primary rounded-full`}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Spinning Icon */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="relative"
      >
        <Sparkles className={`${sizeClasses[size]} text-primary`} />
        <motion.div
          className="absolute inset-0 bg-primary/20 rounded-full blur-lg"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Loading Message */}
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-muted-foreground font-medium"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}