"use client";

import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ParticlesBackground from "@/components/ParticlesBackground";
import { Gift } from "lucide-react";
import LoadingBarAnimation from "@/components/LoadingBarAnimation"; // Import the new component

const Welcome = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showLoading, setShowLoading] = useState(false); // New state for loading animation
  const navigate = useNavigate();

  const handleAnimationComplete = useCallback(() => {
    navigate(`/surprise/${name.trim()}`);
  }, [name, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().toLowerCase() === "kutty thakali") {
      setShowLoading(true); // Show loading animation
    } else {
      setError("Enter: Kutty Thakali");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden p-4">
      <ParticlesBackground />
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl text-white max-w-lg w-full">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-shadow-lg">
            Create a Birthday Surprise!
          </h1>
          <p className="mb-8 text-lg">Enter a name for the magic.</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              className="bg-white/20 border-none text-white text-center text-lg placeholder:text-gray-300 focus:ring-2 focus:ring-pink-500 rounded-lg"
              placeholder="Enter a name"
            />
            {error && (
              <p className="text-red-400 text-sm mt-1">{error}</p>
            )}
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-6 text-lg rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 mt-2"
              disabled={showLoading} // Disable button while loading
            >
              Let's Go <Gift className="ml-2" />
            </Button>
          </form>
        </div>
      </div>
      {showLoading && <LoadingBarAnimation onComplete={handleAnimationComplete} />}
    </div>
  );
};

export default Welcome;