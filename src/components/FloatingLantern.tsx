import React from "react";
import { motion } from "framer-motion";
import "./FloatingLantern.css";

interface FloatingLanternProps {
  color: string;
  size: "small" | "medium" | "large";
  delay: number;
  duration: number;
  startPosition: number;
  endPosition: number;
  swayAmount: number;
  horizontalPosition: number;
  onPop: () => void;
}

const FloatingLantern: React.FC<FloatingLanternProps> = ({ 
  color, 
  size,
  delay,
  duration,
  startPosition,
  endPosition,
  swayAmount,
  horizontalPosition,
  onPop
}) => {
  const sizes = {
    small: { width: 40, height: 60 },
    medium: { width: 60, height: 80 },
    large: { width: 80, height: 100 }
  };

  const handleClick = (e: React.MouseEvent) => {
    const target = e.currentTarget;
    target.classList.add('pop-animation');
    onPop();
    setTimeout(() => {
      target.classList.remove('pop-animation');
    }, 300);
  };

  return (
    <motion.div
      className="lantern-container"
      initial={{ 
        y: startPosition,
        x: horizontalPosition,
        opacity: 0
      }}
      animate={{ 
        y: endPosition,
        x: [
          horizontalPosition - swayAmount,
          horizontalPosition + (swayAmount * 0.5),
          horizontalPosition + swayAmount,
          horizontalPosition - (swayAmount * 0.5),
          horizontalPosition - swayAmount
        ],
        opacity: [0, 1, 1, 1, 0],
        rotate: [
          -3,
          3,
          -3
        ]
      }}
      transition={{ 
        y: {
          duration,
          ease: "linear",
          delay
        },
        x: {
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.25, 0.5, 0.75, 1]
        },
        rotate: {
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        },
        opacity: {
          duration: duration * 0.95,
          times: [0, 0.05, 0.1, 0.8, 1],
          delay
        }
      }}
      style={{
        ...sizes[size],
        position: 'absolute',
        pointerEvents: 'auto',
        cursor: 'inherit',
        visibility: 'visible'
      }}
      onClick={(e) => {
        const opacity = window.getComputedStyle(e.currentTarget).opacity;
        if (parseFloat(opacity) > 0.3) {
          handleClick(e);
        }
      }}
    >
      <div 
        className="lantern"
        style={{ 
          background: color,
          width: sizes[size].width,
          height: sizes[size].height
        }}
      >
        <div className="lantern-top"></div>
        <div className="lantern-body"></div>
        <div className="lantern-bottom"></div>
        <div className="lantern-light"></div>
        <div className="lantern-string"></div>
      </div>
    </motion.div>
  );
};

export default FloatingLantern;
