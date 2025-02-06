import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { differenceInSeconds, format } from 'date-fns';
import { Clock } from 'lucide-react';
import type { TimeLeft } from '../types';

const TARGET_DATE = new Date('2025-08-30T00:00:00');

const calculateTimeLeft = (): TimeLeft => {
  const difference = differenceInSeconds(TARGET_DATE, new Date());
  return {
    days: Math.floor(difference / (60 * 60 * 24)),
    hours: Math.floor((difference / (60 * 60)) % 24),
    minutes: Math.floor((difference / 60) % 60),
    seconds: Math.floor(difference % 60)
  };
};

interface CountdownDisplayProps {
  onComplete: () => void;
}

const CountdownDisplay: React.FC<CountdownDisplayProps> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      setCurrentTime(new Date());
      
      if (newTimeLeft.days === 0 && 
          newTimeLeft.hours === 0 && 
          newTimeLeft.minutes === 0 && 
          newTimeLeft.seconds === 0) {
        clearInterval(timer);
        onComplete();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="container mx-auto px-4 py-16 relative z-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center space-x-2 text-[#FFD700] mb-4"
      >
        <Clock className="w-6 h-6" />
        <span className="text-xl font-medium">
          {format(currentTime, 'HH:mm:ss')}
        </span>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div
            key={unit}
            className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-[#FFD700]/20"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={value}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-4xl md:text-6xl font-bold text-[#FFD700]"
              >
                {value.toString().padStart(2, '0')}
              </motion.div>
            </AnimatePresence>
            <div className="text-sm md:text-base text-white/80 capitalize mt-2">
              {unit}
            </div>
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center max-w-2xl mx-auto"
      >
        <p className="text-2xl md:text-3xl mb-4 font-medium text-[#FFD700]">
          千里之行，始於足下
        </p>
        <p className="text-white/80 italic">
          A journey of a thousand miles begins with a single step
        </p>
      </motion.div>
    </div>
  );
};

export default CountdownDisplay;
