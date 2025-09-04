"use client";

import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ParticlesBackground from "@/components/ParticlesBackground";
import { Gift } from "lucide-react";
import SliderProgressBar from "@/components/SliderProgressBar";
import AnimeCharacter from "@/components/AnimeCharacter"; // Import AnimeCharacter

const Welcome = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showSlider, setShowSlider] = useState(false);
  const [showCharacter, setShowCharacter] = useState(true); // State to control character visibility
  const navigate = useNavigate();

  const handleAnimationComplete = useCallback(() => {
    navigate(`/surprise/${name.trim()}`);
  }, [name, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().toLowerCase() === "kutty thakali") {
      setShowSlider(true); // Show the slider when correct name is entered
      setShowCharacter(false); // Hide character when slider appears
    } else {
      setError("Enter: Kutty Thakali");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden p-4">
      <ParticlesBackground />

      {showCharacter && (
        <AnimeCharacter
          src="/images/image-1.svg" // Using image-1.svg as the anime character
          alt="Welcome Anime Character"
          initialX="-100px"
          initialY="80%"
          targetX="10%"
          targetY="80%"
          duration={1.5}
          delay={0.5}
          animationType="float"
          className="w-32 h-auto md:w-48"
        />
      )}

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl text-white max-w-lg w-full">
          <h1 className="text-4xl md:text-5xl font-anime font-bold mb-4 text-shadow-lg text-pink-300 drop-shadow-[0_0_10px_rgba(255,192,203,0.7)]">
            Welcome to the Anime Surprise!
          </h1>
          <p className="mb-8 text-lg text-yellow-100">Enter a name for the magic.</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              className="bg-purple-300/30 border-none text-white text-center text-lg placeholder:text-purple-100 focus:ring-2 focus:ring-yellow-300 rounded-lg"
              placeholder="Enter a name"
            />
            {error && (
              <p className="text-red-400 text-sm mt-1">{error}</p>
            )}
            <Button
              type="submit"
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-anime py-6 text-lg rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 mt-2"
              disabled={showSlider}
            >
              Let's Go <Gift className="ml-2" />
            </Button>
          </form>
        </div>
      </div>
      {showSlider && <SliderProgressBar onComplete={handleAnimationComplete} />}
    </div>
  );
};

export default Welcome;