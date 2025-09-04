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
      setCurrentEmoji("🤩"); // More excited anime emoji
    } else if (value >= 50) {
      setCurrentEmoji("😊");
    } else if (value >= 25) {
      setCurrentEmoji("😐");
    } else {
      setCurrentEmoji("🥺"); // More expressive anime emoji
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
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl text-white max-w-lg w-full flex flex-col items-center text-center animate-fade-in-down">
        <h2 className="text-3xl md:text-4xl font-anime font-bold mb-6 text-yellow-200 drop-shadow-[0_0_8px_rgba(255,255,0,0.5)]">How excited are you?</h2>
        <div className="text-7xl mb-8 transition-transform duration-300 ease-out" style={{ transform: `scale(${1 + sliderValue[0] / 200})` }}>
          {currentEmoji}
        </div>
        <Slider
          defaultValue={[0]}
          max={100}
          step={1}
          value={sliderValue}
          onValueChange={setSliderValue}
          className={cn("w-full mb-8", {
            '[&>span:first-child]:bg-red-500': sliderValue[0] < 25,
            '[&>span:first-child]:bg-orange-500': sliderValue[0] >= 25 && sliderValue[0] < 50,
            '[&>span:first-child]:bg-yellow-500': sliderValue[0] >= 50 && sliderValue[0] < 75,
            '[&>span:first-child]:bg-green-500': sliderValue[0] >= 75,
          })}
        />
        <Button
          onClick={handleContinue}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-anime py-6 text-lg rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 w-full"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default SliderProgressBar;