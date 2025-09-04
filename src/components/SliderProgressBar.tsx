"use client";

import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { showError } from '@/utils/toast';
import { cn } from '@/lib/utils';

interface SliderProgressBarProps {
  onComplete: () => void;
}

const SliderProgressBar: React.FC<SliderProgressBarProps> = ({ onComplete }) => {
  const [sliderValue, setSliderValue] = useState<number[]>([0]);
  const [currentEmoji, setCurrentEmoji] = useState("😭");

  useEffect(() => {
    const value = sliderValue[0];
    if (value >= 75) {
      setCurrentEmoji("😁");
    } else if (value >= 50) {
      setCurrentEmoji("🙂");
    } else if (value >= 25) {
      setCurrentEmoji("😒");
    } else {
      setCurrentEmoji("😭");
    }
  }, [sliderValue]);

  const handleContinue = () => {
    if (sliderValue[0] >= 85) {
      onComplete();
    } else {
      showError("Oh no! You need to slide a bit more to unlock the magic! Try again!");
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-md border border-blue-700/50 rounded-2xl p-8 shadow-2xl text-white max-w-lg w-full flex flex-col items-center text-center animate-fade-in-down"> {/* Futuristic panel */}
        <h2 className="text-3xl md:text-4xl font-anime font-bold mb-6 text-pink-400 drop-shadow-[0_0_15px_rgba(255,0,255,0.7)]"> {/* Neon text */}
          Excitement Level: Calibrate!
        </h2>
        <div className="text-7xl mb-8 transition-transform duration-300 ease-out" style={{ transform: `scale(${1 + sliderValue[0] / 200})` }}>
          {currentEmoji}
        </div>
        <Slider
          defaultValue={[0]}
          max={100}
          step={1}
          value={sliderValue}
          onValueChange={setSliderValue}
          className={cn("w-full mb-8 [&>span:first-child]:bg-gradient-to-r [&>span:first-child]:from-cyan-500 [&>span:first-child]:to-purple-500 [&>span:first-child]:shadow-lg [&>span:first-child]:shadow-cyan-500/50 [&>span:last-child]:bg-gray-700 [&>span:last-child]:border [&>span:last-child]:border-cyan-500/50 [&>span:last-child]:shadow-md [&>span:last-child]:shadow-cyan-500/30", {
            '[&>span:first-child]:from-red-500 [&>span:first-child]:to-orange-500 [&>span:first-child]:shadow-red-500/50': sliderValue[0] < 25,
            '[&>span:first-child]:from-orange-500 [&>span:first-child]:to-yellow-500 [&>span:first-child]:shadow-orange-500/50': sliderValue[0] >= 25 && sliderValue[0] < 50,
            '[&>span:first-child]:from-yellow-500 [&>span:first-child]:to-green-500 [&>span:first-child]:shadow-yellow-500/50': sliderValue[0] >= 50 && sliderValue[0] < 75,
            '[&>span:first-child]:from-green-500 [&>span:first-child]:to-blue-500 [&>span:first-child]:shadow-green-500/50': sliderValue[0] >= 75,
          })}
        />
        <Button
          onClick={handleContinue}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-anime py-6 text-lg rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 w-full border border-pink-400 drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]" // Glowing button
        >
          Continue Protocol
        </Button>
      </div>
    </div>
  );
};

export default SliderProgressBar;