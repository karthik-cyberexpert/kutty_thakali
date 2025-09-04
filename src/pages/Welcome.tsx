"use client";

import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ParticlesBackground from "@/components/ParticlesBackground";
import { Gift } from "lucide-react";
import SliderProgressBar from "@/components/SliderProgressBar";
import AnimeCharacterSVG from "@/components/AnimeCharacterSVG";

const Welcome = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showSlider, setShowSlider] = useState(false);
  const [showCharacter, setShowCharacter] = useState(true);
  const navigate = useNavigate();

  const handleAnimationComplete = useCallback(() => {
    navigate(`/surprise/${name.trim()}`);
  }, [name, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().toLowerCase() === "kutty thakali") {
      setShowSlider(true);
      setShowCharacter(false);
    } else {
      setError("Enter: Kutty Thakali");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden p-4">
      <ParticlesBackground />

      {showCharacter && (
        <AnimeCharacterSVG
          expression="default"
          characterColor="#00FFFF" // Neon Cyan
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
        <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-md border border-purple-700/50 rounded-2xl p-8 shadow-2xl text-white max-w-lg w-full"> {/* Futuristic panel */}
          <h1 className="text-4xl md:text-5xl font-anime font-bold mb-4 text-cyan-400 drop-shadow-[0_0_15px_rgba(0,255,255,0.7)]"> {/* Neon text */}
            Welcome to the Cyber-Surprise!
          </h1>
          <p className="mb-8 text-lg text-purple-300">Initiate the magic sequence.</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              className="bg-blue-900/50 border border-cyan-500/50 text-white text-center text-lg placeholder:text-cyan-200 focus:ring-2 focus:ring-pink-500 rounded-lg shadow-inner shadow-cyan-500/20" // Futuristic input
              placeholder="Enter target name"
            />
            {error && (
              <p className="text-red-400 text-sm mt-1">{error}</p>
            )}
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-anime py-6 text-lg rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 mt-2 border border-pink-400 drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]" // Glowing button
              disabled={showSlider}
            >
              Activate <Gift className="ml-2" />
            </Button>
          </form>
        </div>
      </div>
      {showSlider && <SliderProgressBar onComplete={handleAnimationComplete} />}
    </div>
  );
};

export default Welcome;