import { motion, AnimatePresence } from "framer-motion";
import { useComboStore } from "@/src/game/store";
import { useEffect, useState } from "react";

const COMBO_DECAY_THRESHOLD_MS = 5000;

export const Combo = () => {
  const { count, multiplier, checkAndApplyDecay, lastSuccessTimestamp } = useComboStore();
  const [elapsed, setElapsed] = useState(0);

  // Check for combo decay every 100ms and update timer display
  useEffect(() => {
    const decayTimer = setInterval(() => {
      checkAndApplyDecay();
      
      // Update elapsed time for progress bar
      if (count > 0) {
        const now = Date.now();
        const timeSinceLastHit = now - lastSuccessTimestamp;
        const progress = Math.max(0, 100 - (timeSinceLastHit / COMBO_DECAY_THRESHOLD_MS) * 100);
        setElapsed(progress);
      } else {
        setElapsed(0);
      }
    }, 100);

    return () => clearInterval(decayTimer);
  }, [checkAndApplyDecay, count, lastSuccessTimestamp]);

  // Dynamic styling based on combo count
  const getComboStyles = () => {
    if (count >= 10) {
      return {
        textSize: "text-9xl",
        color: "text-red-500",
        glow: "drop-shadow-[0_0_30px_rgba(239,68,68,1)]",
        scale: 1.3,
        barColor: "bg-red-500",
      };
    }
    if (count >= 6) {
      return {
        textSize: "text-8xl",
        color: "text-yellow-500",
        glow: "drop-shadow-[0_0_25px_rgba(234,179,8,0.9)]",
        scale: 1.2,
        barColor: "bg-yellow-500",
      };
    }
    if (count >= 3) {
      return {
        textSize: "text-7xl",
        color: "text-cyan-400",
        glow: "drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]",
        scale: 1.1,
        barColor: "bg-cyan-400",
      };
    }
    return {
      textSize: "text-6xl",
      color: "text-orange-500",
      glow: "drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]",
      scale: 1,
      barColor: "bg-orange-500",
    };
  };

  const styles = getComboStyles();

  return (
    <div className="fixed top-30 right-90 pointer-events-none">
      
      <AnimatePresence mode="popLayout">
        {count >= 2 && (
          <motion.div
            key={count}
            initial={{ scale: 0.5, opacity: 0, x: 20 }}
            animate={{ scale: styles.scale, opacity: 1, x: 0 }}
            exit={{ scale: 1.5, opacity: 0, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            className="flex flex-col items-end"
          >
            <h2 className={`${styles.textSize} font-black italic ${styles.color} ${styles.glow}`}>
              {count} <span className="text-2xl">COMBO</span>
            </h2>
            <p className="text-xl font-bold text-yellow-300">
              {/* {multiplier}x DAMAGE */}
            </p>
            
            {/* Progress Bar */}
            <div className="w-40 h-2 bg-gray-800 rounded-full mt-2 overflow-hidden border border-gray-600">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: `${elapsed}%` }}
                transition={{ type: "tween", duration: 0.1 }}
                className={`h-full ${styles.barColor} shadow-lg`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};