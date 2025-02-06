import { useEffect, useState } from 'react';
import FloatingLantern from './FloatingLantern';
import { motion } from 'framer-motion';
import Score from './Score';
import SecondCountdownDisplay from './SecondCountdownDisplay';
import CountdownDisplay from './CountdownDisplay';

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

const generateLanternProps = (windowWidth: number, windowHeight: number) => {
  const startPosition = windowHeight;
  const endPosition = -100;
  const distance = startPosition - endPosition;
  const speed = 100;
  const duration = distance / speed;

  return {
    id: Date.now() + Math.random(),
    color: [
      "#ff4500", "#FFD700", "#ff6b6b", "#FF69B4", "#9370DB",
      "#00CED1", "#FFA500", "#FF1493", "#7B68EE", "#20B2AA"
    ][Math.floor(Math.random() * 10)],
    size: ["small", "medium", "large"][Math.floor(Math.random() * 3)] as "small" | "medium" | "large",
    duration: duration,
    delay: randomBetween(0, 5),
    horizontalPosition: randomBetween(25, windowWidth - 100),
    swayAmount: randomBetween(10, 30),
    startPosition: startPosition,
    endPosition: endPosition,
  };
};

export const CountdownTimer = () => {
  const [isGameMode, setIsGameMode] = useState(false);
  const [gameTimeLeft, setGameTimeLeft] = useState(10);
  const [score, setScore] = useState(0);
  const [showEndAnimation, setShowEndAnimation] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [lanterns, setLanterns] = useState<Array<any>>(() => {
    return Array.from({ length: 20 }, () =>
      generateLanternProps(window.innerWidth, window.innerHeight)
    );
  });

  const [audioInitialized, setAudioInitialized] = useState(false);
  const [ambientMusic] = useState(() => {
    const audio = new Audio('/assets/music-chill.mp3');
    audio.loop = true;
    audio.volume = 0.2;
    return audio;
  });

  const [backgroundMusic] = useState(() => {
    const audio = new Audio('/assets/music.mp3');
    audio.loop = true;
    audio.volume = 0.7;
    return audio;
  });

  const [popSound] = useState(() => {
    const audio = new Audio('/assets/pop-balloon.mp3');
    audio.volume = 0.3;
    return audio;
  });

  const [showSecondTimer, setShowSecondTimer] = useState(false);

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!audioInitialized) {
        ambientMusic.play().then(() => {
          setAudioInitialized(true);
        }).catch(console.error);
      }
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [audioInitialized]);

  const startGame = () => {
    setIsGameMode(true);
    setGameTimeLeft(10);
    setScore(1);
    ambientMusic.pause();
    backgroundMusic.play().catch(console.error);
  };

  const endGame = () => {
    setShowEndAnimation(true);
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    ambientMusic.play().catch(console.error);
    setTimeout(() => {
      setIsGameMode(false);
      setShowEndAnimation(false);
      setScore(0);
      setLanterns(Array.from({ length: 20 }, () => 
        generateLanternProps(window.innerWidth, window.innerHeight)
      ));
    }, 3000);
  };

  useEffect(() => {
    let interval: number;
    if (isGameMode) {
      interval = setInterval(() => {
        setLanterns(prevLanterns => {
          const updatedLanterns = prevLanterns.filter(lantern => {
            const elapsedTime = (Date.now() - lantern.id) / 10000;
            return elapsedTime < lantern.duration;
          });
          
          const newLanterns = Array.from({ length: 3 }, () => 
            generateLanternProps(windowSize.width, window.innerHeight)
          );
          return [...updatedLanterns, ...newLanterns];
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGameMode, windowSize]);

  useEffect(() => {
    let timer: number;
    if (isGameMode && gameTimeLeft > 0) {
      timer = setInterval(() => {
        setGameTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGameMode, gameTimeLeft]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePop = (id: number) => {
    if (popSound) {
      popSound.currentTime = 0;
      popSound.play().catch(console.error);
    }

    if (!isGameMode) {
      startGame();
    } else {
      setScore(prev => prev + 1);
    }
    
    setLanterns(prevLanterns => {
      const lanternIndex = prevLanterns.findIndex(l => l.id === id);
      if (lanternIndex === -1) return prevLanterns;

      const newLanterns = [...prevLanterns];
      newLanterns[lanternIndex] = generateLanternProps(windowSize.width, windowSize.height);
      return newLanterns;
    });
  };

  useEffect(() => {
    return () => {
      ambientMusic.pause();
      backgroundMusic.pause();
      ambientMusic.currentTime = 0;
      backgroundMusic.currentTime = 0;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {!isGameMode && !showEndAnimation && !showSecondTimer && (
        <CountdownDisplay onComplete={() => setShowSecondTimer(true)} />
      )}

      {!isGameMode && !showEndAnimation && showSecondTimer && (
        <SecondCountdownDisplay />
      )}

      {isGameMode && (
        <Score score={score} />
      )}

      {showEndAnimation && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
        >
          <motion.div 
            className="text-center"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            <h2 className="text-8xl font-bold text-[#FFD700] mb-4">BIEN JOUÉ !</h2>
            <p className="text-4xl text-white">Score final : {score}</p>
          </motion.div>
        </motion.div>
      )}

      {lanterns.map((props) => (
        <FloatingLantern 
          key={props.id}
          {...props}
          onPop={() => handlePop(props.id)}
        />
      ))}
    </div>
  );
};
