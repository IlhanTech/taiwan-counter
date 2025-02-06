import { motion } from "framer-motion";

interface ScoreProps {
  score: number;
}

const Score: React.FC<ScoreProps> = ({ score }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-8 left-1/2 transform -translate-x-1/2 
                 bg-black/30 backdrop-blur-sm rounded-lg p-6 
                 border-2 border-[#FFD700] z-10"
    >
      <div className="text-4xl font-bold text-[#FFD700]">
        Score : {score}
      </div>
    </motion.div>
  );
};

export default Score;
