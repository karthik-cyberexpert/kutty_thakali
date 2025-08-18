import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ParticlesBackground from "@/components/ParticlesBackground";
import { Gift } from "lucide-react";

const Welcome = () => {
  const [name, setName] = useState("Bestie");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      navigate(`/surprise/${name.trim()}`);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <ParticlesBackground />
      <div className="relative z-10 flex flex-col items-center text-center p-4">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl text-white max-w-md w-full">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-shadow-lg">
            Hey Bestie 🎉
          </h1>
          <p className="mb-8 text-lg">Enter Your Name to Open the Gift</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/20 border-none text-white text-center text-lg placeholder:text-gray-300 focus:ring-2 focus:ring-pink-500 rounded-lg"
              placeholder="Enter your name"
            />
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-6 text-lg rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
            >
              Open Your Gift <Gift className="ml-2" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Welcome;