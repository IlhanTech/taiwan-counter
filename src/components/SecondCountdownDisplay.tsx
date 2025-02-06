import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { differenceInSeconds } from 'date-fns';
import { Clock } from 'lucide-react';
import type { TimeLeft } from '../types';

const TARGET_DATE = new Date('2026-06-30T00:00:00');

const calculateTimeLeft = (): TimeLeft => {
  const difference = differenceInSeconds(TARGET_DATE, new Date());
  return {
    days: Math.floor(difference / (60 * 60 * 24)),
    hours: Math.floor((difference / (60 * 60)) % 24),
    minutes: Math.floor((difference / 60) % 60),
    seconds: Math.floor(difference % 60)
  };
};

const getTaiwanTime = () => {
  return new Date().toLocaleString('fr-FR', {
    timeZone: 'Asia/Taipei',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

const getFranceTime = () => {
  return new Date().toLocaleString('fr-FR', {
    timeZone: 'Europe/Paris',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

const SecondCountdownDisplay = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [taiwanTime, setTaiwanTime] = useState(getTaiwanTime());
  const [franceTime, setFranceTime] = useState(getFranceTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
      setTaiwanTime(getTaiwanTime());
      setFranceTime(getFranceTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container mx-auto px-4 py-16 relative z-10 text-center">
      <div className="flex justify-center space-x-8 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-[#FFD700]"
        >
          <Clock className="w-6 h-6" />
          <span className="text-xl font-medium">
            Taiwan : {taiwanTime}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-[#FFD700]"
        >
          <Clock className="w-6 h-6" />
          <span className="text-xl font-medium">
            France : {franceTime}
          </span>
        </motion.div>
      </div>

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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <img 
          src="/chill-guy.png" 
          alt="Chill Guy" 
          className="mx-auto w-400 h-400 object-contain"
        />
      </motion.div>
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
          Just a chill guy who lives in Taiwan
        </p>
      </motion.div>
    </div>
  );
};

export default SecondCountdownDisplay;